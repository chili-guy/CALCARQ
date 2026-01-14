# 🧪 Teste vs Produção - Stripe

## ⚠️ IMPORTANTE: Você tem uma chave de TESTE

A chave que você tem: `sk_test_51Sfqt62EyvnirY1k...` é uma **chave de TESTE**.

---

## 🧪 MODO TESTE (Recomendado começar assim)

### ✅ Vantagens:
- ✅ Funciona imediatamente (sem ativar conta)
- ✅ Perfeito para testar o deploy
- ✅ Não processa dinheiro real
- ✅ Cartões de teste funcionam

### ❌ Limitações:
- ❌ Não processa pagamentos reais
- ❌ Você não recebe dinheiro
- ❌ Apenas para desenvolvimento/teste

### 📝 Como usar:
1. Use a chave `sk_test_...` que você tem
2. Configure webhook em **Test mode** no Stripe
3. Teste com cartões de teste:
   - `4242 4242 4242 4242`
   - Qualquer data futura
   - Qualquer CVC

---

## 🚀 MODO PRODUÇÃO (Para receber pagamentos reais)

### ✅ Vantagens:
- ✅ Processa pagamentos reais
- ✅ Você recebe dinheiro de verdade
- ✅ Clientes reais podem pagar

### ⚠️ Requisitos:
- ⚠️ Precisa ativar conta Stripe
- ⚠️ Preencher informações fiscais
- ⚠️ Verificar identidade
- ⚠️ Configurar conta bancária

### 📝 Como obter chave LIVE:
1. Acesse: **https://dashboard.stripe.com/apikeys**
2. **Mude para "Live mode"** (canto superior direito)
3. Clique em **"Reveal live key"**
4. Copie a chave (começa com `sk_live_`)

---

## 🎯 RECOMENDAÇÃO

### Para começar (AGORA):
1. ✅ Use a chave de TESTE que você tem
2. ✅ Configure tudo em modo TESTE
3. ✅ Teste o deploy completo
4. ✅ Valide que tudo funciona

### Depois (quando estiver pronto):
1. ✅ Ative sua conta Stripe para produção
2. ✅ Obtenha chave LIVE
3. ✅ Configure webhook em modo LIVE
4. ✅ Atualize variáveis na Vercel
5. ✅ Faça novo deploy

---

## 📝 Checklist

### Modo TESTE:
- [ ] Usar chave `sk_test_...`
- [ ] Webhook em **Test mode**
- [ ] Testar com cartões de teste
- [ ] Validar que tudo funciona

### Modo PRODUÇÃO:
- [ ] Conta Stripe ativada
- [ ] Informações fiscais preenchidas
- [ ] Conta bancária configurada
- [ ] Usar chave `sk_live_...`
- [ ] Webhook em **Live mode**
- [ ] Testar com valor pequeno primeiro

---

## 🔄 Como mudar de TESTE para PRODUÇÃO

1. Obtenha chave LIVE do Stripe
2. Na Vercel, edite `STRIPE_SECRET_KEY`:
   - Substitua `sk_test_...` por `sk_live_...`
3. Configure novo webhook em **Live mode**
4. Atualize `STRIPE_WEBHOOK_SECRET` na Vercel
5. Faça novo deploy

---

## ⚠️ ATENÇÃO

**NUNCA compartilhe suas chaves!**
- ❌ Não commite no Git
- ❌ Não compartilhe em chats
- ❌ Use apenas variáveis de ambiente na Vercel

---

**Resumo:** Comece com TESTE, valide tudo, depois mude para PRODUÇÃO! 🚀









