// Serverless function para webhook do Stripe na Vercel
// IMPORTANTE: Na Vercel, o body precisa ser lido de forma específica

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Garantir diretório
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Aviso diretório:', error.message);
}

function readUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Erro ler usuários:', error.message);
  }
  return {};
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erro salvar usuários:', error.message);
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
    console.error('❌ Erro atualizar pagamento:', error.message);
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
      console.log('✅ Usuário criado/atualizado:', userId);
      return users[userId];
    }
    return null;
  } catch (error) {
    console.error('❌ Erro criar usuário:', error.message);
    return null;
  }
}

// Handler do webhook - Vercel Serverless Function
export default async function handler(req, res) {
  console.log('🔔 === WEBHOOK VERCEL ===');
  console.log('Method:', req.method);
  console.log('Headers keys:', Object.keys(req.headers));
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('Has signature:', !!sig);
  console.log('Has secret:', !!webhookSecret);
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', req.body ? Object.keys(req.body) : 'null');

  // Na Vercel, o body pode vir de diferentes formas
  // Vamos tentar todas as possibilidades
  let rawBody;
  
  try {
    // Opção 1: Body já é string (não parseado)
    if (typeof req.body === 'string') {
      console.log('✅ Body é string');
      rawBody = req.body;
    }
    // Opção 2: Body é Buffer
    else if (Buffer.isBuffer(req.body)) {
      console.log('✅ Body é Buffer');
      rawBody = req.body.toString('utf8');
    }
    // Opção 3: Body foi parseado como objeto (problema!)
    else if (req.body && typeof req.body === 'object') {
      console.log('⚠️ Body foi parseado como objeto - tentando reconstruir');
      // Tentar reconstruir o JSON original
      rawBody = JSON.stringify(req.body);
      console.log('⚠️ Body reconstruído (pode não funcionar para verificação)');
    }
    // Opção 4: Body está em req.rawBody (algumas versões da Vercel)
    else if (req.rawBody) {
      console.log('✅ Body em req.rawBody');
      rawBody = typeof req.rawBody === 'string' ? req.rawBody : req.rawBody.toString('utf8');
    }
    // Opção 5: Tentar ler do stream (último recurso)
    else {
      console.error('❌ Body não encontrado em nenhum formato conhecido');
      console.error('Body value:', req.body);
      return res.status(200).json({ 
        received: true,
        error: 'Body not found',
        bodyType: typeof req.body
      });
    }

    console.log('📏 Raw body length:', rawBody.length);
    console.log('📄 Body preview:', rawBody.substring(0, 100));

  } catch (error) {
    console.error('❌ Erro ao ler body:', error.message);
    return res.status(200).json({ 
      received: true,
      error: 'Error reading body',
      message: error.message 
    });
  }

  // Converter para Buffer para verificação
  const bodyBuffer = Buffer.from(rawBody, 'utf8');
  let event;

  try {
    if (!webhookSecret || webhookSecret === 'whsec_SEU_SECRET_AQUI') {
      console.warn('⚠️ Sem webhook secret, parseando sem verificação');
      event = JSON.parse(rawBody);
      console.log('✅ Evento parseado:', event.type);
    } else {
      console.log('🔐 Verificando assinatura...');
      event = stripe.webhooks.constructEvent(bodyBuffer, sig, webhookSecret);
      console.log('✅ Assinatura verificada! Evento:', event.type);
    }
  } catch (err) {
    console.error('❌ Erro verificação:', err.message);
    console.error('Erro completo:', err);
    // Retornar 200 mas logar
    return res.status(200).json({ 
      received: true,
      error: 'Verification failed',
      message: err.message 
    });
  }

  // Processar eventos
  try {
    console.log('🔄 Processando:', event.type);
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      
      console.log('💳 Checkout completed:', {
        sessionId: session.id,
        userId,
        status: session.payment_status
      });

      if (session.payment_status === 'paid' && userId) {
        console.log('💰 Pagamento pago! userId:', userId);
        
        let updated = updateUserPayment(
          userId,
          true,
          session.customer,
          new Date().toISOString()
        );

        if (!updated) {
          console.log('👤 Criando novo usuário...');
          createOrUpdateUser(userId, {
            email: session.customer_details?.email || '',
            name: session.customer_details?.name || '',
            hasPaid: true
          });
          updated = updateUserPayment(userId, true, session.customer, new Date().toISOString());
        }

        if (updated) {
          console.log('✅ ✅ ✅ SUCESSO! Usuário atualizado:', userId);
        } else {
          console.error('❌ Falha ao atualizar usuário');
        }
      }
    } else {
      console.log('ℹ️ Evento ignorado:', event.type);
    }

    console.log('✅ === SUCESSO ===');
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
