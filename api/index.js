// Serverless function para a Vercel
// Este arquivo é um wrapper que importa o servidor Express

import app from '../server/index.js';

// Exportar como handler para Vercel
export default app;

