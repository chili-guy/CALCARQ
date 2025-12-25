# 🔧 Solução: payment_intent.succeeded sem userId

## ❌ Problema

Quando você usa um **Payment Link direto** do Stripe (`buy.stripe.com`), o Stripe pode:
1. Criar apenas um `payment_intent` sem criar uma sessão de checkout tradicional
2. O `client_reference_id` passado na URL não chega ao `payment_intent`
3. O webhook recebe `payment_intent.succeeded` mas não consegue identificar o usuário
4. O frontend fica fazendo polling infinito esperando `hasPaid = true`

## ✅ Soluções Implementadas

### 1. Melhorias no Webhook

- Busca melhorada de sessões de checkout
- Busca por charge relacionado
- Logs detalhados para debug
- Tratamento de casos onde não há sessão

### 2. Endpoint de Verificação Manual Melhorado

O endpoint `/api/payment/verify` agora aceita:
- `sessionId` (checkout session)
- `paymentIntentId` (payment intent direto)
- Atualiza o status mesmo sem sessão de checkout

### 3. Logs Detalhados

Agora você pode ver nos logs do Railway:
- `PAYMENT_INTENT_SUCCEEDED` - Evento recebido
- `SEARCHING_CHECKOUT_SESSIONS` - Buscando sessões
- `FOUND_CHECKOUT_SESSION` - Sessão encontrada
- `PAYMENT_INTENT_NO_USER_ID` - Não encontrou userId (problema)

## 🚀 Próximos Passos

### 1. Fazer Deploy

```bash
cd "/home/ramon/Secretária/CALCARQ"
git add server/index.js src/lib/api.ts
git commit -m "fix: melhorar processamento de payment_intent.succeeded"
git push
```

### 2. Verificar Logs no Railway

Após o deploy, faça um novo pagamento de teste e verifique os logs:

1. Railway → **Deployments** → **Logs**
2. Procure por:
   - `PAYMENT_INTENT_SUCCEEDED`
   - `SEARCHING_CHECKOUT_SESSIONS`
   - `FOUND_CHECKOUT_SESSION` ou `PAYMENT_INTENT_NO_USER_ID`

### 3. Se Ainda Não Funcionar

Se os logs mostrarem `PAYMENT_INTENT_NO_USER_ID`, significa que o Payment Link não está passando o `client_reference_id`. 

**Solução definitiva**: Criar sessão de checkout via API em vez de usar Payment Link direto.

## 💡 Solução Definitiva (Recomendada)

Em vez de usar:
```javascript
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_...";
```

Criar sessão via API:
```javascript
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

