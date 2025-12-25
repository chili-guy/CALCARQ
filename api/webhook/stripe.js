// Serverless function para webhook do Stripe na Vercel
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Configuração para receber body raw
export const config = {
  api: {
    bodyParser: false,
  },
};

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// Funções auxiliares para gerenciar dados
// Na Vercel, usa /tmp para escrita (único diretório disponível)
import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOGS_FILE = path.join(DATA_DIR, 'payment-logs.json');

// Garantir que o diretório existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
  }
  return {};
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
  }
}

function readLogs() {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      const data = fs.readFileSync(LOGS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao ler logs:', error);
  }
  return [];
}

function saveLog(logEntry) {
  try {
    const logs = readLogs();
    logs.push(logEntry);
    const recentLogs = logs.slice(-1000);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(recentLogs, null, 2));
  } catch (error) {
    console.error('Erro ao salvar log:', error);
  }
}

function logPaymentEvent(event, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: details.ip || 'unknown'
  };
  
  console.log(`[${logEntry.timestamp}] ${event}:`, details);
  saveLog(logEntry);
}

function updateUserPayment(userId, hasPaid, stripeCustomerId = null, paymentDate = null) {
  const users = readUsers();
  
  if (users[userId]) {
    users[userId].hasPaid = hasPaid;
    if (stripeCustomerId) {
      users[userId].stripeCustomerId = stripeCustomerId;
    }
    if (paymentDate) {
      users[userId].paymentDate = paymentDate;
    } else if (hasPaid) {
      users[userId].paymentDate = new Date().toISOString();
    }
    saveUsers(users);
    
    logPaymentEvent('USER_PAYMENT_UPDATED', {
      userId,
      hasPaid,
      stripeCustomerId
    });
    
    return users[userId];
  }
  
  return null;
}

function createOrUpdateUser(userId, userData) {
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
    users[userId] = {
      ...users[userId],
      ...userData,
      id: userId
    };
  }
  
  saveUsers(users);
  return users[userId];
}

// Handler do webhook
export default async function handler(req, res) {
  // Apenas aceitar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Na Vercel, quando bodyParser está desabilitado, precisamos ler o body manualmente
  let body;
  
  if (Buffer.isBuffer(req.body)) {
    body = req.body;
  } else if (typeof req.body === 'string') {
    body = Buffer.from(req.body);
  } else {
    // Ler do stream se necessário
    try {
      const chunks = [];
      const stream = req.body || req;
      
      if (stream.readable) {
        for await (const chunk of stream) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        body = Buffer.concat(chunks);
      } else {
        // Se já foi parseado (não deveria acontecer com bodyParser: false)
        body = Buffer.from(JSON.stringify(req.body || {}));
      }
    } catch (error) {
      console.error('Erro ao ler body:', error);
      return res.status(400).json({ error: 'Erro ao ler body da requisição' });
    }
  }

  let event;

  try {
    if (!webhookSecret || webhookSecret === 'whsec_SEU_SECRET_AQUI') {
      console.warn('STRIPE_WEBHOOK_SECRET não configurado. Usando verificação básica.');
      // Em desenvolvimento, podemos processar sem verificação
      const bodyString = body.toString('utf8');
      event = JSON.parse(bodyString);
    } else {
      // Verificar assinatura do Stripe (precisa do body como Buffer)
      if (!Buffer.isBuffer(body)) {
        body = Buffer.from(body);
      }
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }
  } catch (err) {
    logPaymentEvent('WEBHOOK_ERROR', {
      error: err.message,
      ip: req.headers['x-forwarded-for'] || req.ip || 'unknown',
      hasSignature: !!sig,
      hasSecret: !!webhookSecret
    });
    console.error('Erro no webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Processar diferentes tipos de eventos
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.client_reference_id;
        
        logPaymentEvent('CHECKOUT_SESSION_COMPLETED', {
          sessionId: session.id,
          userId,
          amount: session.amount_total,
          currency: session.currency,
          customerEmail: session.customer_details?.email,
          paymentStatus: session.payment_status
        });

        // Verificar se o pagamento foi realmente concluído
        if (session.payment_status === 'paid' && userId) {
          // Atualizar status de pagamento
          const updatedUser = updateUserPayment(
            userId,
            true,
            session.customer,
            new Date().toISOString()
          );

          if (updatedUser) {
            logPaymentEvent('PAYMENT_PROCESSED_SUCCESS', {
              userId,
              sessionId: session.id
            });
          } else {
            // Se usuário não existe, criar
            const newUser = createOrUpdateUser(userId, {
              email: session.customer_details?.email || '',
              name: session.customer_details?.name || '',
              hasPaid: true
            });
            updateUserPayment(userId, true, session.customer, new Date().toISOString());
            
            logPaymentEvent('PAYMENT_PROCESSED_USER_CREATED', {
              userId,
              sessionId: session.id
            });
          }
        } else if (userId) {
          logPaymentEvent('CHECKOUT_SESSION_NOT_PAID', {
            userId,
            sessionId: session.id,
            paymentStatus: session.payment_status
          });
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        logPaymentEvent('PAYMENT_INTENT_SUCCEEDED', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        logPaymentEvent('PAYMENT_INTENT_FAILED', {
          paymentIntentId: failedPayment.id,
          error: failedPayment.last_payment_error?.message
        });
        break;

      default:
        logPaymentEvent('UNKNOWN_WEBHOOK_EVENT', {
          type: event.type
        });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    logPaymentEvent('WEBHOOK_PROCESSING_ERROR', {
      error: error.message,
      eventType: event.type
    });
    console.error('Erro ao processar webhook:', error);
    return res.status(500).json({ error: 'Erro ao processar webhook' });
  }
}

