// Serverless function para webhook do Stripe na Vercel
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// Funções auxiliares para gerenciar dados
import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOGS_FILE = path.join(DATA_DIR, 'payment-logs.json');

// Garantir que o diretório existe
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Erro ao criar diretório:', error.message);
}

function readUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao ler usuários:', error.message);
  }
  return {};
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuários:', error.message);
    return false;
  }
}

function logEvent(event, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details: typeof details === 'object' ? JSON.stringify(details) : details
  };
  
  console.log(`[${logEntry.timestamp}] ${event}:`, logEntry.details);
  
  // Tentar salvar log (não crítico se falhar)
  try {
    const logs = [];
    if (fs.existsSync(LOGS_FILE)) {
      const data = fs.readFileSync(LOGS_FILE, 'utf8');
      logs.push(...JSON.parse(data));
    }
    logs.push(logEntry);
    const recentLogs = logs.slice(-1000);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(recentLogs, null, 2));
  } catch (error) {
    // Não crítico, apenas logar
    console.error('Erro ao salvar log (não crítico):', error.message);
  }
}

function updateUserPayment(userId, hasPaid, stripeCustomerId = null, paymentDate = null) {
  try {
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
      
      if (saveUsers(users)) {
        logEvent('USER_PAYMENT_UPDATED', { userId, hasPaid });
        return users[userId];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error.message);
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
      users[userId] = {
        ...users[userId],
        ...userData,
        id: userId
      };
    }
    
    if (saveUsers(users)) {
      return users[userId];
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    return null;
  }
}

// Handler do webhook
export default async function handler(req, res) {
  // Log inicial para debug
  console.log('=== WEBHOOK RECEBIDO ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('Body type:', typeof req.body);
  console.log('Body is Buffer:', Buffer.isBuffer(req.body));
  
  // Apenas aceitar POST
  if (req.method !== 'POST') {
    logEvent('WEBHOOK_METHOD_ERROR', { method: req.method });
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('Webhook secret exists:', !!webhookSecret);
  console.log('Signature exists:', !!sig);

  // Tentar ler o body de todas as formas possíveis
  let body;
  
  try {
    if (typeof req.body === 'string') {
      console.log('Body é string, convertendo para Buffer');
      body = Buffer.from(req.body, 'utf8');
    } else if (Buffer.isBuffer(req.body)) {
      console.log('Body já é Buffer');
      body = req.body;
    } else if (req.body && typeof req.body === 'object') {
      console.log('Body é objeto, convertendo para Buffer');
      body = Buffer.from(JSON.stringify(req.body), 'utf8');
    } else {
      console.error('Body não reconhecido:', typeof req.body, req.body);
      logEvent('WEBHOOK_BODY_ERROR', { bodyType: typeof req.body });
      return res.status(400).json({ error: 'Invalid body format' });
    }
    
    console.log('Body length:', body.length);
  } catch (error) {
    console.error('Erro ao processar body:', error.message);
    logEvent('WEBHOOK_BODY_PROCESSING_ERROR', { error: error.message });
    return res.status(400).json({ error: 'Error processing body' });
  }

  let event;

  try {
    if (!webhookSecret || webhookSecret === 'whsec_SEU_SECRET_AQUI') {
      console.warn('Webhook secret não configurado, usando modo básico');
      const bodyString = body.toString('utf8');
      event = JSON.parse(bodyString);
      logEvent('WEBHOOK_PARSED_WITHOUT_VERIFICATION', { eventType: event.type });
    } else {
      console.log('Verificando assinatura do Stripe...');
      if (!Buffer.isBuffer(body)) {
        body = Buffer.from(body);
      }
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      console.log('Assinatura verificada com sucesso');
      logEvent('WEBHOOK_VERIFIED', { eventType: event.type });
    }
  } catch (err) {
    console.error('Erro ao verificar webhook:', err.message);
    console.error('Erro completo:', err);
    logEvent('WEBHOOK_VERIFICATION_ERROR', {
      error: err.message,
      hasSignature: !!sig,
      hasSecret: !!webhookSecret,
      bodyLength: body?.length
    });
    // Retornar 200 para o Stripe não ficar retentando, mas logar o erro
    return res.status(200).json({ 
      received: true, 
      error: 'Verification failed',
      message: err.message 
    });
  }

  // Processar eventos
  try {
    console.log('Processando evento:', event.type);
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.client_reference_id;
        
        console.log('Checkout session completed:', {
          sessionId: session.id,
          userId,
          paymentStatus: session.payment_status
        });
        
        logEvent('CHECKOUT_SESSION_COMPLETED', {
          sessionId: session.id,
          userId,
          paymentStatus: session.payment_status
        });

        if (session.payment_status === 'paid' && userId) {
          console.log('Pagamento confirmado, atualizando usuário:', userId);
          
          const updatedUser = updateUserPayment(
            userId,
            true,
            session.customer,
            new Date().toISOString()
          );

          if (updatedUser) {
            console.log('Usuário atualizado com sucesso');
            logEvent('PAYMENT_PROCESSED_SUCCESS', { userId, sessionId: session.id });
          } else {
            console.log('Usuário não encontrado, criando novo...');
            const newUser = createOrUpdateUser(userId, {
              email: session.customer_details?.email || '',
              name: session.customer_details?.name || '',
              hasPaid: true
            });
            if (newUser) {
              updateUserPayment(userId, true, session.customer, new Date().toISOString());
              console.log('Novo usuário criado e atualizado');
              logEvent('PAYMENT_PROCESSED_USER_CREATED', { userId, sessionId: session.id });
            } else {
              console.error('Falha ao criar usuário');
              logEvent('PAYMENT_PROCESSED_USER_CREATE_FAILED', { userId, sessionId: session.id });
            }
          }
        } else {
          console.log('Pagamento não confirmado ou sem userId:', {
            paymentStatus: session.payment_status,
            userId
          });
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent.id);
        logEvent('PAYMENT_INTENT_SUCCEEDED', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment intent failed:', failedPayment.id);
        logEvent('PAYMENT_INTENT_FAILED', {
          paymentIntentId: failedPayment.id
        });
        break;

      default:
        console.log('Evento desconhecido:', event.type);
        logEvent('UNKNOWN_WEBHOOK_EVENT', { type: event.type });
    }

    console.log('=== WEBHOOK PROCESSADO COM SUCESSO ===');
    return res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Erro ao processar evento:', error.message);
    console.error('Stack:', error.stack);
    logEvent('WEBHOOK_PROCESSING_ERROR', {
      error: error.message,
      eventType: event?.type,
      stack: error.stack?.substring(0, 500)
    });
    // Retornar 200 para o Stripe não ficar retentando
    return res.status(200).json({ 
      received: true,
      error: 'Processing failed',
      message: error.message 
    });
  }
}
