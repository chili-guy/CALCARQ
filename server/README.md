# Calcularq Backend API

Backend para processamento de pagamentos via Stripe e gerenciamento de usuários.

## Instalação

```bash
cd server
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente:
- `STRIPE_SECRET_KEY`: Sua chave secreta do Stripe (encontre em https://dashboard.stripe.com/apikeys)
- `STRIPE_WEBHOOK_SECRET`: Secret do webhook (obtenha após configurar o webhook no Stripe)
- `PORT`: Porta do servidor (padrão: 3001)
- `FRONTEND_URL`: URL do frontend (padrão: http://localhost:5173)

## Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## Endpoints

### Health Check
- `GET /health` - Verifica se o servidor está rodando

### Usuários
- `GET /api/user/:userId/payment-status` - Verifica status de pagamento
- `POST /api/user/sync` - Sincroniza usuário do frontend

### Pagamentos
- `POST /api/webhook/stripe` - Webhook do Stripe (não chamar manualmente)
- `POST /api/payment/verify` - Verificação manual de pagamento

### Logs e Estatísticas
- `GET /api/logs` - Lista logs de pagamento
- `GET /api/stats` - Estatísticas de pagamento

## Configurar Webhook no Stripe

1. Acesse https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. URL do endpoint: `https://seu-dominio.com/api/webhook/stripe`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copie o "Signing secret" e adicione ao `.env` como `STRIPE_WEBHOOK_SECRET`

## Estrutura de Dados

Os dados são armazenados em arquivos JSON no diretório `data/`:
- `users.json`: Dados dos usuários
- `payment-logs.json`: Logs de pagamento

## Deploy

Para produção, considere:
- Usar um banco de dados real (PostgreSQL, MongoDB, etc.)
- Adicionar autenticação para endpoints de admin
- Configurar HTTPS
- Usar variáveis de ambiente seguras
- Implementar rate limiting
