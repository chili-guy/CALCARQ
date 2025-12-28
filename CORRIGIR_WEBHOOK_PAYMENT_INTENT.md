# 🔧 Corrigir Webhook: payment_intent.succeeded

## ❌ Problema

O webhook está recebendo `payment_intent.succeeded` (200 OK), mas a aplicação não está processando o pagamento porque:

1. O código atual apenas faz **log** do evento, mas não atualiza o status do usuário
2. Quando você usa um **Payment Link direto** (`buy.stripe.com`), o Stripe pode não criar uma sessão de checkout tradicional
3. O `client_reference_id` passado na URL pode não chegar ao `payment_intent`

## ✅ Solução Implementada

Atualizei o código do webhook para processar `payment_intent.succeeded` corretamente:

1. **Busca userId em metadata** do payment_intent
2. **Busca sessão de checkout relacionada** ao payment_intent
3. **Busca userId no customer** (se houver)
4. **Atualiza status de pagamento** quando encontra o userId

## 📝 O que foi alterado

### Arquivo: `server/index.js`

O handler de `payment_intent.succeeded` agora:
- Busca o userId de várias formas
- Atualiza o status de pagamento quando encontra
- Cria o usuário se não existir
- Faz logs detalhados para debug

## 🚀 Próximos Passos

### 1. Fazer Deploy

```bash
cd "/home/ramon/Secretária/CALCARQ"
git add server/index.js
git commit -m "fix: processar payment_intent.succeeded no webhook"
git push
```

### 2. Aguardar Deploy no Railway

O Railway vai fazer deploy automaticamente.

### 3. Testar Novamente

1. Faça um novo pagamento de teste
2. Verifique os logs no Railway
3. Verifique se o status foi atualizado

## 🔍 Verificar Logs

No Railway → **Deployments** → **Logs**, procure por:

- ✅ `PAYMENT_INTENT_SUCCEEDED`
- ✅ `FOUND_CHECKOUT_SESSION` ou `FOUND_USER_ID_IN_METADATA`
- ✅ `PAYMENT_PROCESSED_FROM_INTENT`
- ❌ `PAYMENT_INTENT_NO_USER_ID` (se não encontrar userId)

## 💡 Melhor Solução (Futuro)

Para garantir que o `client_reference_id` sempre chegue, considere:

**Criar sessão de checkout via API** em vez de usar Payment Link direto:

```javascript
// Em vez de usar: https://buy.stripe.com/...
// Criar sessão via API:
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  mode: 'payment',
  client_reference_id: userId, // ✅ Sempre funciona
  success_url: `${FRONTEND_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${FRONTEND_URL}/payment?canceled=true`,
});
```

Isso garante que o `client_reference_id` sempre esteja presente.

---

**Última atualização**: Dezembro 2025



