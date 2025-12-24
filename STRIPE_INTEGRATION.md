# Integração Stripe - Calcularq

## Status Atual

A integração atual usa o link de checkout do Stripe (`https://buy.stripe.com/test_28E9AM9Ke6nGaYRdCS73G01`) e funciona de forma semi-automática.

## Como Funciona

1. Usuário clica em "Realizar Pagamento"
2. Abre uma nova janela com o checkout do Stripe
3. Após o pagamento, o usuário confirma manualmente
4. O sistema atualiza o status de pagamento do usuário

## Melhorias para Produção

### 1. Webhook do Stripe

Para uma integração completa, você precisará:

1. **Criar um endpoint de webhook** no seu backend que recebe eventos do Stripe
2. **Configurar o webhook** no dashboard do Stripe apontando para seu endpoint
3. **Processar o evento `checkout.session.completed`** para atualizar o status de pagamento

Exemplo de webhook handler (Node.js/Express):

```javascript
app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    
    // Atualizar status de pagamento do usuário no banco de dados
    updateUserPaymentStatus(userId, true);
  }

  res.json({received: true});
});
```

### 2. Atualizar Payment.tsx

Substitua a confirmação manual por uma verificação automática:

```typescript
// Após o checkout fechar, fazer uma requisição ao backend
const verifyPayment = async () => {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id })
  });
  
  const { hasPaid } = await response.json();
  if (hasPaid) {
    handlePaymentSuccess();
  }
};
```

### 3. Configurar client_reference_id

O link do Stripe já está configurado para passar o `client_reference_id` com o ID do usuário. Certifique-se de que seu webhook processa esse campo corretamente.

## Teste

Para testar em modo de desenvolvimento:

1. Use cartões de teste do Stripe: `4242 4242 4242 4242`
2. Qualquer data futura para expiração
3. Qualquer CVC de 3 dígitos
4. Qualquer CEP

## Notas Importantes

- Em produção, sempre valide os webhooks usando a assinatura do Stripe
- Nunca confie apenas no `client_reference_id` - sempre verifique no dashboard do Stripe
- Considere implementar retry logic para casos de falha na comunicação
- Mantenha logs de todos os eventos de pagamento para auditoria
