# 🐛 Debug do Webhook - Vercel

## Problema: Pagamento aceito mas calculadora não libera

Isso significa que o webhook não está processando corretamente.

---

## ✅ Verificações

### 1. Verificar se o webhook está recebendo eventos

**No Stripe Dashboard:**
1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique no seu webhook
3. Vá em **"Events"**
4. Veja se há eventos sendo enviados
5. Clique em um evento e veja a resposta:
   - ✅ **200** = Webhook recebeu e processou
   - ❌ **400/500** = Erro no processamento

### 2. Verificar logs na Vercel

1. No dashboard da Vercel, vá em **Deployments**
2. Clique no seu último deploy
3. Vá em **Functions** → **api/webhook/stripe**
4. Clique em **"Logs"**
5. Veja se há erros

**Procure por:**
- `WEBHOOK_ERROR`
- `Erro no webhook:`
- `No signatures found`

### 3. Verificar variáveis de ambiente

Na Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Verifique:
   - ✅ `STRIPE_SECRET_KEY` está configurado?
   - ✅ `STRIPE_WEBHOOK_SECRET` está configurado?
   - ✅ Os valores estão corretos?

### 4. Testar webhook manualmente

Use o Stripe CLI para testar:

```bash
stripe listen --forward-to https://seu-projeto.vercel.app/api/webhook/stripe
```

Depois, em outro terminal:
```bash
stripe trigger checkout.session.completed
```

Veja se o webhook processa.

---

## 🔧 Correções Aplicadas

Atualizei o código do webhook para:
1. ✅ Ler o body corretamente na Vercel
2. ✅ Converter para Buffer adequadamente
3. ✅ Adicionar logs de debug
4. ✅ Melhorar tratamento de erros

---

## 📝 Próximos Passos

1. **Faça commit e push das mudanças:**
```bash
git add .
git commit -m "Corrigir webhook para Vercel"
git push
```

2. **Aguarde novo deploy automático na Vercel**

3. **Teste novamente:**
   - Faça um pagamento de teste
   - Verifique os logs na Vercel
   - Veja se o webhook processa

4. **Se ainda não funcionar:**
   - Verifique os logs na Vercel
   - Verifique os eventos no Stripe Dashboard
   - Me envie os erros que aparecem

---

## 🆘 Se ainda não funcionar

Envie-me:
1. Screenshot dos logs da Vercel (Functions → Logs)
2. Screenshot do evento no Stripe Dashboard
3. Qual erro aparece (se houver)







