# 🔍 Como Verificar Logs do Railway

## 📋 Passo a Passo

### 1. Acessar Logs

1. Acesse: **https://railway.app**
2. Faça login
3. Clique no seu projeto **CALCARQ**
4. Vá em **"Deployments"** (ou **"Logs"**)
5. Clique no deploy mais recente
6. Você verá os logs em tempo real

### 2. O que Procurar

#### ✅ Logs de Sucesso

Quando o webhook funciona corretamente, você verá:

```
PAYMENT_INTENT_SUCCEEDED: { paymentIntentId: 'pi_...', ... }
SEARCHING_CHECKOUT_SESSIONS: { sessionsFound: X }
FOUND_CHECKOUT_SESSION: { userId: '...', sessionId: '...' }
PAYMENT_PROCESSED_FROM_INTENT: { userId: '...', hasPaid: true }
```

ou

```
CHECKOUT_SESSION_COMPLETED: { userId: '...', ... }
PAYMENT_PROCESSED_SUCCESS: { userId: '...', hasPaid: true }
```

#### ❌ Logs de Problema

Se o webhook não encontrar o userId:

```
PAYMENT_INTENT_SUCCEEDED: { paymentIntentId: 'pi_...', ... }
SEARCHING_CHECKOUT_SESSIONS: { sessionsFound: 0 }
PAYMENT_INTENT_NO_USER_ID: { 
  paymentIntentId: 'pi_...',
  metadata: {},
  customer: null,
  warning: 'Pagamento processado mas não foi possível identificar o usuário'
}
```

### 3. Interpretar os Logs

#### Se ver `PAYMENT_INTENT_NO_USER_ID`:

**Problema**: O webhook recebeu o evento, mas não conseguiu identificar qual usuário fez o pagamento.

**Causas possíveis**:
1. Payment Link direto não passa `client_reference_id` para `payment_intent`
2. Não há sessão de checkout relacionada
3. `STRIPE_PRICE_ID` não está configurado (então usa link direto)

**Solução**:
1. Configure `STRIPE_PRICE_ID` no Railway
2. O frontend vai usar API em vez de link direto
3. Isso garante que `client_reference_id` esteja presente

#### Se ver `FOUND_CHECKOUT_SESSION` mas não `PAYMENT_PROCESSED`:

**Problema**: Encontrou a sessão mas não atualizou o usuário.

**Causa**: Erro ao atualizar o banco de dados.

**Solução**: Verifique se há erros de escrita no diretório `/tmp` (Railway).

### 4. Filtrar Logs

No Railway, você pode:
- **Buscar** por palavras-chave: `PAYMENT`, `WEBHOOK`, `ERROR`
- **Filtrar** por nível: Info, Warning, Error
- **Ver logs em tempo real** (atualização automática)

### 5. Logs Importantes

Procure por estas mensagens:

| Log | Significado |
|-----|-------------|
| `PAYMENT_INTENT_SUCCEEDED` | Webhook recebeu o evento ✅ |
| `SEARCHING_CHECKOUT_SESSIONS` | Buscando sessões relacionadas 🔍 |
| `FOUND_CHECKOUT_SESSION` | Encontrou sessão com userId ✅ |
| `PAYMENT_PROCESSED_FROM_INTENT` | Pagamento processado com sucesso ✅ |
| `PAYMENT_INTENT_NO_USER_ID` | Não encontrou userId ❌ |
| `ERROR_FINDING_SESSION` | Erro ao buscar sessão ❌ |
| `WEBHOOK_ERROR` | Erro no webhook ❌ |

## 🐛 Debug

### Se o pagamento não está sendo processado:

1. **Verifique os logs do Railway** (veja acima)
2. **Verifique o console do navegador** (F12):
   - Procure por logs de polling
   - Veja se há erros de API
3. **Verifique as variáveis de ambiente**:
   - `STRIPE_SECRET_KEY` está configurado?
   - `STRIPE_WEBHOOK_SECRET` está configurado?
   - `STRIPE_PRICE_ID` está configurado? (recomendado)

### Teste Manual

Você pode testar manualmente acessando:

```
https://calcarq-production-e4d3.up.railway.app/api/logs
```

Isso mostra os últimos logs de pagamento.

---

**Última atualização**: Dezembro 2025







