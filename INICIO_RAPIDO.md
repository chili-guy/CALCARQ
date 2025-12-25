# 🚀 INÍCIO RÁPIDO - Integração Stripe (Linux)

## ⚡ Comece Aqui (5 minutos)

> **Sistema:** Linux  
> **Este guia é específico para Linux**

### 1️⃣ Abra o Terminal (Ctrl+Alt+T ou procure por "Terminal")

### 2️⃣ Navegue até a pasta do projeto:

```bash
cd "/home/ramon/Secretária/CALCARQ"
```

### 3️⃣ Execute este comando para verificar o que falta:

```bash
chmod +x verificar-configuracao.sh
./verificar-configuracao.sh
```

### 3️⃣ Siga as instruções que aparecerem

---

## 📋 Checklist Rápido

Marque conforme for fazendo:

- [ ] Conta criada no Stripe: https://dashboard.stripe.com/register
- [ ] Chave secreta copiada: https://dashboard.stripe.com/apikeys
- [ ] Stripe CLI instalado: https://stripe.com/docs/stripe-cli
- [ ] Arquivo `server/.env` criado com as chaves
- [ ] Dependências instaladas: `cd server && npm install`
- [ ] Servidor rodando: `cd server && npm run dev`
- [ ] Arquivo `.env` na raiz criado com `VITE_API_URL=http://localhost:3001`
- [ ] Frontend rodando: `npm run dev`
- [ ] Teste de pagamento realizado

---

## 🎯 Os 3 Passos Mais Importantes

### 1. Criar arquivo `server/.env`

Crie o arquivo `server/.env` com este conteúdo (substitua pelos valores reais):

```env
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SEU_SECRET_AQUI
FRONTEND_URL=http://localhost:5173
PORT=3001
```

**Onde encontrar:**
- `STRIPE_SECRET_KEY`: https://dashboard.stripe.com/apikeys → Clique em "Reveal test key"
- `STRIPE_WEBHOOK_SECRET`: Execute `stripe listen --forward-to localhost:3001/api/webhook/stripe` e copie o secret

### 2. Criar arquivo `.env` na raiz

Crie o arquivo `.env` na pasta raiz do projeto:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Iniciar tudo

**Abra 3 terminais diferentes** (Ctrl+Alt+T abre um novo terminal, ou clique com botão direito no terminal e "Nova aba")

**Terminal 1 - Backend:**
```bash
cd "/home/ramon/Secretária/CALCARQ/server"
npm install
npm run dev
```
Deixe este terminal aberto e rodando.

**Terminal 2 - Stripe CLI (para webhook):**
```bash
stripe listen --forward-to localhost:3001/api/webhook/stripe
```
Deixe este terminal aberto e rodando. Você verá mensagens quando houver eventos.

**Terminal 3 - Frontend:**
```bash
cd "/home/ramon/Secretária/CALCARQ"
npm install
npm run dev
```
Este terminal mostrará a URL do frontend (geralmente http://localhost:5173)

---

## 🧪 Testar

1. Acesse: http://localhost:5173
2. Crie uma conta
3. Vá para a página de pagamento
4. Use cartão de teste: `4242 4242 4242 4242`
5. Complete o pagamento
6. ✅ Deve redirecionar automaticamente para a calculadora!

---

## 📚 Guia Completo

Para instruções detalhadas passo a passo, consulte:
**`GUIA_COMPLETO_INTEGRACAO.md`**

---

## ❓ Problemas?

Execute:
```bash
./verificar-configuracao.sh
```

Este script vai te dizer exatamente o que está faltando!

