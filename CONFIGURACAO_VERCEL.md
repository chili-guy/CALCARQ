# ⚙️ Configuração na Vercel - Passo a Passo

## 📋 Chaves para Configurar

Você precisa obter as chaves do Stripe:

### 1. Secret Key do Stripe
```
sk_test_... (sua chave secreta do Stripe)
```
**Onde obter:** https://dashboard.stripe.com/apikeys → Reveal test key

### 2. Webhook Secret
```
whsec_... (secret do webhook no Stripe)
```
**Onde obter:** https://dashboard.stripe.com/webhooks → Seu webhook → Reveal signing secret

---

## 🚀 Passo a Passo na Vercel

### Passo 1: Acessar Configurações

1. Acesse: **https://vercel.com**
2. Faça login na sua conta
3. Selecione seu projeto **calcarq-web** (ou o nome do seu projeto)
4. Vá em **Settings** (Configurações)
5. Clique em **Environment Variables** (Variáveis de Ambiente)

---

### Passo 2: Configurar STRIPE_SECRET_KEY

1. Procure por `STRIPE_SECRET_KEY` na lista
2. Se existir, clique nos **3 pontinhos** → **"Edit"**
3. Se não existir, clique em **"Add New"**
4. Preencha:
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_test_...` (sua chave secreta do Stripe)
   - **Environment:** Selecione todas (Production, Preview, Development)
5. Clique em **"Save"**

---

### Passo 3: Configurar STRIPE_WEBHOOK_SECRET

1. Procure por `STRIPE_WEBHOOK_SECRET` na lista
2. Se existir, clique nos **3 pontinhos** → **"Edit"**
3. Se não existir, clique em **"Add New"**
4. Preencha:
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (secret do webhook no Stripe)
   - **Environment:** Selecione todas (Production, Preview, Development)
5. Clique em **"Save"**

---

### Passo 4: Verificar Outras Variáveis

Verifique se essas variáveis também estão configuradas:

- `FRONTEND_URL` → `https://calcarq-web.vercel.app` (ou sua URL)
- `NODE_ENV` → `production` (opcional)

---

### Passo 5: Fazer Novo Deploy

**IMPORTANTE:** Após configurar as variáveis, você precisa fazer um novo deploy!

1. Vá em **Deployments** (Implantações)
2. Encontre o último deployment
3. Clique nos **3 pontinhos** → **"Redeploy"**
4. Aguarde o deploy terminar

---

## ✅ Verificar se Está Funcionando

### 1. Health Check
Abra no navegador:
```
https://calcarq-web.vercel.app/health
```
Deve retornar: `{"status":"ok","timestamp":"..."}`

### 2. Verificar Logs
1. Vá em **Deployments**
2. Clique no último deployment
3. Vá em **Functions** → **api/webhook/stripe**
4. Clique em **"Logs"**
5. Você deve ver logs quando o webhook for acionado

---

## 🔍 Verificar Webhook no Stripe

### Importante: Certifique-se de estar em "Test mode"

1. Acesse: **https://dashboard.stripe.com/webhooks**
2. **OLHE O CANTO SUPERIOR DIREITO:**
   - Deve estar em **"Test mode"** (não "Live mode")
3. Verifique se o webhook existe:
   - URL: `https://calcarq-web.vercel.app/api/webhook/stripe`
   - Modo: **Test mode**
4. Se não existir, crie:
   - Clique em **"Add endpoint"**
   - URL: `https://calcarq-web.vercel.app/api/webhook/stripe`
   - Eventos: `checkout.session.completed`, `payment_intent.succeeded`
   - Clique em **"Add endpoint"**
   - Copie o secret (começa com `whsec_`)

---

## ⚠️ Checklist Final

- [ ] `STRIPE_SECRET_KEY` configurado na Vercel
- [ ] `STRIPE_WEBHOOK_SECRET` configurado na Vercel
- [ ] Webhook criado no Stripe em **"Test mode"**
- [ ] URL do webhook está correta: `https://calcarq-web.vercel.app/api/webhook/stripe`
- [ ] Novo deploy feito após configurar variáveis
- [ ] Health check funcionando
- [ ] Logs do webhook aparecem quando há eventos

---

## 🐛 Problemas Comuns

### "Webhook retorna 400"
- ❌ Webhook secret incorreto
- ❌ Webhook em modo diferente (Test vs Live)
- ✅ **Solução:** Verifique se o secret na Vercel é o mesmo do webhook no Stripe

### "Webhook não recebe eventos"
- ❌ URL do webhook incorreta
- ❌ Webhook criado no modo errado
- ✅ **Solução:** Verifique URL e modo no Stripe Dashboard

### "Variáveis não aparecem no código"
- ❌ Deploy feito antes de configurar variáveis
- ✅ **Solução:** Faça novo deploy após configurar

---

## 📝 Resumo Rápido

**Na Vercel:**
1. Settings → Environment Variables
2. Adicione/Edite `STRIPE_SECRET_KEY` = `sk_test_...` (sua chave)
3. Adicione/Edite `STRIPE_WEBHOOK_SECRET` = `whsec_...` (secret do webhook)
4. Deployments → Redeploy

**No Stripe:**
1. Certifique-se de estar em **"Test mode"**
2. Webhooks → Verifique/crie webhook
3. URL: `https://calcarq-web.vercel.app/api/webhook/stripe`

---

**Pronto! Configure na Vercel e teste!** 🚀
