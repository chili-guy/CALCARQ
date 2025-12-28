# 🔑 Como Encontrar as Chaves do Stripe

## Passo a Passo Completo

### 1️⃣ STRIPE_SECRET_KEY (Chave Secreta da API)

**Onde encontrar:**
1. Acesse: **https://dashboard.stripe.com/apikeys**
2. Faça login na sua conta Stripe
3. Você verá duas seções:
   - **Publishable key** (chave pública - não é essa)
   - **Secret key** (chave secreta - **É ESTA QUE VOCÊ PRECISA**)
4. Clique em **"Reveal test key"** ou **"Reveal live key"**
5. Copie a chave que começa com:
   - `sk_test_` (para testes)
   - `sk_live_` (para produção)

**Como usar:**
```env
STRIPE_SECRET_KEY=sk_test_51ABC123...sua_chave_completa_aqui
```

---

### 2️⃣ STRIPE_WEBHOOK_SECRET (Secret do Webhook)

#### Opção A: Desenvolvimento Local (Recomendado para começar)

1. **Instale o Stripe CLI:**
   - Windows: https://github.com/stripe/stripe-cli/releases
   - Mac: `brew install stripe/stripe-cli/stripe`
   - Linux: Siga as instruções em https://stripe.com/docs/stripe-cli

2. **Execute no terminal:**
   ```bash
   stripe login
   stripe listen --forward-to localhost:3001/api/webhook/stripe
   ```

3. **Copie o secret que aparece:**
   ```
   > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
   ```

4. **Cole no arquivo `server/.env`:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

#### Opção B: Produção (Quando estiver em produção)

1. Acesse: **https://dashboard.stripe.com/webhooks**
2. Clique em **"Add endpoint"**
3. Preencha:
   - **Endpoint URL**: `https://seu-dominio.com/api/webhook/stripe`
   - **Description**: "Calcularq Payment Webhook"
4. Selecione os eventos:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Clique em **"Add endpoint"**
6. Na página do webhook criado, clique em **"Reveal"** ao lado de **"Signing secret"**
7. Copie o secret (começa com `whsec_`)
8. Cole no arquivo `server/.env`

---

### 3️⃣ FRONTEND_URL

**Para desenvolvimento:**
```env
FRONTEND_URL=http://localhost:5173
```

**Para produção:**
```env
FRONTEND_URL=https://seu-dominio.com
```

---

### 4️⃣ PORT

**Porta padrão:**
```env
PORT=3001
```

Você pode usar outra porta se a 3001 estiver ocupada.

---

## 📝 Criar o Arquivo .env

1. Vá para a pasta `server/`:
   ```bash
   cd server
   ```

2. Crie o arquivo `.env`:
   ```bash
   # Windows (PowerShell)
   New-Item .env
   
   # Linux/Mac
   touch .env
   ```

3. Abra o arquivo `.env` e cole:
   ```env
   STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
   STRIPE_WEBHOOK_SECRET=whsec_seu_secret_aqui
   FRONTEND_URL=http://localhost:5173
   PORT=3001
   NODE_ENV=development
   ```

4. Substitua os valores pelos que você copiou do Stripe

---

## ✅ Verificar se Está Funcionando

1. Inicie o backend:
   ```bash
   cd server
   npm run dev
   ```

2. Você deve ver:
   ```
   🚀 Servidor rodando na porta 3001
   📊 Health check: http://localhost:3001/health
   🔔 Webhook: http://localhost:3001/api/webhook/stripe
   ```

3. Teste o health check:
   ```bash
   curl http://localhost:3001/health
   ```

4. Se aparecer `{"status":"ok"}`, está funcionando! ✅

---

## 🆘 Problemas Comuns

### "STRIPE_SECRET_KEY não configurado"
- Verifique se o arquivo `.env` está na pasta `server/`
- Verifique se não há espaços antes ou depois do `=`
- Verifique se copiou a chave completa

### "Webhook Error"
- Para desenvolvimento: use o Stripe CLI (`stripe listen`)
- Para produção: verifique se a URL do webhook está acessível publicamente
- Verifique se o `STRIPE_WEBHOOK_SECRET` está correto

### "Cannot find module 'dotenv'"
- Execute: `cd server && npm install`

---

## 📚 Links Úteis

- Dashboard Stripe: https://dashboard.stripe.com
- Chaves de API: https://dashboard.stripe.com/apikeys
- Webhooks: https://dashboard.stripe.com/webhooks
- Documentação Stripe CLI: https://stripe.com/docs/stripe-cli
- Cartões de teste: https://stripe.com/docs/testing





