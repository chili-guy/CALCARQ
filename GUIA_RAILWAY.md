# 🚂 Guia Completo: Deploy no Railway

Este guia vai te ajudar a fazer deploy do Calcarq no Railway de forma gratuita e funcional.

## 📋 Pré-requisitos

1. **Conta no Railway**: https://railway.app (pode usar GitHub para login)
2. **Conta no Stripe**: https://stripe.com (para pagamentos)
3. **Repositório no GitHub**: Seu código já deve estar no GitHub

---

## 🎯 Passo 1: Preparar o Projeto

### 1.1 Verificar arquivos criados

Os seguintes arquivos já foram criados automaticamente:
- ✅ `railway.json` - Configuração do Railway
- ✅ `Procfile` - Comando de inicialização
- ✅ `nixpacks.toml` - Configuração de build
- ✅ `server/index.js` - Adaptado para servir frontend + backend

### 1.2 Fazer commit e push

```bash
cd "/home/ramon/Secretária/CALCARQ"

# Adicionar arquivos novos
git add railway.json Procfile nixpacks.toml server/index.js package.json

# Commit
git commit -m "feat: adicionar configuração para Railway"

# Push
git push
```

---

## 🚀 Passo 2: Criar Projeto no Railway

### 2.1 Acessar Railway

1. Acesse: https://railway.app
2. Faça login com sua conta GitHub
3. Clique em **"New Project"**

### 2.2 Conectar Repositório

1. Selecione **"Deploy from GitHub repo"**
2. Escolha o repositório **CALCARQ**
3. Clique em **"Deploy Now"**

### 2.3 Aguardar Build Inicial

- O Railway vai detectar automaticamente o projeto
- Vai instalar dependências e fazer build
- ⏱️ Aguarde 3-5 minutos para o primeiro build

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

### 3.1 Acessar Configurações

1. No projeto Railway, clique em **"Variables"** (ou **"Settings"** → **"Variables"**)

### 3.2 Adicionar Variáveis

Adicione as seguintes variáveis:

#### 🔑 Variáveis Obrigatórias

```bash
# Stripe - Chaves de API
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_... em produção)
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL (será preenchido depois)
FRONTEND_URL=https://seu-projeto.railway.app

# Ambiente
NODE_ENV=production
RAILWAY=1
PORT=3001
```

#### 📝 Como encontrar as chaves do Stripe:

1. **STRIPE_SECRET_KEY**:
   - Acesse: https://dashboard.stripe.com/apikeys
   - Copie a **Secret key** (test ou live)
   - Cole no Railway

2. **STRIPE_WEBHOOK_SECRET**:
   - Será configurado depois (Passo 5)

3. **FRONTEND_URL**:
   - Depois que o deploy estiver pronto, copie a URL do Railway
   - Formato: `https://CALCARQ.railway.app`

### 3.3 Salvar Variáveis

- Clique em **"Add"** para cada variável
- O Railway vai fazer redeploy automaticamente

---

## 🌐 Passo 4: Configurar Domínio Público

### 4.1 Encontrar o Link do Projeto

O link do seu projeto aparece em **vários lugares** no Railway:

#### 📍 Opção 1: Na Página Principal do Projeto
1. No Railway, clique no seu projeto **CALCARQ**
2. Na parte superior, você verá uma seção **"Networking"** ou **"Domains"**
3. O link aparece como: `https://CALCARQ-production.up.railway.app` ou similar

#### 📍 Opção 2: Em Settings → Networking
1. No projeto Railway, clique em **"Settings"** (ícone de engrenagem)
2. Role até a seção **"Networking"** ou **"Domains"**
3. Você verá o domínio gerado automaticamente
4. Se não houver domínio, clique em **"Generate Domain"**

#### 📍 Opção 3: No Deploy
1. Vá em **"Deployments"**
2. Clique no deploy mais recente
3. Na parte superior, você verá a URL do serviço

### 4.2 Gerar Domínio (se não tiver)

1. No projeto Railway, vá em **"Settings"**
2. Role até **"Networking"** ou **"Domains"**
3. Clique em **"Generate Domain"** ou **"Add Domain"**
4. Copie a URL gerada (ex: `calcarq-production.up.railway.app` ou `CALCARQ.railway.app`)

### 4.2 Atualizar FRONTEND_URL

1. Volte em **"Variables"**
2. Atualize `FRONTEND_URL` com a URL gerada:
   ```
   FRONTEND_URL=https://calcarq-production.up.railway.app
   ```
3. Salve (o Railway vai fazer redeploy)

---

## 🔔 Passo 5: Configurar Webhook do Stripe

### 5.1 Obter URL do Webhook

A URL do webhook será:
```
https://seu-projeto.up.railway.app/api/webhook/stripe
```

**Substitua** `seu-projeto.up.railway.app` pela URL real do seu projeto Railway.

### 5.2 Configurar no Stripe Dashboard

1. Acesse: https://calcarq-production-e4d3.up.railway.app/api/webhook/stripe
2. Clique em **"Add endpoint"**
3. Cole a URL do webhook:
   ```
   calcarq-production-e4d3.up.railway.app/api/webhook/stripe
   ```
4. Selecione os eventos:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Clique em **"Add endpoint"**

### 5.3 Copiar Webhook Secret

1. Após criar o endpoint, clique nele
2. Role até **"Signing secret"**
3. Clique em **"Reveal"** ou **"Click to reveal"**
4. Copie o secret (começa com `whsec_`)

### 5.4 Adicionar no Railway

1. Volte no Railway → **"Variables"**
2. Adicione ou atualize:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Salve (redeploy automático)

---

## ✅ Passo 6: Verificar Deploy

### 6.1 Verificar Health Check

Acesse no navegador:
```
https://seu-projeto.up.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX..."
}
```

### 6.2 Verificar Frontend

Acesse:
```
https://seu-projeto.up.railway.app
```

Deve abrir a página inicial do Calcarq.

### 6.3 Verificar Logs

1. No Railway, vá em **"Deployments"**
2. Clique no deploy mais recente
3. Veja os logs em tempo real
4. Procure por:
   - ✅ `🚀 Servidor rodando na porta 3001`
   - ✅ `✅ Frontend estático configurado`
   - ✅ `🌐 Railway: Servindo frontend + backend`

---

## 🧪 Passo 7: Testar Pagamento

### 7.1 Testar com Cartão de Teste

1. Acesse a página de pagamento
2. Use cartão de teste do Stripe:
   - **Número**: `4242 4242 4242 4242`
   - **Data**: Qualquer data futura
   - **CVC**: Qualquer 3 dígitos
   - **CEP**: Qualquer CEP válido

### 7.2 Verificar Webhook

1. No Stripe Dashboard → **"Webhooks"**
2. Clique no seu endpoint
3. Veja os eventos recebidos
4. Deve aparecer `checkout.session.completed`

### 7.3 Verificar Logs no Railway

1. Railway → **"Deployments"** → Logs
2. Procure por:
   - `CHECKOUT_SESSION_COMPLETED`
   - `PAYMENT_PROCESSED_SUCCESS`

---

## 🔧 Troubleshooting

### ❌ Erro: "Cannot find module"

**Solução:**
- Verifique se todas as dependências estão no `package.json`
- O Railway deve fazer `npm install` automaticamente

### ❌ Erro: "Port already in use"

**Solução:**
- O Railway define a porta automaticamente via `PORT`
- Não precisa configurar manualmente

### ❌ Frontend não aparece

**Solução:**
1. Verifique se o build foi feito: `npm run build`
2. Verifique se existe a pasta `dist/`
3. Veja os logs do Railway

### ❌ Webhook não funciona

**Solução:**
1. Verifique se `STRIPE_WEBHOOK_SECRET` está configurado
2. Verifique se a URL do webhook está correta no Stripe
3. Veja os logs do Railway para erros

### ❌ Erro 500 no webhook

**Solução:**
1. Verifique os logs do Railway
2. Certifique-se que `STRIPE_SECRET_KEY` está correto
3. Verifique se o webhook secret está correto

---

## 📊 Monitoramento

### Ver Logs em Tempo Real

1. Railway → **"Deployments"**
2. Clique no deploy
3. Veja logs em tempo real

### Ver Estatísticas

Acesse:
```
https://seu-projeto.up.railway.app/api/stats
```

Retorna:
```json
{
  "totalUsers": 10,
  "paidUsers": 5,
  "unpaidUsers": 5,
  "paymentEvents": 5,
  "conversionRate": "50.00%"
}
```

### Ver Logs de Pagamento

Acesse:
```
https://seu-projeto.up.railway.app/api/logs
```

---

## 💰 Plano Gratuito do Railway

O Railway oferece:
- ✅ **$5 grátis** por mês
- ✅ Deploy ilimitado
- ✅ Domínio `.railway.app` grátis
- ✅ HTTPS automático
- ✅ Logs em tempo real

**Limitações:**
- Após $5, precisa adicionar cartão
- Serviço pode pausar após inatividade (mas volta automaticamente)

---

## 🎉 Pronto!

Seu Calcarq está rodando no Railway! 🚀

### URLs Importantes:

- **Frontend**: `https://seu-projeto.up.railway.app`
- **Health Check**: `https://seu-projeto.up.railway.app/health`
- **Webhook**: `https://seu-projeto.up.railway.app/api/webhook/stripe`
- **API Stats**: `https://seu-projeto.up.railway.app/api/stats`

---

## 📞 Precisa de Ajuda?

1. Veja os logs no Railway
2. Verifique as variáveis de ambiente
3. Teste localmente primeiro
4. Consulte a documentação: https://docs.railway.app

---

**Última atualização**: Janeiro 2025

