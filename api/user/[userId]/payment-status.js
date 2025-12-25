// Serverless function para verificar status de pagamento
import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    const users = readUsers();
    const user = users[userId];
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    return res.json({
      userId: user.id,
      hasPaid: user.hasPaid || false,
      paymentDate: user.paymentDate || null,
      stripeCustomerId: user.stripeCustomerId || null
    });
  } catch (error) {
    console.error('Erro ao verificar status de pagamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

