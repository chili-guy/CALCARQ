# Integração de Pagamento - Calcularq

## ✅ Melhorias Implementadas

### 1. Webhook do Stripe Aprimorado
- Verifica se o pagamento foi realmente concluído (`payment_status === 'paid'`)
- Cria usuário automaticamente se não existir quando o pagamento é processado
- Logs detalhados para debugging

### 2. Verificação de Pagamento Melhorada
- Polling mais eficiente (verifica a cada 3 segundos)
- Continua verificando por 30 segundos após fechar a janela do checkout
- Verificação imediata quando a página carrega com `session_id` na URL
- Atualização automática do status do usuário após confirmação

### 3. Sincronização Frontend-Backend
- `AuthContext` atualiza o status de pagamento automaticamente
- Sincronização do `stripeCustomerId` quando disponível
- Atualização local e no backend em tempo real

### 4. Endpoint Opcional para Sessões de Checkout
- Novo endpoint `/api/checkout/create-session` para criar sessões com URLs de redirecionamento
- Requer `STRIPE_PRICE_ID` configurado no `.env`
- Permite redirecionamento automático após pagamento

## 🔄 Fluxo de Pagamento

### Fluxo Atual (com link direto do Stripe)

1. **Usuário clica em "Realizar Pagamento"**
   - Sistema sincroniza usuário com backend
   - Abre checkout do Stripe em nova janela com `client_reference_id`

2. **Usuário completa o pagamento no Stripe**
   - Stripe processa o pagamento
   - Webhook é chamado automaticamente pelo Stripe

3. **Webhook processa o pagamento**
   - Verifica `payment_status === 'paid'`
   - Atualiza `hasPaid = true` no backend
   - Cria usuário se não existir

4. **Frontend detecta o pagamento**
   - Polling verifica status a cada 3 segundos
   - Quando detecta `hasPaid = true`, atualiza o contexto
   - Redireciona automaticamente para a calculadora

### Fluxo Alternativo (com sessão criada via API)

1. **Frontend chama `/api/checkout/create-session`**
2. **Backend cria sessão com URLs de redirecionamento**
3. **Usuário é redirecionado para checkout do Stripe**
4. **Após pagamento, Stripe redireciona para `/payment?session_id=xxx&success=true`**
5. **Frontend verifica pagamento usando `session_id`**
6. **Acesso é liberado automaticamente**

## 🧪 Como Testar

### 1. Configurar Variáveis de Ambiente

No arquivo `server/.env` (crie este arquivo se não existir):
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
PORT=3001
```

#### 📍 Onde encontrar cada valor:

**1. STRIPE_SECRET_KEY** (Chave Secreta do Stripe):
   - Acesse: https://dashboard.stripe.com/apikeys
   - Faça login na sua conta Stripe
   - Na seção "Secret keys", copie a chave que começa com `sk_test_` (modo teste) ou `sk_live_` (produção)
   - Cole no arquivo `server/.env` como: `STRIPE_SECRET_KEY=sk_test_sua_chave_aqui`

**2. STRIPE_WEBHOOK_SECRET** (Secret do Webhook):
   
   **Para Desenvolvimento Local:**
   - Instale o Stripe CLI: https://stripe.com/docs/stripe-cli
   - Execute no terminal:
     ```bash
     stripe listen --forward-to localhost:3001/api/webhook/stripe
     ```
   - Copie o `webhook signing secret` que aparece (começa com `whsec_`)
   - Cole no arquivo `server/.env` como: `STRIPE_WEBHOOK_SECRET=whsec_seu_secret_aqui`
   
   **Para Produção:**
   - Acesse: https://dashboard.stripe.com/webhooks
   - Clique em "Add endpoint" (ou edite um existente)
   - URL do endpoint: `https://seu-dominio.com/api/webhook/stripe`
   - Selecione os eventos:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Clique em "Add endpoint"
   - Na página do webhook, clique em "Reveal" ao lado de "Signing secret"
   - Copie o secret (começa com `whsec_`)
   - Cole no arquivo `server/.env` como: `STRIPE_WEBHOOK_SECRET=whsec_seu_secret_aqui`

**3. FRONTEND_URL**:
   - Para desenvolvimento: `http://localhost:5173` (porta padrão do Vite)
   - Para produção: `https://seu-dominio.com`

**4. PORT**:
   - Porta padrão: `3001`
   - Você pode usar outra porta se necessário

### 2. Iniciar o Backend

```bash
cd server
npm install
npm run dev
```

### 3. Iniciar o Frontend

```bash
npm install
npm run dev
```

### 4. Testar o Fluxo de Pagamento

1. **Criar uma conta** ou fazer login
2. **Acessar a página de pagamento** (`/payment`)
3. **Clicar em "Realizar Pagamento"**
4. **Usar cartão de teste do Stripe:**
   - Número: `4242 4242 4242 4242`
   - Data: qualquer data futura
   - CVC: qualquer 3 dígitos
   - CEP: qualquer CEP válido
5. **Completar o pagamento**
6. **Aguardar redirecionamento automático** (deve acontecer em até 10 segundos)

### 5. Verificar Logs

Acesse `http://localhost:3001/api/logs` para ver os eventos de pagamento.

## 🔧 Configuração do Webhook no Stripe

### Para Desenvolvimento Local

1. Instale o Stripe CLI: https://stripe.com/docs/stripe-cli
2. Execute:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhook/stripe
   ```
3. Copie o `webhook signing secret` exibido
4. Adicione ao `server/.env` como `STRIPE_WEBHOOK_SECRET`

### Para Produção

1. Acesse https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. URL: `https://seu-dominio.com/api/webhook/stripe`
4. Selecione eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copie o "Signing secret" e adicione ao `.env`

## 🐛 Troubleshooting

### Pagamento não está sendo detectado

1. **Verifique os logs do backend:**
   ```bash
   curl http://localhost:3001/api/logs
   ```

2. **Verifique se o webhook está recebendo eventos:**
   - No Stripe Dashboard: https://dashboard.stripe.com/webhooks
   - Veja se há eventos sendo recebidos

3. **Verifique o `client_reference_id`:**
   - Deve ser o ID do usuário
   - Verifique nos logs se está sendo passado corretamente

### Webhook não está funcionando

1. **Verifique a URL do webhook:**
   - Deve ser acessível publicamente
   - Use ngrok para desenvolvimento local:
     ```bash
     ngrok http 3001
     ```

2. **Verifique o `STRIPE_WEBHOOK_SECRET`:**
   - Deve ser o secret correto do webhook configurado
   - Cada webhook tem seu próprio secret

### Frontend não atualiza após pagamento

1. **Verifique se o backend está rodando**
2. **Verifique se `VITE_API_URL` está correto no frontend**
3. **Abra o console do navegador** para ver erros
4. **Verifique se o polling está funcionando** (deve fazer requisições a cada 3 segundos)

## 📝 Notas Importantes

- O sistema usa **polling** como método principal de verificação
- O **webhook** é o método preferido e mais confiável
- O polling continua por até 3 minutos após iniciar o checkout
- Após fechar a janela do checkout, o polling continua por mais 30 segundos
- O status é verificado automaticamente quando a página carrega com `session_id`

## 🚀 Próximos Passos (Opcional)

Para uma integração ainda mais robusta:

1. **Criar sessões de checkout via API** (já implementado, só precisa configurar `STRIPE_PRICE_ID`)
2. **Adicionar notificações por email** quando o pagamento for confirmado
3. **Adicionar página de histórico de pagamentos**
4. **Implementar reembolsos** (se necessário)

