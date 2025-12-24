# Calcularq - Calculadora de Arquitetura

Sistema completo de precificação de projetos arquitetônicos com integração de pagamentos via Stripe.

## 🚀 Funcionalidades

- ✅ Calculadora de precificação por complexidade
- ✅ Sistema de autenticação de usuários
- ✅ Integração completa com Stripe para pagamentos
- ✅ Webhook automático para verificação de pagamentos
- ✅ Histórico de orçamentos salvos
- ✅ Logs e auditoria de pagamentos
- ✅ Interface moderna e responsiva

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Stripe (para processamento de pagamentos)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd CALCARQ\ V.1
```

### 2. Instalar dependências do Frontend

```bash
npm install
```

### 3. Instalar dependências do Backend

```bash
cd server
npm install
cd ..
```

### 4. Configurar variáveis de ambiente

#### Frontend

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001
```

#### Backend

Crie um arquivo `.env` em `server/`:

```env
STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_secret_aqui
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## 🏃 Executar em Desenvolvimento

### Terminal 1 - Backend

```bash
cd server
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### Terminal 2 - Frontend

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 📦 Build para Produção

### Frontend

```bash
npm run build
```

### Backend

O backend já está pronto para produção. Basta configurar as variáveis de ambiente.

## 🔧 Configuração do Stripe

### 1. Obter Chaves de API

1. Acesse https://dashboard.stripe.com/apikeys
2. Copie a **Secret key**
3. Adicione ao `server/.env`

### 2. Configurar Webhook

1. Acesse https://dashboard.stripe.com/webhooks
2. Adicione endpoint: `https://seu-backend.com/api/webhook/stripe`
3. Selecione eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copie o **Signing secret** e adicione ao `server/.env`

Veja mais detalhes em [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Estrutura do Projeto

```
CALCARQ V.1/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── contexts/          # Context API
│   ├── lib/               # Bibliotecas e utilitários
│   └── utils/             # Funções utilitárias
├── server/                # Backend Node.js
│   ├── index.js          # Servidor Express
│   ├── data/             # Dados (JSON files)
│   └── package.json      # Dependências do backend
├── public/               # Arquivos estáticos
└── package.json          # Dependências do frontend
```

## 🔐 Segurança

- Senhas devem ser hasheadas em produção (atualmente em texto plano apenas para desenvolvimento)
- Webhooks do Stripe são verificados com assinatura
- CORS configurado para permitir apenas o frontend autorizado
- Variáveis sensíveis em arquivos `.env`

## 📊 API Endpoints

### Backend

- `GET /health` - Health check
- `GET /api/user/:userId/payment-status` - Status de pagamento
- `POST /api/user/sync` - Sincronizar usuário
- `POST /api/webhook/stripe` - Webhook do Stripe
- `POST /api/payment/verify` - Verificar pagamento manualmente
- `GET /api/logs` - Logs de pagamento
- `GET /api/stats` - Estatísticas

## 🚢 Deploy

Veja o guia completo em [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 Licença

Todos os direitos reservados - calcularq.com.br

## 🤝 Suporte

Email: atendimento.calcularq@gmail.com
