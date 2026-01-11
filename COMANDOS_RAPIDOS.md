# ⚡ Comandos Rápidos - Rodar Localmente

## 🚀 Início Rápido (3 Terminais)

### Terminal 1: Backend
```bash
cd "/home/ramon/Secretária/CALCARQ/server"
npm install && npm run dev
```

### Terminal 2: Stripe CLI
```bash
stripe login
stripe listen --forward-to localhost:3001/api/webhook/stripe
```

### Terminal 3: Frontend
```bash
cd "/home/ramon/Secretária/CALCARQ"
npm install && npm run dev
```

---

## 📝 Criar Arquivos .env

### Frontend (`.env` na raiz)
```bash
cd "/home/ramon/Secretária/CALCARQ"
echo "VITE_API_URL=http://localhost:3001" > .env
```

### Backend (`server/.env`)
```bash
cd "/home/ramon/Secretária/CALCARQ/server"
cat > .env << EOF
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF
```

**⚠️ Depois edite `server/.env` e substitua os valores pelos seus!**

---

## 🔍 Verificar se Está Rodando

```bash
# Backend
curl http://localhost:3001/health

# Frontend
curl http://localhost:5173
```

---

## 🛑 Parar Servidores

Em cada terminal: `Ctrl+C`

---

## 🐛 Matar Processos nas Portas

```bash
# Porta 3001 (Backend)
sudo lsof -i :3001
sudo kill -9 PID

# Porta 5173 (Frontend)
sudo lsof -i :5173
sudo kill -9 PID
```

---

## 📦 Reinstalar Dependências

```bash
# Frontend
cd "/home/ramon/Secretária/CALCARQ"
rm -rf node_modules package-lock.json
npm install

# Backend
cd "/home/ramon/Secretária/CALCARQ/server"
rm -rf node_modules package-lock.json
npm install
```

---

## 🔔 Instalar Stripe CLI

```bash
curl -s https://packages.stripe.com/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.com/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

---

## ✅ Testar Webhook

```bash
# No Terminal 2 (Stripe CLI), envie um evento de teste:
stripe trigger checkout.session.completed
```

Você deve ver logs no Terminal 1 (Backend) e Terminal 2 (Stripe CLI).

---

**Acesse:** http://localhost:5173 🚀







