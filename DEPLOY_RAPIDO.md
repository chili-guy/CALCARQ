# ⚡ Deploy Rápido - Vercel

## 🚀 Passos Rápidos (5 minutos)

### 1. Preparar código
```bash
cd "/home/ramon/Secretária/CALCARQ"
git add .
git commit -m "Preparar para deploy"
```

### 2. Push para GitHub
```bash
# Se ainda não tem repositório
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

### 3. Deploy na Vercel
1. Acesse: https://vercel.com/new
2. Importe seu repositório
3. Configure variáveis de ambiente (veja abaixo)
4. Clique em "Deploy"

### 4. Variáveis de Ambiente (IMPORTANTE!)

Na Vercel, adicione:

**Frontend:**
- `VITE_API_URL` = `https://seu-projeto.vercel.app` (atualize depois)

**Backend:**
- `STRIPE_SECRET_KEY` = `sk_live_...` (chave LIVE do Stripe)
- `STRIPE_WEBHOOK_SECRET` = `whsec_...` (obtenha após configurar webhook)
- `FRONTEND_URL` = `https://seu-projeto.vercel.app` (atualize depois)
- `NODE_ENV` = `production`

### 5. Configurar Webhook Stripe

1. Acesse: https://dashboard.stripe.com/webhooks
2. **Mude para Live mode**
3. Add endpoint: `https://seu-projeto.vercel.app/api/webhook/stripe`
4. Selecione eventos: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copie o signing secret e atualize na Vercel

### 6. Testar

- Health: `https://seu-projeto.vercel.app/health`
- App: `https://seu-projeto.vercel.app`

---

## 📚 Guia Completo

Para instruções detalhadas, consulte: **`GUIA_DEPLOY_VERCEL.md`**


