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
- `STRIPE_PRICE_ID`: ID do preço do produto no Stripe (opcional, para checkout via API)
- `PORT`: Porta do servidor (padrão: 3001)
- `FRONTEND_URL`: URL do frontend (padrão: http://localhost:5173)

### Configuração SMTP (para envio de emails - Esqueci minha senha)

Para habilitar o envio de emails, configure as seguintes variáveis:

- `SMTP_HOST`: Servidor SMTP (padrão: smtp.gmail.com)
- `SMTP_PORT`: Porta SMTP (padrão: 587)
- `SMTP_SECURE`: true/false - Use true para porta 465, false para 587 (padrão: false)
- `SMTP_USER`: Email do remetente
- `SMTP_PASS`: Senha do remetente (para Gmail, use "Senha de App")
- `SMTP_FROM`: Email de origem (opcional, usa SMTP_USER se não definido)

**Nota importante**: 
- Se as variáveis SMTP não forem configuradas, o sistema funcionará normalmente, mas apenas logará os tokens de reset no console (modo desenvolvimento)
- Para Gmail, você precisa criar uma "Senha de App" em https://myaccount.google.com/apppasswords ao invés de usar sua senha normal

**📖 Guias de configuração**: 
- `SMTP_PRODUCAO_GRATIS.md` - **⭐ RECOMENDADO** - Guia focado em opções gratuitas para produção (SendGrid, Brevo, Mailgun)
- `COMO_CONFIGURAR_SMTP.md` - Guia completo com todas as opções (Gmail, Outlook, SendGrid, etc.)

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

### Autenticação
- `POST /api/auth/forgot-password` - Solicitar reset de senha (envia email com token)
- `POST /api/auth/reset-password` - Redefinir senha usando token

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
