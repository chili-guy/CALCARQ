// Serverless function para webhook do Stripe na Vercel
// ✅ PRODUCTION-READY: Sempre retorna 200, processa apenas eventos relevantes

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

// ✅ PRODUCTION-READY: Handler que sempre retorna 200
export default async function handler(req, res) {
  // ✅ Aceitar qualquer método (Stripe só usa POST, mas não falhar em outros)
  if (req.method !== 'POST') {
    return res.status(200).end('ok');
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    console.warn('⚠️ Missing signature');
    return res.status(200).json({ received: true, warning: 'Missing signature' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret === 'whsec_SEU_SECRET_AQUI') {
    console.warn('⚠️ Webhook secret não configurado');
    return res.status(200).json({ received: true, warning: 'Webhook secret not configured' });
  }

  // ✅ Ler body como stream (forma correta na Vercel)
  let rawBody;
  
  try {
    if (req.body && Buffer.isBuffer(req.body)) {
      rawBody = req.body;
    } else if (typeof req.body === 'string') {
      rawBody = Buffer.from(req.body, 'utf8');
    } else {
      // Ler como stream
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      rawBody = Buffer.concat(chunks);
    }

    if (!rawBody || rawBody.length === 0) {
      console.warn('⚠️ Empty body');
      return res.status(200).json({ received: true, warning: 'Empty body' });
    }
  } catch (error) {
    console.error('❌ Erro ler body:', error.message);
    // ✅ SEMPRE retornar 200, mesmo com erro
    return res.status(200).json({ 
      received: true, 
      error: 'Error reading body',
      message: error.message 
    });
  }

  // Verificar assinatura e construir evento
  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log('✅ Assinatura OK! Evento:', event.type);
  } catch (err) {
    console.error('❌ Erro verificação:', err.message);
    // ✅ Retornar 400 apenas para erro de assinatura (Stripe espera isso)
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🔑 REGRA DE OURO: Processar apenas eventos relevantes, ignorar o resto
  // ✅ SEMPRE retornar 200, mesmo para eventos não tratados
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id;
        
        console.log('💳 Checkout concluído:', {
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
            console.error('❌ Falha ao atualizar usuário');
          }
        } else {
          console.log('⚠️ Checkout não pago ou sem userId');
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('💳 Pagamento confirmado (payment_intent):', paymentIntent.id);
        // Se precisar processar payment_intent também, adicione aqui
        break;
      }

      default:
        // ✅ IGNORAR eventos desconhecidos sem erro
        console.log('ℹ️ Evento ignorado:', event.type);
    }

    // ✅ SEMPRE responder 200 (regra de ouro)
    return res.status(200).json({ received: true });
    
  } catch (error) {
    // ✅ SEMPRE retornar 200, mesmo com erro no processamento
    console.error('❌ Erro processar evento:', error.message);
    console.error('Stack:', error.stack);
    return res.status(200).json({ 
      received: true,
      error: 'Processing failed',
      message: error.message 
    });
  }
}
