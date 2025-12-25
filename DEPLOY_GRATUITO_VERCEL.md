# 🚀 Deploy Gratuito na Vercel - Guia Completo

## ✅ Por que Vercel?

- ✅ **100% Gratuito** para projetos pessoais
- ✅ Deploy automático do Git
- ✅ Frontend + Backend (Serverless Functions) juntos
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Sem configuração de servidor

---

## 📋 Pré-requisitos

- [x] Código no GitHub (você já tem ✅)
- [ ] Conta na Vercel (vamos criar agora)
- [ ] Chaves do Stripe configuradas

---

## 🚀 PASSO 1: Criar Conta na Vercel

### 1.1 Acessar Vercel

1. Abra: **https://vercel.com/signup**
2. Clique em **"Continue with GitHub"** (ou GitLab/Bitbucket)
3. Autorize o acesso ao seu repositório
4. Pronto! Conta criada ✅

---

## 📦 PASSO 2: Fazer Deploy do Projeto

### 2.1 Importar Projeto

1. Após fazer login, clique em **"Add New..."** → **"Project"**
2. Você verá seus repositórios do GitHub
3. **Encontre e clique em "CALCARQ"** (ou o nome do seu repositório)
4. Clique em **"Import"**

### 2.2 Configurar Projeto

A Vercel vai detectar automaticamente:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`

**Você só precisa verificar:**

1. **Project Name:** `calcarq-web` (ou o nome que preferir)
2. **Root Directory:** `.` (raiz do projeto)
3. **Framework Preset:** Vite (já detectado)

### 2.3 Fazer Primeiro Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. ✅ **Deploy concluído!**

Você receberá uma URL como: `https://calcarq-web.vercel.app`

---

## ⚙️ PASSO 3: Configurar Variáveis de Ambiente

### 3.1 Acessar Configurações

1. No projeto, vá em **Settings** (Configurações)
2. Clique em **Environment Variables** (Variáveis de Ambiente)

### 3.2 Adicionar Variáveis

Adicione estas variáveis:

#### 1. STRIPE_SECRET_KEY
- **Key:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_...` (sua chave secreta do Stripe - obtenha em https://dashboard.stripe.com/apikeys)
- **Environment:** Selecione todas (Production, Preview, Development)

#### 2. STRIPE_WEBHOOK_SECRET
- **Key:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_...` (secret do webhook - obtenha após criar webhook no Stripe)
- **Environment:** Selecione todas

#### 3. FRONTEND_URL (Opcional)
- **Key:** `FRONTEND_URL`
- **Value:** `https://calcarq-web.vercel.app` (sua URL da Vercel)
- **Environment:** Production

#### 4. NODE_ENV (Opcional)
- **Key:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production

### 3.3 Fazer Novo Deploy

**IMPORTANTE:** Após adicionar variáveis, faça novo deploy:

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deployment
3. Clique em **"Redeploy"**
4. Aguarde terminar

---

## 🔔 PASSO 4: Configurar Webhook no Stripe

### 4.1 Acessar Stripe Dashboard

1. Acesse: **https://dashboard.stripe.com/webhooks**
2. **Certifique-se de estar em "Test mode"** (canto superior direito)

### 4.2 Criar Webhook

1. Clique em **"Add endpoint"**
2. Preencha:
   - **Endpoint URL:** `https://calcarq-web.vercel.app/api/webhook/stripe`
     *(Use a URL que a Vercel deu para você)*
   - **Description:** `Calcarq Webhook`
3. Selecione eventos:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
4. Clique em **"Add endpoint"**

### 4.3 Copiar Webhook Secret

1. Na página do webhook criado
2. Clique em **"Reveal"** ao lado de "Signing secret"
3. **Copie o secret** (começa com `whsec_`)
4. Volte na Vercel e atualize `STRIPE_WEBHOOK_SECRET` com esse valor
5. Faça novo deploy

---

## ✅ PASSO 5: Verificar se Está Funcionando

### 5.1 Health Check

Abra no navegador:
```
https://calcarq-web.vercel.app/health
```

Deve retornar: `{"status":"ok","timestamp":"..."}`

### 5.2 Frontend

Abra no navegador:
```
https://calcarq-web.vercel.app
```

Você deve ver a página inicial do Calcarq!

### 5.3 Testar Webhook

1. No Stripe Dashboard, vá em **Webhooks**
2. Clique no seu webhook
3. Clique em **"Send test webhook"**
4. Selecione: `checkout.session.completed`
5. Clique em **"Send test webhook"**
6. Verifique os logs na Vercel:
   - **Deployments** → Último deployment → **Functions** → `api/webhook/stripe` → **Logs**

---

## 🔄 Deploy Automático

A Vercel faz deploy automático quando você faz push no Git:

1. Faça alterações no código
2. Faça commit e push:
   ```bash
   git add .
   git commit -m "Minhas alterações"
   git push
   ```
3. A Vercel detecta automaticamente
4. Faz deploy em 2-3 minutos
5. ✅ Pronto!

---

## 📊 Ver Logs e Debug

### Ver Logs do Deploy

1. Vá em **Deployments**
2. Clique no deployment
3. Veja os logs do build

### Ver Logs das Functions

1. Vá em **Deployments**
2. Clique no deployment
3. Vá em **Functions**
4. Clique na function (ex: `api/webhook/stripe`)
5. Clique em **"Logs"**

---

## 🐛 Problemas Comuns

### "Build failed"

**Causa:** Erro no código ou dependências

**Solução:**
1. Veja os logs do build na Vercel
2. Teste localmente: `npm run build`
3. Corrija os erros
4. Faça push novamente

### "Function timeout"

**Causa:** Function demora muito

**Solução:**
- Verifique `vercel.json` - já está configurado com `maxDuration: 30`

### "Webhook não funciona"

**Causa:** Variáveis não configuradas ou webhook errado

**Solução:**
1. Verifique `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` na Vercel
2. Verifique se o webhook no Stripe está em **"Test mode"**
3. Verifique a URL do webhook
4. Faça novo deploy após configurar

---

## 📝 Checklist Final

- [ ] Conta Vercel criada
- [ ] Projeto importado do GitHub
- [ ] Primeiro deploy feito
- [ ] `STRIPE_SECRET_KEY` configurado na Vercel
- [ ] `STRIPE_WEBHOOK_SECRET` configurado na Vercel
- [ ] Webhook criado no Stripe (Test mode)
- [ ] Novo deploy feito após configurar variáveis
- [ ] Health check funcionando
- [ ] Frontend acessível
- [ ] Webhook testado

---

## 🎯 Resumo Rápido

1. **Criar conta:** https://vercel.com/signup
2. **Importar projeto:** Add New → Project → CALCARQ
3. **Deploy:** Clique em Deploy
4. **Configurar variáveis:** Settings → Environment Variables
5. **Configurar webhook:** Stripe Dashboard → Webhooks
6. **Redeploy:** Deployments → Redeploy

---

## 💰 Limites Gratuitos da Vercel

- ✅ **100 GB bandwidth/mês** (mais que suficiente)
- ✅ **100 builds/mês** (mais que suficiente)
- ✅ **Serverless Functions:** 100 GB-hours/mês
- ✅ **HTTPS automático**
- ✅ **CDN global**

**Para projetos pessoais, é mais que suficiente!** 🎉

---

## 🚀 Próximos Passos

1. ✅ Deploy feito
2. ✅ Teste o sistema completo
3. ✅ Quando estiver pronto, mude para chaves LIVE do Stripe
4. ✅ Ative sua conta Stripe para receber pagamentos reais

---

**Pronto para fazer deploy!** 🚀

Siga os passos acima e em 10 minutos seu projeto estará no ar!

