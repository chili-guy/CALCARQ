# 🚀 Como Iniciar os Servidores

## 📋 Você precisa de 3 terminais abertos

1. **Terminal 1**: Backend (servidor Node.js)
2. **Terminal 2**: Stripe CLI (webhook)
3. **Terminal 3**: Frontend (React/Vite)

---

## 🖥️ TERMINAL 1: Backend

### Passo 1: Abrir o terminal
Pressione **Ctrl+Alt+T** ou procure "Terminal" no menu.

### Passo 2: Navegar até a pasta do servidor
```bash
cd "/home/ramon/Secretária/CALCARQ/server"
```

### Passo 3: Verificar se as dependências estão instaladas
```bash
npm install
```
(Aguarde terminar - pode levar alguns minutos na primeira vez)

### Passo 4: Iniciar o servidor
```bash
npm run dev
```

### ✅ Como saber se está funcionando:
Você deve ver algo assim:
```
🚀 Servidor rodando na porta 3001
📊 Health check: http://localhost:3001/health
🔔 Webhook: http://localhost:3001/api/webhook/stripe
```

**⚠️ IMPORTANTE:** Deixe este terminal aberto e rodando!

---

## 🔔 TERMINAL 2: Stripe CLI (Webhook)

### Passo 1: Abrir um NOVO terminal
- Pressione **Ctrl+Alt+T** novamente (ou **Ctrl+Shift+T** para nova aba)
- Ou clique com botão direito no terminal e escolha "Nova aba"

### Passo 2: Verificar se o Stripe CLI está instalado
```bash
stripe --version
```

Se não estiver instalado, instale:
```bash
# Método 1: Via repositório (recomendado)
curl -s https://packages.stripe.com/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.com/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

### Passo 3: Fazer login no Stripe (se ainda não fez)
```bash
stripe login
```
- Uma página do navegador abrirá
- Clique em "Allow access"
- Volte ao terminal

### Passo 4: Iniciar o webhook
```bash
stripe listen --forward-to localhost:3001/api/webhook/stripe
```

### ✅ Como saber se está funcionando:
Você deve ver algo assim:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
```

**⚠️ IMPORTANTE:** 
- Deixe este terminal aberto e rodando!
- **COPIE O SECRET** que aparece (começa com `whsec_`)
- Se ainda não preencheu no `server/.env`, edite agora:
  ```bash
  nano server/.env
  ```
  Substitua `whsec_SEU_SECRET_AQUI` pelo secret que apareceu
  Salve: Ctrl+O, Enter, Ctrl+X

---

## 🎨 TERMINAL 3: Frontend

### Passo 1: Abrir um NOVO terminal
- Pressione **Ctrl+Alt+T** novamente (ou **Ctrl+Shift+T** para nova aba)

### Passo 2: Navegar até a pasta raiz do projeto
```bash
cd "/home/ramon/Secretária/CALCARQ"
```

### Passo 3: Verificar se as dependências estão instaladas
```bash
npm install
```
(Aguarde terminar - pode levar alguns minutos na primeira vez)

### Passo 4: Iniciar o frontend
```bash
npm run dev
```

### ✅ Como saber se está funcionando:
Você deve ver algo assim:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**⚠️ IMPORTANTE:** Deixe este terminal aberto e rodando!

---

## 🌐 Acessar a aplicação

1. Abra seu navegador
2. Acesse: **http://localhost:5173**
3. Você deve ver a página inicial do Calcularq!

---

## ✅ Verificar se tudo está rodando

### Verificar Backend:
```bash
curl http://localhost:3001/health
```
Deve retornar: `{"status":"ok","timestamp":"..."}`

### Verificar Frontend:
Abra no navegador: http://localhost:5173

### Verificar Webhook:
No Terminal 2, você deve ver mensagens quando houver eventos.

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

# Matar o processo (substitua PID pelo número)
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
cd server
npm install
cd ..
npm install
```

### "stripe: command not found"
O Stripe CLI não está instalado. Siga o Passo 2 do Terminal 2 acima.

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
```

**Terminal 3 (Frontend):**
```bash
cd "/home/ramon/Secretária/CALCARQ"
npm install
npm run dev
```

**Acessar:** http://localhost:5173

---

## 🎯 Próximo Passo

Depois que todos os servidores estiverem rodando:
1. Acesse http://localhost:5173
2. Crie uma conta ou faça login
3. Teste o pagamento!





