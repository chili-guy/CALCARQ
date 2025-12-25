# 🚀 Como Rodar Localmente - Guia Completo

## 📋 Pré-requisitos

1. ✅ Node.js instalado (v18 ou superior)
2. ✅ npm instalado
3. ✅ Stripe CLI instalado (para webhooks locais)
4. ✅ Conta Stripe (para chaves de API)

---

## 🔧 Passo 1: Configurar Variáveis de Ambiente

### 1.1 Frontend (`.env` na raiz)

Crie/edite o arquivo `.env` na raiz do projeto:

```bash
cd "/home/ramon/Secretária/CALCARQ"
nano .env
```

Adicione:
```env
VITE_API_URL=http://localhost:3001
```

Salve: `Ctrl+O`, `Enter`, `Ctrl+X`

### 1.2 Backend (`server/.env`)

Crie/edite o arquivo `server/.env`:

```bash
cd "/home/ramon/Secretária/CALCARQ/server"
nano .env
```

Adicione:
```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Onde encontrar:**
- `STRIPE_SECRET_KEY`: Stripe Dashboard → Developers → API keys → Secret key (Test mode)
- `STRIPE_WEBHOOK_SECRET`: Você vai obter no Passo 3 (Stripe CLI)

Salve: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## 📦 Passo 2: Instalar Dependências

### 2.1 Frontend

```bash
cd "/home/ramon/Secretária/CALCARQ"
npm install
```

### 2.2 Backend

```bash
cd "/home/ramon/Secretária/CALCARQ/server"
npm install
```

---

## 🖥️ Passo 3: Iniciar os Servidores

Você precisa de **3 terminais abertos**:

---

### TERMINAL 1: Backend

```bash
cd "/home/ramon/Secretária/CALCARQ/server"
npm run dev
```

**✅ Deve aparecer:**
```
🚀 Servidor rodando na porta 3001
📊 Health check: http://localhost:3001/health
🔔 Webhook: http://localhost:3001/api/webhook/stripe
```

**⚠️ Deixe este terminal aberto!**

---

### TERMINAL 2: Stripe CLI (Webhook)

#### 3.1 Instalar Stripe CLI (se não tiver)

```bash
# Verificar se está instalado
stripe --version

# Se não estiver, instalar:
curl -s https://packages.stripe.com/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.com/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

#### 3.2 Fazer login no Stripe

```bash
stripe login
```

- Uma página do navegador abrirá
- Clique em **"Allow access"**
- Volte ao terminal

#### 3.3 Iniciar o webhook

```bash
stripe listen --forward-to localhost:3001/api/webhook/stripe
```

**✅ Deve aparecer:**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
```

**⚠️ IMPORTANTE:**
- **COPIE O SECRET** que aparece (começa com `whsec_`)
- Se ainda não preencheu no `server/.env`, edite agora:
  ```bash
  nano server/.env
  ```
  Substitua `whsec_SEU_SECRET_AQUI` pelo secret que apareceu
  Salve: `Ctrl+O`, `Enter`, `Ctrl+X`
  **Reinicie o backend** (Terminal 1: `Ctrl+C` e depois `npm run dev` novamente)

**⚠️ Deixe este terminal aberto!**

---

### TERMINAL 3: Frontend

```bash
cd "/home/ramon/Secretária/CALCARQ"
npm run dev
```

**✅ Deve aparecer:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**⚠️ Deixe este terminal aberto!**

---

## 🌐 Passo 4: Acessar a Aplicação

1. Abra seu navegador
2. Acesse: **http://localhost:5173**
3. Você deve ver a página inicial do Calcularq!

---

## ✅ Verificar se Tudo Está Funcionando

### Backend:
```bash
curl http://localhost:3001/health
```
Deve retornar: `{"status":"ok","timestamp":"..."}`

### Frontend:
Abra no navegador: http://localhost:5173

### Webhook:
No Terminal 2, você deve ver mensagens quando houver eventos do Stripe.

---

## 🛑 Como Parar os Servidores

Em cada terminal onde está rodando, pressione:
```
Ctrl+C
```

Isso vai parar o servidor naquele terminal.

---

## 🐛 Problemas Comuns

### "Porta 3001 já está em uso"

```bash
# Ver qual processo está usando
sudo lsof -i :3001

# Matar o processo (substitua PID pelo número que apareceu)
sudo kill -9 PID
```

### "Porta 5173 já está em uso"

```bash
# Ver qual processo está usando
sudo lsof -i :5173

# Matar o processo
sudo kill -9 PID
```

### "Cannot find module"

```bash
# Reinstalar dependências
cd "/home/ramon/Secretária/CALCARQ/server"
npm install
cd ..
npm install
```

### "stripe: command not found"

O Stripe CLI não está instalado. Siga o Passo 3.1 acima.

### "STRIPE_WEBHOOK_SECRET não configurado"

1. No Terminal 2, copie o secret que aparece (começa com `whsec_`)
2. Edite `server/.env`:
   ```bash
   nano server/.env
   ```
3. Substitua `whsec_SEU_SECRET_AQUI` pelo secret copiado
4. Salve: `Ctrl+O`, `Enter`, `Ctrl+X`
5. Reinicie o backend (Terminal 1: `Ctrl+C` e depois `npm run dev`)

### "Erro ao conectar com a API"

Verifique:
1. Backend está rodando? (Terminal 1)
2. `VITE_API_URL` está correto no `.env`?
3. Backend está na porta 3001?

---

## 📝 Resumo Rápido

**Terminal 1 (Backend):**
```bash
cd "/home/ramon/Secretária/CALCARQ/server"
npm install
npm run dev
```

**Terminal 2 (Stripe CLI):**
```bash
stripe login
stripe listen --forward-to localhost:3001/api/webhook/stripe
# Copie o whsec_ que aparecer e coloque no server/.env
```

**Terminal 3 (Frontend):**
```bash
cd "/home/ramon/Secretária/CALCARQ"
npm install
npm run dev
```

**Acessar:** http://localhost:5173

---

## 🎯 Testar Pagamento Localmente

1. Acesse http://localhost:5173
2. Crie uma conta ou faça login
3. Vá para a página de pagamento
4. Use cartão de teste do Stripe:
   - **Número:** `4242 4242 4242 4242`
   - **Data:** Qualquer data futura
   - **CVC:** Qualquer 3 dígitos
   - **CEP:** Qualquer CEP válido
5. Complete o pagamento
6. Verifique os logs no Terminal 1 (backend) e Terminal 2 (Stripe CLI)

---

## 📚 Arquivos de Configuração

### `.env` (raiz)
```env
VITE_API_URL=http://localhost:3001
```

### `server/.env`
```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## ✅ Checklist

- [ ] Node.js instalado
- [ ] npm instalado
- [ ] Stripe CLI instalado
- [ ] `.env` criado na raiz
- [ ] `server/.env` criado
- [ ] Dependências do frontend instaladas (`npm install`)
- [ ] Dependências do backend instaladas (`cd server && npm install`)
- [ ] Backend rodando (Terminal 1)
- [ ] Stripe CLI rodando (Terminal 2)
- [ ] Frontend rodando (Terminal 3)
- [ ] Aplicação acessível em http://localhost:5173

---

**Pronto! Agora você pode desenvolver e testar localmente!** 🚀
