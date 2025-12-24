# Guia de Deploy - Calcularq

## Estrutura do Projeto

O projeto consiste em duas partes:
1. **Frontend** (React + Vite) - `src/`
2. **Backend** (Node.js + Express) - `server/`

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Stripe (com chaves de API)
- Servidor para deploy (Vercel, Railway, Heroku, etc.)

## Configuração Local

### 1. Frontend

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env e definir VITE_API_URL

# Executar em desenvolvimento
npm run dev
```

### 2. Backend

```bash
cd server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves do Stripe

# Executar em desenvolvimento
npm run dev
```

## Configuração do Stripe

### 1. Obter Chaves de API

1. Acesse https://dashboard.stripe.com/apikeys
2. Copie a **Secret key** (começa com `sk_test_` ou `sk_live_`)
3. Adicione ao arquivo `server/.env` como `STRIPE_SECRET_KEY`

### 2. Configurar Webhook

1. Acesse https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. URL do endpoint: `https://seu-dominio-backend.com/api/webhook/stripe`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copie o **Signing secret** (começa com `whsec_`)
6. Adicione ao arquivo `server/.env` como `STRIPE_WEBHOOK_SECRET`

### 3. Atualizar Link de Checkout

No link do Stripe Checkout, adicione o parâmetro `client_reference_id`:
```
https://buy.stripe.com/test_28E9AM9Ke6nGaYRdCS73G01?client_reference_id={USER_ID}
```

## Deploy

### Opção 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend (Vercel)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `VITE_API_URL`: URL do seu backend
3. Deploy automático

#### Backend (Railway/Render)

1. Conecte o diretório `server/` ao serviço
2. Configure as variáveis de ambiente:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `FRONTEND_URL`: URL do seu frontend
   - `PORT`: Deixe o serviço definir automaticamente
3. Atualize a URL do webhook no Stripe

### Opção 2: Deploy Completo (Vercel)

Para deploy tudo junto no Vercel:

1. Crie um arquivo `vercel.json` na raiz:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

2. Configure variáveis de ambiente no Vercel
3. Deploy

## Verificação Pós-Deploy

1. Teste o health check: `https://seu-backend.com/health`
2. Teste o webhook do Stripe usando o dashboard
3. Faça um pagamento de teste
4. Verifique os logs: `https://seu-backend.com/api/logs`

## Monitoramento

- Logs de pagamento: `/api/logs`
- Estatísticas: `/api/stats`
- Health check: `/health`

## Troubleshooting

### Webhook não está funcionando

1. Verifique se `STRIPE_WEBHOOK_SECRET` está correto
2. Verifique se a URL do webhook está acessível publicamente
3. Use o Stripe CLI para testar localmente:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhook/stripe
   ```

### Frontend não consegue conectar ao backend

1. Verifique se `VITE_API_URL` está correto
2. Verifique CORS no backend
3. Verifique se o backend está rodando

### Pagamentos não estão sendo processados

1. Verifique os logs: `/api/logs`
2. Verifique se o `client_reference_id` está sendo passado corretamente
3. Verifique se o webhook está recebendo eventos no Stripe Dashboard
