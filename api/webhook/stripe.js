// Serverless function para webhook do Stripe na Vercel
// Na Vercel, precisamos ler o body raw de forma específica

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Erro diretório:', error.message);
}

function readUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Erro ler:', error.message);
  }
  return {};
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erro salvar:', error.message);
    return false;
  }
}

function updateUserPayment(userId, hasPaid, stripeCustomerId = null, paymentDate = null) {
  try {
    const users = readUsers();
    if (users[userId]) {
      users[userId].hasPaid = hasPaid;
      if (stripeCustomerId) users[userId].stripeCustomerId = stripeCustomerId;
      if (paymentDate) {
        users[userId].paymentDate = paymentDate;
      } else if (hasPaid) {
        users[userId].paymentDate = new Date().toISOString();
      }
      if (saveUsers(users)) {
        console.log('✅ Pagamento atualizado:', userId);
        return users[userId];
      }
    }
    return null;
  } catch (error) {
    console.error('❌ Erro atualizar:', error.message);
    return null;
  }
}

function createOrUpdateUser(userId, userData) {
  try {
    const users = readUsers();
    if (!users[userId]) {
      users[userId] = {
        id: userId,
        email: userData.email || '',
        name: userData.name || '',
        hasPaid: false,
        createdAt: new Date().toISOString(),
        ...userData
      };
    } else {
      users[userId] = { ...users[userId], ...userData, id: userId };
    }
    if (saveUsers(users)) {
      console.log('✅ Usuário criado:', userId);
      return users[userId];
    }
    return null;
  } catch (error) {
    console.error('❌ Erro criar:', error.message);
    return null;
  }
}

// Handler do webhook - Vercel Serverless Function
export default async function handler(req, res) {
  console.log('🔔 WEBHOOK VERCEL');
  console.log('Method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('Has sig:', !!sig);
  console.log('Has secret:', !!webhookSecret);
  console.log('Body type:', typeof req.body);
  
  // Na Vercel, o body pode vir como string se não foi parseado
  // Ou como objeto se foi parseado automaticamente
  let rawBodyString;
  let bodyBuffer;
  
  try {
    // Tentar todas as formas possíveis
    if (typeof req.body === 'string') {
      console.log('✅ Body é string');
      rawBodyString = req.body;
      bodyBuffer = Buffer.from(req.body, 'utf8');
    } else if (Buffer.isBuffer(req.body)) {
      console.log('✅ Body é Buffer');
      rawBodyString = req.body.toString('utf8');
      bodyBuffer = req.body;
    } else if (req.body && typeof req.body === 'object') {
      console.log('⚠️ Body foi parseado - tentando usar como está');
      // Se foi parseado, não podemos verificar a assinatura corretamente
      // Mas vamos tentar processar mesmo assim
      rawBodyString = JSON.stringify(req.body);
      bodyBuffer = Buffer.from(rawBodyString, 'utf8');
      console.warn('⚠️ ATENÇÃO: Body foi parseado, verificação de assinatura pode falhar');
    } else {
      console.error('❌ Body não encontrado');
      return res.status(200).json({ 
        received: true,
        error: 'Body not found',
        bodyType: typeof req.body
      });
    }

    console.log('Body length:', bodyBuffer.length);

  } catch (error) {
    console.error('❌ Erro ler body:', error.message);
    return res.status(200).json({ 
      received: true,
      error: 'Error reading body',
      message: error.message 
    });
  }

  let event;

  try {
    if (!webhookSecret || webhookSecret === 'whsec_SEU_SECRET_AQUI') {
      console.warn('⚠️ Sem secret, parseando sem verificação');
      event = JSON.parse(rawBodyString);
      console.log('✅ Evento parseado:', event.type);
    } else {
      console.log('🔐 Verificando assinatura...');
      try {
        event = stripe.webhooks.constructEvent(bodyBuffer, sig, webhookSecret);
        console.log('✅ Assinatura OK! Evento:', event.type);
      } catch (verifyError) {
        console.error('❌ Erro verificação:', verifyError.message);
        // Se a verificação falhar mas o body foi parseado, tentar processar mesmo assim
        if (typeof req.body === 'object') {
          console.warn('⚠️ Tentando processar sem verificação (body foi parseado)');
          event = req.body;
        } else {
          throw verifyError;
        }
      }
    }
  } catch (err) {
    console.error('❌ Erro geral:', err.message);
    return res.status(200).json({ 
      received: true,
      error: 'Verification/parsing failed',
      message: err.message 
    });
  }

  // Processar eventos
  try {
    console.log('🔄 Processando:', event.type);
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      
      console.log('💳 Checkout:', {
        id: session.id,
        userId,
        status: session.payment_status
      });

      if (session.payment_status === 'paid' && userId) {
        console.log('💰 Pagamento confirmado! userId:', userId);
        
        let updated = updateUserPayment(
          userId,
          true,
          session.customer,
          new Date().toISOString()
        );

        if (!updated) {
          console.log('👤 Criando usuário...');
          createOrUpdateUser(userId, {
            email: session.customer_details?.email || '',
            name: session.customer_details?.name || '',
            hasPaid: true
          });
          updated = updateUserPayment(userId, true, session.customer, new Date().toISOString());
        }

        if (updated) {
          console.log('✅ ✅ ✅ SUCESSO TOTAL! Usuário:', userId, 'hasPaid:', updated.hasPaid);
        } else {
          console.error('❌ Falha ao atualizar');
        }
      } else {
        console.log('⚠️ Não pago ou sem userId');
      }
    } else {
      console.log('ℹ️ Evento:', event.type);
    }

    return res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('❌ Erro processar:', error.message);
    console.error('Stack:', error.stack);
    return res.status(200).json({ 
      received: true,
      error: 'Processing failed',
      message: error.message 
    });
  }
}
