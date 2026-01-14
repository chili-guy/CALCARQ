# 🔧 Corrigir Erro 500 no Webhook

## ❌ Problema

O webhook está retornando **500 Internal Server Error**.

Isso significa que há um erro no código ao processar o webhook.

---

## ✅ Correções Aplicadas

Reescrevi o webhook com:

1. ✅ **Melhor tratamento de erros** - Try/catch em todas as operações
2. ✅ **Logs mais detalhados** - Para identificar exatamente onde está falhando
3. ✅ **Tratamento seguro de arquivos** - Verifica permissões antes de salvar
4. ✅ **Validação do body** - Garante que o body seja processado corretamente

---

## 📝 Próximos Passos

### 1. Fazer Commit e Push

```bash
cd "/home/ramon/Secretária/CALCARQ"
git add .
git commit -m "Corrigir erro 500 no webhook - melhor tratamento de erros"
git push
```

### 2. Aguardar Novo Deploy

A Vercel fará deploy automático. Aguarde 2-3 minutos.

### 3. Verificar Logs

Após o novo deploy, faça um pagamento de teste e verifique os logs:

**Na Vercel:**
1. Dashboard → Deployments → Último deploy
2. Functions → `api/webhook/stripe` → **Logs**
3. Veja qual erro aparece (se ainda houver)

**Procure por:**
- `WEBHOOK_ERROR` - Erro na verificação
- `WEBHOOK_PROCESSING_ERROR` - Erro ao processar evento
- `WEBHOOK_FATAL_ERROR` - Erro geral
- `CHECKOUT_SESSION_COMPLETED` - Evento recebido com sucesso
- `PAYMENT_PROCESSED_SUCCESS` - Pagamento processado

---

## 🔍 Possíveis Causas do Erro 500

### 1. Problema ao salvar arquivos
- **Sintoma:** Erro ao escrever em `/tmp`
- **Solução:** Já corrigido com try/catch

### 2. Body não está sendo lido corretamente
- **Sintoma:** Erro ao verificar assinatura
- **Solução:** Melhorado tratamento do body

### 3. Variáveis de ambiente não configuradas
- **Sintoma:** `STRIPE_SECRET_KEY` ou `STRIPE_WEBHOOK_SECRET` undefined
- **Solução:** Verifique na Vercel se estão configuradas

### 4. Evento não tem `client_reference_id`
- **Sintoma:** `payment_intent.succeeded` não atualiza pagamento
- **Explicação:** Só `checkout.session.completed` tem `client_reference_id`
- **Solução:** Já tratado no código

---

## 🧪 Como Testar

### 1. Fazer Pagamento de Teste

1. Acesse sua aplicação
2. Faça um pagamento de teste
3. Use cartão: `4242 4242 4242 4242`

### 2. Verificar Logs

**Na Vercel:**
- Veja os logs em tempo real
- Procure por erros ou sucessos

**No Stripe Dashboard:**
- Webhooks → Seu webhook → Events
- Veja se retorna **200** (sucesso) ou **500** (erro)

### 3. Verificar se Funcionou

Se você ver nos logs:
```
[timestamp] CHECKOUT_SESSION_COMPLETED: ...
[timestamp] PAYMENT_PROCESSED_SUCCESS: ...
```

E no Stripe Dashboard retornar **200**, está funcionando! ✅

---

## 🆘 Se Ainda Não Funcionar

Envie-me:

1. **Screenshot dos logs da Vercel:**
   - Functions → `api/webhook/stripe` → Logs
   - Copie as últimas linhas de erro

2. **Screenshot do evento no Stripe:**
   - Webhooks → Seu webhook → Events
   - Clique no evento que deu erro
   - Veja a resposta completa

3. **Qual erro específico aparece:**
   - Copie a mensagem de erro completa

---

## 📋 Checklist

- [ ] Código atualizado (commit e push feito)
- [ ] Novo deploy na Vercel concluído
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] URL do webhook no Stripe está correta: `https://calcarq-web.vercel.app/api/webhook/stripe`
- [ ] Fazer pagamento de teste
- [ ] Verificar logs na Vercel
- [ ] Verificar resposta no Stripe Dashboard

---

## ✅ Resumo

O código foi reescrito com:
- ✅ Melhor tratamento de erros
- ✅ Logs detalhados
- ✅ Validações mais robustas
- ✅ Tratamento seguro de arquivos

**Faça commit, push e teste novamente!**









