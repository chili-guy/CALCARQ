# 🚀 Deploy Passo a Passo - Vercel (Gratuito)

## ⚡ Início Rápido (10 minutos)

---

## 📝 PASSO 1: Criar Conta (2 minutos)

1. Acesse: **https://vercel.com/signup**
2. Clique em **"Continue with GitHub"**
3. Autorize o acesso
4. ✅ Pronto!

---

## 📦 PASSO 2: Importar Projeto (3 minutos)

1. Na Vercel, clique em **"Add New..."** → **"Project"**
2. Procure **"CALCARQ"** na lista
3. Clique em **"Import"**
4. Deixe tudo como está (já está configurado)
5. Clique em **"Deploy"**
6. Aguarde 2-3 minutos
7. ✅ **Deploy feito!** Você terá uma URL como: `https://calcarq-web.vercel.app`

---

## ⚙️ PASSO 3: Configurar Chaves (3 minutos)

### 3.1 Na Vercel:

1. No seu projeto, clique em **"Settings"**
2. Clique em **"Environment Variables"**
3. Adicione estas 2 variáveis:

**Variável 1:**
- **Name:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_...` (sua chave secreta - obtenha em https://dashboard.stripe.com/apikeys)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

**Variável 2:**
- **Name:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_...` (secret do webhook - obtenha após criar webhook no Stripe)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

4. Clique em **"Save"** em cada uma

### 3.2 Fazer Novo Deploy:

1. Vá em **"Deployments"**
2. Clique nos **3 pontinhos** → **"Redeploy"**
3. Aguarde terminar

---

## 🔔 PASSO 4: Configurar Webhook no Stripe (2 minutos)

1. Acesse: **https://dashboard.stripe.com/webhooks**
2. **Certifique-se de estar em "Test mode"** (canto superior direito)
3. Clique em **"Add endpoint"**
4. Preencha:
   - **Endpoint URL:** `https://calcarq-web.vercel.app/api/webhook/stripe`
     *(Substitua `calcarq-web` pela URL que a Vercel deu)*
   - **Description:** `Calcarq Webhook`
5. Selecione eventos:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
6. Clique em **"Add endpoint"**
7. Clique em **"Reveal"** ao lado de "Signing secret"
8. **Copie o secret** (começa com `whsec_`)
9. Volte na Vercel e atualize `STRIPE_WEBHOOK_SECRET` com esse valor
10. Faça novo deploy

---

## ✅ PASSO 5: Testar (1 minuto)

### Teste 1: Health Check
Abra: `https://calcarq-web.vercel.app/health`
Deve aparecer: `{"status":"ok",...}`

### Teste 2: Frontend
Abra: `https://calcarq-web.vercel.app`
Deve aparecer a página inicial!

### Teste 3: Webhook
1. No Stripe: Webhooks → Seu webhook → "Send test webhook"
2. Selecione: `checkout.session.completed`
3. Clique em "Send test webhook"
4. Na Vercel: Deployments → Functions → `api/webhook/stripe` → Logs
5. Você deve ver logs do webhook!

---

## 🎉 Pronto!

Seu projeto está no ar e funcionando! 🚀

---

## 🔄 Deploy Automático

Agora, sempre que você fizer push no Git:
```bash
git add .
git commit -m "Minhas alterações"
git push
```

A Vercel faz deploy automaticamente! ✨

---

## 🐛 Problemas?

### "Build failed"
- Veja os logs na Vercel
- Teste localmente: `npm run build`

### "Webhook não funciona"
- Verifique se as variáveis estão configuradas
- Verifique se o webhook está em "Test mode"
- Faça novo deploy

### "404 Not Found"
- Verifique a URL do webhook no Stripe
- Deve terminar com `/api/webhook/stripe`

---

**Tempo total: ~10 minutos** ⏱️

**Custo: R$ 0,00** 💰

