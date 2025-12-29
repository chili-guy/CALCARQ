# 🔧 Corrigir Erro 405 no Webhook

## ❌ Problema Identificado

O webhook está retornando **405 ERR** porque:

1. **URL incorreta no Stripe**: O webhook está configurado para:
   ```
   https://calcarq-web.vercel.app/
   ```
   
   Mas deveria ser:
   ```
   https://calcarq-web.vercel.app/api/webhook/stripe
   ```

---

## ✅ SOLUÇÃO: Corrigir URL do Webhook no Stripe

### Passo 1: Acessar Webhooks no Stripe

1. Acesse: **https://dashboard.stripe.com/webhooks**
2. Certifique-se de estar no modo correto (Test ou Live)
3. Encontre o webhook que está dando erro
4. Clique nele para editar

### Passo 2: Corrigir a URL

1. Clique em **"Edit"** ou nos 3 pontinhos → **"Edit endpoint"**
2. Na seção **"Endpoint URL"**, altere de:
   ```
   https://calcarq-web.vercel.app/
   ```
   
   Para:
   ```
   https://calcarq-web.vercel.app/api/webhook/stripe
   ```

3. Clique em **"Save changes"**

### Passo 3: Testar Novamente

1. Faça um novo pagamento de teste
2. Verifique se agora retorna **200** (sucesso) em vez de **405**

---

## 🔍 Verificar se está Correto

### No Stripe Dashboard:

1. Vá em **Webhooks**
2. Clique no seu webhook
3. Verifique se a URL está:
   ```
   https://calcarq-web.vercel.app/api/webhook/stripe
   ```
   
   ✅ **Deve terminar com `/api/webhook/stripe`**

### Testar Manualmente:

Você pode testar se a rota está funcionando:

1. Abra no navegador:
   ```
   https://calcarq-web.vercel.app/api/health
   ```
   
   Deve retornar: `{"status":"ok",...}`

2. Se funcionar, a API está acessível.

---

## 📝 Checklist

- [ ] URL do webhook no Stripe termina com `/api/webhook/stripe`
- [ ] Webhook está no modo correto (Test ou Live)
- [ ] Variáveis de ambiente na Vercel estão configuradas
- [ ] Fazer um novo pagamento de teste
- [ ] Verificar se retorna 200 (sucesso)

---

## 🆘 Se ainda não funcionar

Se após corrigir a URL ainda der erro:

1. **Verifique os logs na Vercel:**
   - Dashboard → Deployments → Último deploy
   - Functions → `api/webhook/stripe` → Logs
   - Veja qual erro aparece

2. **Verifique o evento no Stripe:**
   - Webhooks → Seu webhook → Events
   - Clique no evento
   - Veja a resposta completa

3. **Me envie:**
   - Screenshot da URL do webhook no Stripe
   - Screenshot dos logs da Vercel
   - Qual erro aparece agora

---

## ✅ Resumo

**O problema é simples:** A URL do webhook no Stripe está errada.

**A solução:** Adicione `/api/webhook/stripe` no final da URL.

**URL correta:**
```
https://calcarq-web.vercel.app/api/webhook/stripe
```






