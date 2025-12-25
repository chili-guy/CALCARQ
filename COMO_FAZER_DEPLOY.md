# 🚀 COMO FAZER O DEPLOY - Passo a Passo Simples

## 📋 O QUE VOCÊ VAI FAZER

Você vai colocar seu projeto no ar na Vercel em 5 passos simples.

---

## ✅ PASSO 1: Preparar o Código no Git

### 1.1: Verificar se já tem Git
```bash
cd "/home/ramon/Secretária/CALCARQ"
git status
```

Se aparecer erro, inicialize:
```bash
git init
```

### 1.2: Adicionar tudo ao Git
```bash
git add .
git commit -m "Preparar para deploy na Vercel"
```

### 1.3: Criar repositório no GitHub

1. Acesse: **https://github.com/new**
2. Nome do repositório: `calcarq` (ou outro nome)
3. **NÃO marque** "Add a README file" (já tem código)
4. Clique em **"Create repository"**

### 1.4: Conectar e enviar código

**Copie o comando que aparece** (algo como):
```bash
git remote add origin https://github.com/SEU_USUARIO/calcarq.git
git branch -M main
git push -u origin main
```

**Cole no terminal e execute.**

---

## ✅ PASSO 2: Criar Conta na Vercel

1. Acesse: **https://vercel.com/signup**
2. Clique em **"Continue with GitHub"** (ou GitLab/Bitbucket)
3. Autorize o acesso
4. Pronto! Você está logado

---

## ✅ PASSO 3: Fazer Deploy

### 3.1: Importar Projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório `calcarq`
4. Clique em **"Import"**

### 3.2: Configurar Projeto

A Vercel vai detectar automaticamente:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`

**Deixe tudo como está!** (já está correto)

### 3.3: Configurar Variáveis de Ambiente

**ANTES de clicar em "Deploy"**, role até **"Environment Variables"** e adicione:

#### Variável 1:
- **Name:** `VITE_API_URL`
- **Value:** `https://seu-projeto.vercel.app` *(você vai atualizar depois)*
- Clique em **"Add"**

#### Variável 2:
- **Name:** `STRIPE_SECRET_KEY`
- **Value:** `sk_live_SUA_CHAVE_LIVE_AQUI` *(chave LIVE do Stripe)*
- Clique em **"Add"**

#### Variável 3:
- **Name:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_...` *(você vai obter depois)*
- Clique em **"Add"**

#### Variável 4:
- **Name:** `FRONTEND_URL`
- **Value:** `https://seu-projeto.vercel.app` *(você vai atualizar depois)*
- Clique em **"Add"**

#### Variável 5:
- **Name:** `NODE_ENV`
- **Value:** `production`
- Clique em **"Add"**

### 3.4: Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-5 minutos
3. **Anote a URL** que aparece (ex: `https://calcarq-abc123.vercel.app`)

---

## ✅ PASSO 4: Atualizar Variáveis com URL Real

### 4.1: Obter a URL do Projeto

Após o deploy, você verá uma URL como:
```
https://calcarq-abc123.vercel.app
```

### 4.2: Atualizar Variáveis

1. No dashboard da Vercel, vá em **Settings** → **Environment Variables**
2. Edite `VITE_API_URL`:
   - Clique nos 3 pontinhos → **"Edit"**
   - Mude para: `https://calcarq-abc123.vercel.app` *(sua URL real)*
   - Clique em **"Save"**

3. Edite `FRONTEND_URL`:
   - Clique nos 3 pontinhos → **"Edit"**
   - Mude para: `https://calcarq-abc123.vercel.app` *(sua URL real)*
   - Clique em **"Save"**

### 4.3: Fazer Novo Deploy

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **"Redeploy"**
4. Aguarde terminar

---

## ✅ PASSO 5: Configurar Webhook do Stripe

### ⚠️ IMPORTANTE: Chave de TESTE vs LIVE

**Você tem duas opções:**

#### Opção A: Usar Chave de TESTE (Para testar o deploy)
- ✅ Use a chave que você tem: `sk_test_...`
- ✅ Funciona para testar se tudo está funcionando
- ❌ **NÃO processa pagamentos reais** (só de teste)
- ✅ Use temporariamente para validar o deploy

#### Opção B: Usar Chave LIVE (Para produção real)
- ✅ Processa **pagamentos reais**
- ✅ Você recebe dinheiro de verdade
- ⚠️ Precisa ativar conta Stripe para receber pagamentos
- ⚠️ Precisa preencher informações fiscais no Stripe

### 5.1: Obter Chave do Stripe

**Para TESTE (recomendado começar assim):**
1. Acesse: **https://dashboard.stripe.com/apikeys**
2. Certifique-se de estar em **"Test mode"** (canto superior direito)
3. Clique em **"Reveal test key"**
4. **Copie a chave** (começa com `sk_test_`)
5. Use essa chave na Vercel em `STRIPE_SECRET_KEY`

**Para PRODUÇÃO (depois que testar):**
1. Acesse: **https://dashboard.stripe.com/apikeys**
2. **Mude para "Live mode"** (canto superior direito)
3. Clique em **"Reveal live key"**
4. **Copie a chave** (começa com `sk_live_`)
5. Atualize `STRIPE_SECRET_KEY` na Vercel com essa chave

### 5.2: Criar Webhook no Stripe

**IMPORTANTE:** Use o mesmo modo (Test ou Live) que você usou para a chave!

**Para TESTE:**
1. Acesse: **https://dashboard.stripe.com/webhooks**
2. Certifique-se de estar em **"Test mode"**
3. Clique em **"Add endpoint"**

**Para PRODUÇÃO:**
1. Acesse: **https://dashboard.stripe.com/webhooks**
2. Certifique-se de estar em **"Live mode"**
3. Clique em **"Add endpoint"**
4. Preencha:
   - **Endpoint URL:** `https://calcarq-abc123.vercel.app/api/webhook/stripe`
     *(Use sua URL real do Passo 4)*
   - **Description:** `Calcarq Production Webhook`
5. Selecione eventos:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
6. Clique em **"Add endpoint"**

### 5.3: Copiar Webhook Secret

1. Na página do webhook criado, clique em **"Reveal"** ao lado de "Signing secret"
2. **Copie o secret** (começa com `whsec_`)
3. Na Vercel, edite `STRIPE_WEBHOOK_SECRET`:
   - Vá em **Settings** → **Environment Variables**
   - Clique nos 3 pontinhos de `STRIPE_WEBHOOK_SECRET` → **"Edit"**
   - Cole o secret
   - Clique em **"Save"**

### 5.4: Fazer Novo Deploy

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** → **"Redeploy"**

---

## ✅ TESTAR SE ESTÁ FUNCIONANDO

### Teste 1: Health Check
Abra no navegador:
```
https://calcarq-abc123.vercel.app/health
```

Deve aparecer: `{"status":"ok","timestamp":"..."}`

### Teste 2: Frontend
Abra no navegador:
```
https://calcarq-abc123.vercel.app
```

Deve abrir a página inicial.

### Teste 3: Pagamento
1. Acesse a aplicação
2. Crie uma conta
3. Faça um pagamento de teste
4. Verifique se funciona!

---

## 🐛 PROBLEMAS COMUNS

### "Build failed"
- Verifique se todas as dependências estão no `package.json`
- Veja os logs na Vercel: **Deployments** → Clique no deploy → **"Logs"**

### "API retorna 404"
- Verifique se os arquivos em `api/` foram commitados
- Verifique se o `vercel.json` está correto

### "Webhook não funciona"
- Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- Verifique se a URL do webhook no Stripe está correta
- Veja os logs na Vercel: **Deployments** → **Functions** → **Logs**

---

## 📝 RESUMO DOS COMANDOS

```bash
# 1. Preparar Git
cd "/home/ramon/Secretária/CALCARQ"
git add .
git commit -m "Preparar para deploy"
git push

# 2. Depois, faça tudo pela interface da Vercel (navegador)
```

---

## 🎉 PRONTO!

Seu projeto está no ar! 🚀

Qualquer atualização futura: faça `git push` e a Vercel faz deploy automático!

