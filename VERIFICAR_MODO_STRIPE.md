# 🔍 Verificar Modo Stripe (Test vs Live)

## ⚠️ PROBLEMA COMUM

Se você está usando chaves de **TESTE** no Vercel, mas o webhook no Stripe está configurado em modo **LIVE** (ou vice-versa), o webhook **NÃO VAI FUNCIONAR**!

---

## ✅ SOLUÇÃO: Verificar e Alinhar Modos

### Passo 1: Verificar Modo das Chaves na Vercel

1. Acesse: **https://vercel.com/seu-projeto/settings/environment-variables**
2. Verifique `STRIPE_SECRET_KEY`:
   - Se começa com `sk_test_` → **MODO TESTE**
   - Se começa com `sk_live_` → **MODO PRODUÇÃO**

---

### Passo 2: Verificar Modo do Webhook no Stripe

1. Acesse: **https://dashboard.stripe.com/webhooks**
2. **OLHE O CANTO SUPERIOR DIREITO:**
   - Se diz **"Test mode"** → Webhook está em TESTE
   - Se diz **"Live mode"** → Webhook está em PRODUÇÃO

3. Verifique o webhook que você criou:
   - Clique no webhook
   - Veja a URL: `https://calcarq-web.vercel.app/api/webhook/stripe`
   - Veja o **"Signing secret"** (começa com `whsec_`)

---

### Passo 3: Alinhar Modos

**CENÁRIO A: Você quer usar MODO TESTE (recomendado para começar)**

#### 3.1 Verificar chave na Vercel
- ✅ Deve ser: `sk_test_xxxxxxxxxxxxx`
- ❌ Se for `sk_live_...`, você precisa mudar

#### 3.2 Verificar webhook no Stripe
1. Acesse: **https://dashboard.stripe.com/webhooks**
2. **Certifique-se de estar em "Test mode"** (canto superior direito)
3. Se estiver em "Live mode", **mude para "Test mode"**
4. Verifique se o webhook existe em modo TESTE
5. Se não existir, crie um novo:
   - Clique em **"Add endpoint"**
   - URL: `https://calcarq-web.vercel.app/api/webhook/stripe`
   - Eventos: `checkout.session.completed`, `payment_intent.succeeded`
   - Clique em **"Add endpoint"**
6. Copie o **"Signing secret"** (começa com `whsec_`)

#### 3.3 Atualizar Vercel
1. Vá em **Settings** → **Environment Variables**
2. Verifique `STRIPE_SECRET_KEY`:
   - Deve ser `sk_test_...`
   - Se não for, edite e cole a chave de TESTE
3. Verifique `STRIPE_WEBHOOK_SECRET`:
   - Deve ser o secret do webhook em **TEST mode**
   - Se não for, edite e cole o secret correto
4. **Faça novo deploy** (Deployments → 3 pontinhos → Redeploy)

---

**CENÁRIO B: Você quer usar MODO PRODUÇÃO**

⚠️ **ATENÇÃO:** Só use produção se:
- ✅ Sua conta Stripe está ativada
- ✅ Informações fiscais preenchidas
- ✅ Conta bancária configurada
- ✅ Você quer processar pagamentos reais

#### 3.1 Obter chave LIVE
1. Acesse: **https://dashboard.stripe.com/apikeys**
2. **Mude para "Live mode"** (canto superior direito)
3. Clique em **"Reveal live key"**
4. Copie a chave (começa com `sk_live_`)

#### 3.2 Criar webhook em LIVE mode
1. Acesse: **https://dashboard.stripe.com/webhooks**
2. **Certifique-se de estar em "Live mode"** (canto superior direito)
3. Clique em **"Add endpoint"**
4. URL: `https://calcarq-web.vercel.app/api/webhook/stripe`
5. Eventos: `checkout.session.completed`, `payment_intent.succeeded`
6. Clique em **"Add endpoint"**
7. Copie o **"Signing secret"** (começa com `whsec_`)

#### 3.3 Atualizar Vercel
1. Vá em **Settings** → **Environment Variables**
2. Edite `STRIPE_SECRET_KEY`:
   - Cole a chave `sk_live_...`
3. Edite `STRIPE_WEBHOOK_SECRET`:
   - Cole o secret do webhook em **LIVE mode**
4. **Faça novo deploy**

---

## 🔍 Checklist de Verificação

### ✅ Modo TESTE:
- [ ] `STRIPE_SECRET_KEY` na Vercel começa com `sk_test_`
- [ ] Stripe Dashboard está em **"Test mode"**
- [ ] Webhook foi criado em **"Test mode"**
- [ ] `STRIPE_WEBHOOK_SECRET` na Vercel é do webhook em **"Test mode"**
- [ ] Frontend usa chave pública de teste (`pk_test_...`)

### ✅ Modo PRODUÇÃO:
- [ ] Conta Stripe ativada
- [ ] `STRIPE_SECRET_KEY` na Vercel começa com `sk_live_`
- [ ] Stripe Dashboard está em **"Live mode"**
- [ ] Webhook foi criado em **"Live mode"**
- [ ] `STRIPE_WEBHOOK_SECRET` na Vercel é do webhook em **"Live mode"**
- [ ] Frontend usa chave pública de produção (`pk_live_...`)

---

## 🐛 Problemas Comuns

### "Webhook retorna 400"
- ❌ Chave de TESTE + Webhook em LIVE mode
- ❌ Chave de LIVE + Webhook em TEST mode
- ✅ **Solução:** Alinhe os modos!

### "Webhook não recebe eventos"
- ❌ Webhook criado no modo errado
- ❌ URL do webhook incorreta
- ✅ **Solução:** Verifique modo e URL

### "Assinatura inválida"
- ❌ `STRIPE_WEBHOOK_SECRET` do modo errado
- ❌ Secret expirado ou regenerado
- ✅ **Solução:** Copie o secret correto do webhook no modo correto

---

## 📝 Resumo

**REGRA DE OURO:**
- ✅ Chave de TESTE → Webhook em TEST mode → Secret de TEST mode
- ✅ Chave de LIVE → Webhook em LIVE mode → Secret de LIVE mode

**NUNCA misture:**
- ❌ Chave de TESTE + Webhook em LIVE mode
- ❌ Chave de LIVE + Webhook em TEST mode

---

## 🎯 Recomendação

**Para testar inicialmente:**
1. ✅ Use **MODO TESTE** em tudo
2. ✅ Chave `sk_test_...` na Vercel
3. ✅ Webhook em **"Test mode"** no Stripe
4. ✅ Secret do webhook em **"Test mode"** na Vercel
5. ✅ Teste com cartão: `4242 4242 4242 4242`

**Depois que validar:**
1. ✅ Ative conta Stripe para produção
2. ✅ Mude tudo para **MODO PRODUÇÃO**
3. ✅ Atualize chaves e secrets
4. ✅ Faça novo deploy

---

**Verifique agora mesmo se os modos estão alinhados!** 🔍

