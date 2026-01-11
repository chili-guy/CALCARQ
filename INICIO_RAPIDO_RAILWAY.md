# 🚀 Início Rápido - Railway

## ⚡ Passos Rápidos

### 1️⃣ Fazer Push do Código

```bash
cd "/home/ramon/Secretária/CALCARQ"
git add .
git commit -m "feat: configuração Railway"
git push
```

### 2️⃣ Criar Projeto no Railway

1. Acesse: https://railway.app
2. Login com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Selecione **CALCARQ**
5. Clique **Deploy Now**

### 3️⃣ Configurar Variáveis

No Railway → **Variables**, adicione:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (depois)
FRONTEND_URL=https://seu-projeto.up.railway.app (depois)
NODE_ENV=production
RAILWAY=1
```

### 4️⃣ Gerar Domínio

Railway → **Settings** → **Networking** → **Generate Domain**

Copie a URL e atualize `FRONTEND_URL`

### 5️⃣ Configurar Webhook Stripe

1. Stripe Dashboard → **Webhooks** → **Add endpoint**
2. URL: `https://seu-projeto.up.railway.app/api/webhook/stripe`
3. Eventos: `checkout.session.completed`
4. Copie o **Signing secret**
5. Adicione no Railway como `STRIPE_WEBHOOK_SECRET`

### 6️⃣ Testar

- Frontend: `https://seu-projeto.up.railway.app`
- Health: `https://seu-projeto.up.railway.app/health`

---

📖 **Guia completo**: Veja `GUIA_RAILWAY.md`





