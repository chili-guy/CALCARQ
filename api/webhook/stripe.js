// Serverless function para webhook do Stripe na Vercel
// ✅ CORRIGIDO: Lê body como stream (compatível com Vercel)

import Stripe from 'stripe';

// ✅ CRÍTICO: Garantir Node.js runtime (não Edge)
export const runtime = 'nodejs';

// ✅ CRÍTICO: Desabilitar bodyParser para receber body raw
export const config = {
  api: {
    bodyParser: false,
  },
};

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

// ✅ CORRIGIDO: Handler que lê body como stream (compatível Vercel)
export default async function handler(req, res) {
  console.log('🔔 WEBHOOK VERCEL - INÍCIO');
  console.log('Method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('Has sig:', !!sig);
  console.log('Has secret:', !!webhookSecret);

  // ✅ CRÍTICO: Ler body como stream (forma correta na Vercel)
  let rawBody;
  
  try {
    // Na Vercel, com bodyParser: false, o body pode vir como:
    // 1. Stream (precisa ler com for await)
    // 2. Buffer direto
    // 3. String
    
    if (req.body && Buffer.isBuffer(req.body)) {
      // Já é Buffer
      console.log('✅ Body é Buffer');
      rawBody = req.body;
    } else if (typeof req.body === 'string') {
      // É string
      console.log('✅ Body é string');
      rawBody = Buffer.from(req.body, 'utf8');
    } else if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      // Foi parseado (não deveria acontecer com bodyParser: false)
      console.warn('⚠️ Body foi parseado - tentando reconstruir');
      rawBody = Buffer.from(JSON.stringify(req.body), 'utf8');
    } else {
      // Tentar ler como stream
      console.log('📥 Lendo body como stream...');
      const chunks = [];
      
      // ✅ FORMA CORRETA: for await (compatível Vercel)
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      
      rawBody = Buffer.concat(chunks);
      console.log('✅ Body lido do stream, tamanho:', rawBody.length);
    }

    if (!rawBody || rawBody.length === 0) {
      console.error('❌ Body vazio');
      return res.status(400).json({ error: 'Empty body' });
    }

    console.log('📏 Body length:', rawBody.length);

  } catch (error) {
    console.error('❌ Erro ler body:', error.message);
    console.error('Stack:', error.stack);
    return res.status(400).json({ 
      error: 'Error reading body',
      message: error.message 
    });
  }

  // Verificar assinatura e construir evento
  let event;

  try {
    if (!webhookSecret || webhookSecret === 'whsec_SEU_SECRET_AQUI') {
      console.warn('⚠️ Sem secret, parseando sem verificação');
      event = JSON.parse(rawBody.toString('utf8'));
      console.log('✅ Evento parseado:', event.type);
    } else {
      console.log('🔐 Verificando assinatura...');
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      console.log('✅ Assinatura OK! Evento:', event.type);
    }
  } catch (err) {
    console.error('❌ Erro verificação:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
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
