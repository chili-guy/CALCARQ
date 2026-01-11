# 📁 Estrutura de API - Serverless Functions Vercel

## Estrutura Criada

```
api/
├── webhook/
│   └── stripe.js          # Webhook do Stripe (recebe body raw)
├── user/
│   ├── sync.js            # Sincronizar usuário
│   └── [userId]/
│       └── payment-status.js  # Verificar status de pagamento
├── payment/
│   └── verify.js          # Verificar pagamento manualmente
└── health.js              # Health check
```

## Como Funciona na Vercel

A Vercel automaticamente detecta arquivos em `api/` e os transforma em serverless functions:

- `api/webhook/stripe.js` → `/api/webhook/stripe`
- `api/user/sync.js` → `/api/user/sync`
- `api/user/[userId]/payment-status.js` → `/api/user/:userId/payment-status`
- `api/payment/verify.js` → `/api/payment/verify`
- `api/health.js` → `/api/health`

## Configuração Especial do Webhook

O webhook do Stripe (`api/webhook/stripe.js`) tem uma configuração especial:

```javascript
export const config = {
  api: {
    bodyParser: false, // Recebe body raw (Buffer)
  },
};
```

Isso é necessário porque o Stripe precisa verificar a assinatura do webhook usando o body raw.

## Variáveis de Ambiente Necessárias

Na Vercel, configure:

- `STRIPE_SECRET_KEY` - Chave secreta do Stripe (LIVE)
- `STRIPE_WEBHOOK_SECRET` - Secret do webhook
- `FRONTEND_URL` - URL do frontend
- `NODE_ENV` - `production`
- `VITE_API_URL` - URL da API (para o frontend)

## Testando Localmente

Para testar localmente, você ainda pode usar o servidor Express em `server/index.js`.

Para testar as serverless functions localmente, use:

```bash
vercel dev
```

Isso simula o ambiente da Vercel localmente.







