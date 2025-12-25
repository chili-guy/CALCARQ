# 🚀 Guia Completo - Deploy na Vercel

## 📋 O que você vai fazer

Você vai fazer deploy do **frontend e backend** juntos na Vercel, tudo em um único projeto.

---

## ✅ Pré-requisitos

- [ ] Conta na Vercel (crie em: https://vercel.com/signup)
- [ ] Conta no Stripe (já tem)
- [ ] Código no GitHub/GitLab/Bitbucket (ou prepare para fazer push)
- [ ] Node.js instalado localmente (para testar antes)

---

## 🔧 ETAPA 1: Preparar o Código

### Passo 1.1: Verificar arquivos importantes

Certifique-se de que estes arquivos existem:
- ✅ `vercel.json` (já criado)
- ✅ `package.json` (raiz)
- ✅ `server/package.json`
- ✅ `server/index.js`

### Passo 1.2: Verificar se o build funciona localmente

```bash
# Na raiz do projeto
npm run build
```

Se funcionar, você verá a pasta `dist/` criada.

---

## 📦 ETAPA 2: Fazer Push para o Git

### Passo 2.1: Inicializar Git (se ainda não fez)

```bash
cd "/home/ramon/Secretária/CALCARQ"

# Verificar se já é um repositório Git
git status
```

Se não for um repositório Git:

```bash
git init
git add .
git commit -m "Preparar para deploy na Vercel"
```

### Passo 2.2: Criar repositório no GitHub

1. Acesse: https://github.com/new
2. Crie um novo repositório (ex: `calcarq`)
3. **NÃO** inicialize com README (se já tem código)

### Passo 2.3: Conectar e fazer push

```bash
# Adicionar remote (substitua SEU_USUARIO e SEU_REPO)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git

# Fazer push
git branch -M main
git push -u origin main
```

---

## 🌐 ETAPA 3: Deploy na Vercel

### Passo 3.1: Conectar repositório

1. Acesse: https://vercel.com/new
2. Faça login (ou crie conta)
3. Clique em **"Import Project"**
4. Selecione seu repositório do GitHub/GitLab/Bitbucket
5. Clique em **"Import"**

### Passo 3.2: Configurar o projeto

A Vercel deve detectar automaticamente:
- **Framework Preset**: Vite
- **Root Directory**: `./` (raiz)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Deixe como está** (já está correto).

### Passo 3.3: Configurar variáveis de ambiente

**IMPORTANTE:** Antes de fazer deploy, configure as variáveis de ambiente:

1. Na página de configuração do projeto, role até **"Environment Variables"**
2. Adicione as seguintes variáveis:

#### Variáveis do Frontend:
```
VITE_API_URL = https://seu-projeto.vercel.app
```
*(Você vai atualizar isso depois com a URL real)*

#### Variáveis do Backend:
```
STRIPE_SECRET_KEY = sk_live_SUA_CHAVE_LIVE_AQUI
```
*(Use a chave LIVE do Stripe, não a de teste)*

```
STRIPE_WEBHOOK_SECRET = whsec_SEU_SECRET_AQUI
```
*(Você vai obter isso depois de configurar o webhook)*

```
FRONTEND_URL = https://seu-projeto.vercel.app
```
*(Você vai atualizar isso depois com a URL real)*

```
NODE_ENV = production
```

```
PORT = (deixe vazio - a Vercel define automaticamente)
```

### Passo 3.4: Fazer o primeiro deploy

1. Clique em **"Deploy"**
2. Aguarde o build terminar (pode levar alguns minutos)
3. Anote a URL que será gerada (ex: `https://calcarq-abc123.vercel.app`)

---

## 🔑 ETAPA 4: Atualizar Variáveis de Ambiente

### Passo 4.1: Obter a URL do projeto

Após o deploy, você terá uma URL como:
```
https://calcarq-abc123.vercel.app
```

### Passo 4.2: Atualizar variáveis na Vercel

1. No dashboard da Vercel, vá em **Settings** → **Environment Variables**
2. Atualize:

```
VITE_API_URL = https://calcarq-abc123.vercel.app
FRONTEND_URL = https://calcarq-abc123.vercel.app
```

3. Clique em **"Save"**

### Passo 4.3: Fazer novo deploy

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **"Redeploy"**
4. Ou faça um novo commit e push (deploy automático)

---

## 🔔 ETAPA 5: Configurar Webhook do Stripe (PRODUÇÃO)

### Passo 5.1: Obter chaves LIVE do Stripe

1. Acesse: https://dashboard.stripe.com/apikeys
2. **Mude para "Live mode"** (canto superior direito)
3. Copie a **Secret key** (começa com `sk_live_`)
4. Atualize `STRIPE_SECRET_KEY` na Vercel com essa chave

### Passo 5.2: Criar webhook no Stripe

1. Acesse: https://dashboard.stripe.com/webhooks
2. Certifique-se de estar em **"Live mode"**
3. Clique em **"Add endpoint"**
4. Preencha:
   - **Endpoint URL**: `https://seu-projeto.vercel.app/api/webhook/stripe`
     *(Substitua pelo seu domínio real)*
   - **Description**: "Calcarq Production Webhook"
5. Selecione os eventos:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
6. Clique em **"Add endpoint"**

### Passo 5.3: Copiar webhook secret

1. Na página do webhook criado, clique em **"Reveal"** ao lado de "Signing secret"
2. Copie o secret (começa com `whsec_`)
3. Atualize `STRIPE_WEBHOOK_SECRET` na Vercel

### Passo 5.4: Fazer novo deploy

Faça um novo deploy para aplicar as mudanças.

---

## ✅ ETAPA 6: Verificar se está funcionando

### Passo 6.1: Testar Health Check

Acesse no navegador:
```
https://seu-projeto.vercel.app/health
```

Deve retornar: `{"status":"ok","timestamp":"..."}`

### Passo 6.2: Testar Frontend

Acesse:
```
https://seu-projeto.vercel.app
```

Deve abrir a página inicial.

### Passo 6.3: Testar API

Acesse:
```
https://seu-projeto.vercel.app/api/logs
```

Deve retornar os logs (mesmo que vazio inicialmente).

### Passo 6.4: Testar Pagamento

1. Acesse a aplicação
2. Crie uma conta
3. Faça um pagamento de teste
4. Verifique se o webhook processa corretamente

---

## 🐛 Problemas Comuns

### Build falha

**Erro:** "Cannot find module"
**Solução:**
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente e faça commit do `package-lock.json`

### API retorna 404

**Solução:**
- Verifique se o `vercel.json` está correto
- Verifique se as rotas `/api/*` estão configuradas

### Webhook não funciona

**Solução:**
1. Verifique se `STRIPE_WEBHOOK_SECRET` está correto
2. Verifique se a URL do webhook no Stripe está correta
3. Verifique os logs na Vercel: **Deployments** → **Functions** → **Logs**

### Frontend não conecta ao backend

**Solução:**
1. Verifique se `VITE_API_URL` está correto (deve ser a URL da Vercel)
2. Verifique se `FRONTEND_URL` está correto no backend
3. Verifique CORS no código do backend

---

## 📝 Checklist Final

Antes de considerar o deploy completo:

- [ ] Código no Git (GitHub/GitLab/Bitbucket)
- [ ] Projeto conectado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build funcionando
- [ ] Health check respondendo
- [ ] Frontend acessível
- [ ] Webhook do Stripe configurado (LIVE mode)
- [ ] Teste de pagamento funcionando
- [ ] Logs sendo gerados corretamente

---

## 🔄 Atualizações Futuras

Após o deploy inicial, qualquer push para a branch `main` (ou a branch configurada) fará deploy automático.

Para atualizar:
1. Faça suas alterações
2. Commit e push:
   ```bash
   git add .
   git commit -m "Sua mensagem"
   git push
   ```
3. A Vercel fará deploy automaticamente

---

## 📚 Links Úteis

- Dashboard Vercel: https://vercel.com/dashboard
- Documentação Vercel: https://vercel.com/docs
- Stripe Dashboard: https://dashboard.stripe.com
- Logs do projeto: Vercel Dashboard → Seu Projeto → Deployments → Logs

---

## 🎉 Pronto!

Seu projeto está no ar! 🚀

Qualquer dúvida, consulte a documentação da Vercel ou os logs do projeto.


