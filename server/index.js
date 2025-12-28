import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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
const RESET_TOKENS_FILE = path.join(DATA_DIR, 'reset-tokens.json');

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

// Funções para gerenciar tokens de reset de senha
function readResetTokens() {
  try {
    if (fs.existsSync(RESET_TOKENS_FILE)) {
      const data = fs.readFileSync(RESET_TOKENS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao ler tokens de reset:', error);
  }
  return {};
}

function saveResetTokens(tokens) {
  try {
    fs.writeFileSync(RESET_TOKENS_FILE, JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error('Erro ao salvar tokens de reset:', error);
  }
}

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Buscar usuário por email no backend
function getUserByEmail(email) {
  const users = readUsers();
  return Object.values(users).find(user => user.email === email);
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

// Configurar transporter de email
function createEmailTransporter() {
  // Usar variáveis de ambiente ou configuração padrão
  const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  };

  // Se não tiver credenciais configuradas, retornar null (modo de desenvolvimento)
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('⚠️ SMTP não configurado. Emails não serão enviados. Configure SMTP_USER e SMTP_PASS.');
    return null;
  }

  return nodemailer.createTransport(emailConfig);
}

// Endpoint para solicitar reset de senha
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Buscar usuário por email
    const user = getUserByEmail(email);
    
    // Sempre retornar sucesso (não revelar se o email existe ou não por segurança)
    if (!user) {
      // Mas ainda assim logar internamente
      logPaymentEvent('FORGOT_PASSWORD_ATTEMPT_UNKNOWN_EMAIL', { email });
      return res.json({ success: true, message: 'Se o email existir, você receberá instruções para redefinir sua senha.' });
    }

    // Gerar token de reset
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token
    const tokens = readResetTokens();
    tokens[token] = {
      userId: user.id,
      email: user.email,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString()
    };
    saveResetTokens(tokens);

    logPaymentEvent('FORGOT_PASSWORD_TOKEN_GENERATED', {
      userId: user.id,
      email: user.email
    });

    // Configurar email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const transporter = createEmailTransporter();
    
    if (transporter) {
      // Enviar email
      const smtpUser = process.env.SMTP_USER || '';
      const mailOptions = {
        from: process.env.SMTP_FROM || smtpUser,
        to: user.email,
        subject: 'Redefinição de Senha - Calcularq',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #001f54;">Redefinição de Senha</h2>
            <p>Olá,</p>
            <p>Você solicitou a redefinição de senha da sua conta Calcularq.</p>
            <p>Clique no botão abaixo para redefinir sua senha:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #001f54; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Redefinir Senha</a>
            <p>Ou copie e cole este link no seu navegador:</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">Este link expira em 1 hora.</p>
            <p style="color: #999; font-size: 12px;">Se você não solicitou esta redefinição, ignore este email.</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        logPaymentEvent('FORGOT_PASSWORD_EMAIL_SENT', {
          userId: user.id,
          email: user.email
        });
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        logPaymentEvent('FORGOT_PASSWORD_EMAIL_ERROR', {
          userId: user.id,
          email: user.email,
          error: emailError.message
        });
        // Ainda retornar sucesso, mas logar o erro
      }
    } else {
      // Modo desenvolvimento: logar o token
      console.log('🔑 Token de reset (desenvolvimento):', token);
      console.log('🔗 URL de reset:', resetUrl);
      logPaymentEvent('FORGOT_PASSWORD_TOKEN_GENERATED_DEV', {
        userId: user.id,
        email: user.email,
        token: token,
        resetUrl: resetUrl
      });
    }

    res.json({ 
      success: true, 
      message: 'Se o email existir, você receberá instruções para redefinir sua senha.' 
    });
  } catch (error) {
    console.error('Erro ao processar forgot password:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para resetar senha com token
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar token
    const tokens = readResetTokens();
    const tokenData = tokens[token];

    if (!tokenData) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    // Verificar se o token expirou
    const expiresAt = new Date(tokenData.expiresAt);
    if (expiresAt < new Date()) {
      // Remover token expirado
      delete tokens[token];
      saveResetTokens(tokens);
      return res.status(400).json({ error: 'Token expirado. Solicite um novo link de redefinição.' });
    }

    // Token válido - retornar informações para o frontend atualizar a senha
    // Como a senha é armazenada no localStorage do frontend, apenas retornamos sucesso
    // e o frontend fará a atualização local
    logPaymentEvent('RESET_PASSWORD_TOKEN_VALIDATED', {
      userId: tokenData.userId,
      email: tokenData.email
    });

    // Remover token usado
    delete tokens[token];
    saveResetTokens(tokens);

    res.json({
      success: true,
      userId: tokenData.userId,
      email: tokenData.email,
      message: 'Token válido. Você pode redefinir sua senha.'
    });
  } catch (error) {
    console.error('Erro ao processar reset password:', error);
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
      case 'checkout.session.completed': {
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
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        logPaymentEvent('PAYMENT_INTENT_SUCCEEDED', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata,
          customer: paymentIntent.customer
        });
        
        // Tentar encontrar o userId através de metadata ou buscar a sessão de checkout
        let userId = null;
        
        // Opção 1: userId pode estar em metadata
        if (paymentIntent.metadata && paymentIntent.metadata.userId) {
          userId = paymentIntent.metadata.userId;
          logPaymentEvent('FOUND_USER_ID_IN_METADATA', {
            userId,
            paymentIntentId: paymentIntent.id
          });
        }
        
        // Opção 2: Buscar a sessão de checkout relacionada
        if (!userId) {
          try {
            // Buscar todas as sessões de checkout recentes e verificar se alguma tem este payment_intent
            const sessions = await stripe.checkout.sessions.list({
              limit: 100,
              created: { gte: Math.floor(Date.now() / 1000) - 3600 } // Última hora
            });
            
            logPaymentEvent('SEARCHING_CHECKOUT_SESSIONS', {
              paymentIntentId: paymentIntent.id,
              sessionsFound: sessions.data.length
            });
            
            for (const session of sessions.data) {
              // Verificar se o payment_intent está relacionado a esta sessão
              const sessionPaymentIntent = session.payment_intent;
              const sessionPaymentIntentId = typeof sessionPaymentIntent === 'string' 
                ? sessionPaymentIntent 
                : (sessionPaymentIntent?.id || null);
              
              if (sessionPaymentIntentId === paymentIntent.id) {
                userId = session.client_reference_id;
                logPaymentEvent('FOUND_CHECKOUT_SESSION', {
                  sessionId: session.id,
                  userId,
                  paymentIntentId: paymentIntent.id,
                  sessionPaymentIntent: sessionPaymentIntentId
                });
                break;
              }
            }
            
            // Se não encontrou, tentar buscar por charge (última tentativa)
            if (!userId && paymentIntent.latest_charge) {
              try {
                const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
                // Charge pode ter metadata ou customer
                if (charge.metadata && charge.metadata.userId) {
                  userId = charge.metadata.userId;
                  logPaymentEvent('FOUND_USER_ID_IN_CHARGE', {
                    userId,
                    chargeId: charge.id
                  });
                }
              } catch (chargeError) {
                console.error('Erro ao buscar charge:', chargeError);
              }
            }
          } catch (error) {
            console.error('Erro ao buscar sessão de checkout:', error);
            logPaymentEvent('ERROR_FINDING_SESSION', {
              error: error.message,
              paymentIntentId: paymentIntent.id
            });
          }
        }
        
        // Opção 3: Se ainda não encontrou, buscar por customer (se houver)
        if (!userId && paymentIntent.customer) {
          try {
            const customer = await stripe.customers.retrieve(paymentIntent.customer);
            if (customer && !customer.deleted && customer.metadata && customer.metadata.userId) {
              userId = customer.metadata.userId;
              logPaymentEvent('FOUND_USER_ID_IN_CUSTOMER', {
                userId,
                customerId: paymentIntent.customer
              });
            }
          } catch (error) {
            console.error('Erro ao buscar customer:', error);
          }
        }
        
        // Se encontrou userId, atualizar status de pagamento
        if (userId) {
          const updatedUser = updateUserPayment(
            userId,
            true,
            paymentIntent.customer || null,
            new Date(paymentIntent.created * 1000).toISOString()
          );
          
          if (updatedUser) {
            logPaymentEvent('PAYMENT_PROCESSED_FROM_INTENT', {
              userId,
              paymentIntentId: paymentIntent.id,
              hasPaid: updatedUser.hasPaid,
              amount: paymentIntent.amount
            });
          } else {
            // Se usuário não existe, tentar criar com dados disponíveis
            // Nota: payment_intent pode não ter email/nome, então criamos apenas com userId
            const newUser = createOrUpdateUser(userId, {
              email: '',
              name: '',
              hasPaid: true
            });
            updateUserPayment(userId, true, paymentIntent.customer || null, new Date(paymentIntent.created * 1000).toISOString());
            
            logPaymentEvent('PAYMENT_PROCESSED_USER_CREATED_FROM_INTENT', {
              userId,
              paymentIntentId: paymentIntent.id
            });
          }
        } else {
          logPaymentEvent('PAYMENT_INTENT_NO_USER_ID', {
            paymentIntentId: paymentIntent.id,
            metadata: paymentIntent.metadata,
            customer: paymentIntent.customer,
            warning: 'Pagamento processado mas não foi possível identificar o usuário'
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object;
        logPaymentEvent('PAYMENT_INTENT_FAILED', {
          paymentIntentId: failedPayment.id,
          error: failedPayment.last_payment_error?.message
        });
        break;
      }

      default: {
        logPaymentEvent('UNKNOWN_WEBHOOK_EVENT', {
          type: event.type
        });
        break;
      }
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
    const { userId, sessionId, paymentIntentId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    // Opção 1: Verificar por sessionId (checkout session)
    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        logPaymentEvent('MANUAL_PAYMENT_VERIFICATION_SESSION', {
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
              message: 'Pagamento verificado com sucesso (via session)'
            });
          }
        }
      } catch (sessionError) {
        console.error('Erro ao verificar session:', sessionError);
      }
    }

    // Opção 2: Verificar por paymentIntentId
    if (paymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        logPaymentEvent('MANUAL_PAYMENT_VERIFICATION_INTENT', {
          userId,
          paymentIntentId,
          status: paymentIntent.status
        });

        if (paymentIntent.status === 'succeeded') {
          // Buscar sessão relacionada
          const sessions = await stripe.checkout.sessions.list({
            limit: 100,
            created: { gte: Math.floor(Date.now() / 1000) - 3600 }
          });

          for (const session of sessions.data) {
            const sessionPaymentIntent = session.payment_intent;
            const sessionPaymentIntentId = typeof sessionPaymentIntent === 'string' 
              ? sessionPaymentIntent 
              : (sessionPaymentIntent?.id || null);
            
            if (sessionPaymentIntentId === paymentIntentId && session.client_reference_id === userId) {
              const updatedUser = updateUserPayment(
                userId,
                true,
                paymentIntent.customer || null,
                new Date(paymentIntent.created * 1000).toISOString()
              );

              if (updatedUser) {
                return res.json({
                  success: true,
                  hasPaid: true,
                  message: 'Pagamento verificado com sucesso (via payment intent)'
                });
              }
            }
          }

          // Se não encontrou sessão, mas o payment intent está succeeded, atualizar mesmo assim
          // (para casos onde o Payment Link não cria sessão)
          const updatedUser = updateUserPayment(
            userId,
            true,
            paymentIntent.customer || null,
            new Date(paymentIntent.created * 1000).toISOString()
          );

          if (updatedUser) {
            logPaymentEvent('PAYMENT_VERIFIED_WITHOUT_SESSION', {
              userId,
              paymentIntentId
            });
            return res.json({
              success: true,
              hasPaid: true,
              message: 'Pagamento verificado com sucesso (sem sessão)'
            });
          }
        }
      } catch (intentError) {
        console.error('Erro ao verificar payment intent:', intentError);
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
