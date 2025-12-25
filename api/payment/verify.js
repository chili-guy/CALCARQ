// Serverless function para verificar pagamento manualmente
import Stripe from 'stripe';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

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
    return users[userId];
  }
  
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, sessionId } = req.body;

    if (!userId || !sessionId) {
      return res.status(400).json({ error: 'userId e sessionId são obrigatórios' });
    }

    // Verificar sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

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

    return res.json({
      success: false,
      hasPaid: false,
      message: 'Pagamento não encontrado ou não confirmado'
    });
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
}


