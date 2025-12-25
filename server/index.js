import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Para todas as rotas, usamos express.json() EXCETO para o webhook
// O webhook precisa receber o body raw, então excluímos essa rota do parsing JSON
app.use((req, res, next) => {
  if (req.path === '/api/webhook/stripe') {
    return next();
  }
  express.json()(req, res, next);
});

// Caminhos dos arquivos de dados
// Na Vercel, usa /tmp para escrita (único diretório disponível)
// No Railway, usa o diretório data normal
const DATA_DIR = process.env.VERCEL 
  ? '/tmp' 
  : path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOGS_FILE = path.join(DATA_DIR, 'payment-logs.json');

// Garantir que o diretório de dados existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Funções auxiliares para gerenciar dados
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
    // Manter apenas os últimos 1000 logs
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

// Atualizar status de pagamento do usuário
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

// Criar ou atualizar usuário
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

// Rotas

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Verificar status de pagamento do usuário
app.get('/api/user/:userId/payment-status', (req, res) => {
  try {
    const { userId } = req.params;
    const users = readUsers();
    const user = users[userId];
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    logPaymentEvent('PAYMENT_STATUS_CHECKED', {
      userId,
      hasPaid: user.hasPaid
    });
    
    res.json({
      userId: user.id,
      hasPaid: user.hasPaid || false,
      paymentDate: user.paymentDate || null,
      stripeCustomerId: user.stripeCustomerId || null
    });
  } catch (error) {
    console.error('Erro ao verificar status de pagamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Sincronizar usuário do frontend
app.post('/api/user/sync', (req, res) => {
  try {
    const { userId, email, name } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }
    
    const user = createOrUpdateUser(userId, { email, name });
    
    logPaymentEvent('USER_SYNCED', {
      userId,
      email
    });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPaid: user.hasPaid || false,
        paymentDate: user.paymentDate || null
      }
    });
  } catch (error) {
    console.error('Erro ao sincronizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar sessão de checkout do Stripe (opcional - para URLs de redirecionamento)
// Nota: Requer PRICE_ID do Stripe configurado em .env
app.post('/api/checkout/create-session', async (req, res) => {
  try {
    const { userId, email, name } = req.body;
    const priceId = process.env.STRIPE_PRICE_ID;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }
    
    // Sincronizar usuário
    createOrUpdateUser(userId, { email, name });
    
    // Se não tiver PRICE_ID configurado, retornar erro
    if (!priceId) {
      return res.status(400).json({ 
        error: 'STRIPE_PRICE_ID não configurado. Use o link direto do Stripe.' 
      });
    }
    
    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: userId,
      success_url: `${frontendUrl}/payment?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${frontendUrl}/payment?canceled=true`,
      customer_email: email,
    });
    
    logPaymentEvent('CHECKOUT_SESSION_CREATED', {
      userId,
      sessionId: session.id
    });
    
    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    logPaymentEvent('CHECKOUT_SESSION_ERROR', {
      error: error.message
    });
    res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
  }
});

// Webhook do Stripe
// IMPORTANTE: Esta rota precisa receber o body RAW (não parseado) para verificar a assinatura
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // O body já deve ser um Buffer devido ao middleware express.raw()
  const body = req.body;

  let event;

  try {
    if (!webhookSecret || webhookSecret === 'whsec_SEU_SECRET_AQUI') {
      console.warn('STRIPE_WEBHOOK_SECRET não configurado. Usando verificação básica.');
      // Em desenvolvimento, podemos processar sem verificação
      event = JSON.parse(body.toString());
    } else {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }
  } catch (err) {
    logPaymentEvent('WEBHOOK_ERROR', {
      error: err.message,
      ip: req.ip,
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
              sessionId: session.id,
              hasPaid: updatedUser.hasPaid
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

    res.json({ received: true });
  } catch (error) {
    logPaymentEvent('WEBHOOK_PROCESSING_ERROR', {
      error: error.message,
      eventType: event.type
    });
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

// Endpoint para verificar pagamento manualmente (fallback)
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    if (!userId || !sessionId) {
      return res.status(400).json({ error: 'userId e sessionId são obrigatórios' });
    }

    // Verificar sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    logPaymentEvent('MANUAL_PAYMENT_VERIFICATION', {
      userId,
      sessionId,
      paymentStatus: session.payment_status
    });

    if (session.payment_status === 'paid' && session.client_reference_id === userId) {
      const updatedUser = updateUserPayment(
        userId,
        true,
        session.customer,
        new Date(session.created * 1000).toISOString()
      );

      if (updatedUser) {
        return res.json({
          success: true,
          hasPaid: true,
          message: 'Pagamento verificado com sucesso'
        });
      }
    }

    res.json({
      success: false,
      hasPaid: false,
      message: 'Pagamento não encontrado ou não confirmado'
    });
  } catch (error) {
    logPaymentEvent('VERIFICATION_ERROR', {
      error: error.message
    });
    console.error('Erro ao verificar pagamento:', error);
    res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
});

// Obter logs de pagamento (protegido - apenas para admin em produção)
app.get('/api/logs', (req, res) => {
  try {
    const logs = readLogs();
    const limit = parseInt(req.query.limit) || 100;
    const filteredLogs = logs.slice(-limit);
    
    res.json({
      total: logs.length,
      showing: filteredLogs.length,
      logs: filteredLogs
    });
  } catch (error) {
    console.error('Erro ao obter logs:', error);
    res.status(500).json({ error: 'Erro ao obter logs' });
  }
});

// Obter estatísticas de pagamento
app.get('/api/stats', (req, res) => {
  try {
    const users = readUsers();
    const logs = readLogs();
    
    const totalUsers = Object.keys(users).length;
    const paidUsers = Object.values(users).filter(u => u.hasPaid).length;
    const paymentEvents = logs.filter(l => 
      l.event === 'CHECKOUT_SESSION_COMPLETED' || 
      l.event === 'PAYMENT_PROCESSED_SUCCESS'
    ).length;
    
    res.json({
      totalUsers,
      paidUsers,
      unpaidUsers: totalUsers - paidUsers,
      paymentEvents,
      conversionRate: totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(2) + '%' : '0%'
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
});

// Servir arquivos estáticos do frontend (apenas em produção no Railway)
// O frontend deve ser buildado antes (npm run build na raiz)
if (process.env.RAILWAY || process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(frontendPath)) {
    // Servir arquivos estáticos
    app.use(express.static(frontendPath));
    
    // Para todas as rotas que não são API, servir o index.html (SPA)
    app.get('*', (req, res, next) => {
      // Se for uma rota de API, não servir o frontend
      if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
        return next();
      }
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
    
    console.log('✅ Frontend estático configurado em:', frontendPath);
  } else {
    console.warn('⚠️ Diretório dist não encontrado. Frontend não será servido.');
  }
}

// Exportar app para uso em serverless functions (Vercel)
export default app;

// Iniciar servidor apenas se não estiver em ambiente serverless (Vercel)
// No Railway, sempre inicia o servidor
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔔 Webhook: http://localhost:${PORT}/api/webhook/stripe`);
    console.log(`📝 Logs: http://localhost:${PORT}/api/logs`);
    if (process.env.RAILWAY) {
      console.log(`🌐 Railway: Servindo frontend + backend`);
    }
  });
}
