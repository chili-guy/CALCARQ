// Serverless function para sincronizar usuário
import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, name } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }
    
    const user = createOrUpdateUser(userId, { email, name });
    
    return res.json({
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
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}




