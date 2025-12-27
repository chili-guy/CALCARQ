# 🔑 Como Configurar STRIPE_PRICE_ID

## ❌ Problema Atual

O Payment Link direto do Stripe (`buy.stripe.com`) **não passa** o `client_reference_id` para o `payment_intent`, então o webhook não consegue identificar o usuário.

## ✅ Solução

Usar a **API do Stripe** para criar sessões de checkout, que **garante** que o `client_reference_id` esteja presente.

## 📝 Passo a Passo

### 1. Encontrar o Price ID no Stripe

1. Acesse: **https://dashboard.stripe.com/products**
2. Clique no produto que você quer usar (ou crie um novo)
3. Na página do produto, você verá os **Prices** (Preços)
4. Clique no preço que você quer usar
5. Copie o **Price ID** (começa com `price_`)
   - Exemplo: `price_1ABC123def456GHI789`

### 2. Adicionar no Railway

1. Railway → Seu Projeto → **Variables**
2. Adicione:
   ```
   STRIPE_PRICE_ID=price_1ABC123def456GHI789
   ```
   (Substitua pelo seu Price ID real)
3. Salve (o Railway vai fazer redeploy)

### 3. Verificar se Funcionou

Após o deploy:
1. Faça um novo pagamento de teste
2. O frontend vai usar a API em vez do link direto
3. O webhook vai receber `checkout.session.completed` com `client_reference_id`
4. O pagamento será processado corretamente! ✅

## 🔍 Como Verificar se Está Funcionando

### Nos Logs do Railway:

Procure por:
- ✅ `CHECKOUT_SESSION_CREATED` - Sessão criada via API
- ✅ `CHECKOUT_SESSION_COMPLETED` - Pagamento processado
- ✅ `PAYMENT_PROCESSED_SUCCESS` - Usuário atualizado

### Se Ainda Usar Fallback:

Se você ver:
- ⚠️ `Erro ao criar sessão via API, usando link direto`

Significa que `STRIPE_PRICE_ID` não está configurado ou está incorreto.

## 💡 Dica

Se você não tem um produto/preço criado no Stripe:

1. Acesse: **https://dashboard.stripe.com/products**
2. Clique em **"Add product"**
3. Preencha:
   - **Name**: "Acesso Calcarq" (ou o nome que quiser)
   - **Price**: R$ 19,30 (ou o valor que quiser)
   - **Billing period**: One time
4. Clique em **"Save product"**
5. Copie o **Price ID** gerado
6. Adicione no Railway como `STRIPE_PRICE_ID`

---

**Última atualização**: Dezembro 2025


