# ✅ Chaves Stripe Configuradas

## 📋 Chaves Configuradas

### Secret Key (Backend)
- ✅ Configurada em `server/.env`
- Chave: `sk_test_...` (configure no arquivo `server/.env`)
- Modo: **TESTE**

### Publishable Key (Frontend - se necessário)
- Chave: `pk_test_...` (guarde para uso futuro se necessário)
- Modo: **TESTE**
- ⚠️ **Nota:** Atualmente o frontend usa link direto do Stripe Checkout, então esta chave não é necessária no código. Guarde para uso futuro se precisar criar sessões via API.

---

## 🔧 Onde Está Configurado

### Local (Desenvolvimento)
- ✅ `server/.env` → `STRIPE_SECRET_KEY`

### Vercel (Produção)
- ⚠️ **AÇÃO NECESSÁRIA:** Configure na Vercel:
  1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
  2. Adicione/Edite `STRIPE_SECRET_KEY`:
     - Value: `sk_test_...` (sua chave secreta do Stripe)
  3. Adicione/Edite `STRIPE_WEBHOOK_SECRET`:
     - Value: (obtenha do webhook em modo TESTE no Stripe)
  4. Faça novo deploy

---

## ⚠️ IMPORTANTE: Modo TESTE

Você está usando chaves de **TESTE**. Isso significa:

### ✅ Funciona:
- Testar o sistema completo
- Usar cartões de teste
- Validar integração

### ❌ Não funciona:
- Processar pagamentos reais
- Receber dinheiro de verdade

### 🧪 Cartões de Teste:
- Número: `4242 4242 4242 4242`
- Data: Qualquer data futura
- CVC: Qualquer 3 dígitos
- CEP: Qualquer CEP válido

---

## 🔔 Próximo Passo: Configurar Webhook

### Para Desenvolvimento Local:
```bash
stripe listen --forward-to localhost:3001/api/webhook/stripe
```
Copie o `whsec_...` que aparecer e atualize `STRIPE_WEBHOOK_SECRET` no `server/.env`

### Para Vercel (Produção):
1. Acesse: https://dashboard.stripe.com/webhooks
2. **Certifique-se de estar em "Test mode"** (canto superior direito)
3. Clique em **"Add endpoint"**
4. URL: `https://calcarq-web.vercel.app/api/webhook/stripe`
5. Eventos: `checkout.session.completed`, `payment_intent.succeeded`
6. Copie o **"Signing secret"** (começa com `whsec_`)
7. Cole na Vercel em `STRIPE_WEBHOOK_SECRET`

---

## ✅ Checklist

### Local:
- [x] `STRIPE_SECRET_KEY` configurado em `server/.env`
- [ ] `STRIPE_WEBHOOK_SECRET` configurado (use Stripe CLI)
- [ ] Backend rodando e testado

### Vercel:
- [ ] `STRIPE_SECRET_KEY` configurado na Vercel
- [ ] `STRIPE_WEBHOOK_SECRET` configurado na Vercel
- [ ] Webhook criado no Stripe em **"Test mode"**
- [ ] Deploy feito após configurar variáveis

---

## 🔒 Segurança

⚠️ **NUNCA:**
- ❌ Commite essas chaves no Git
- ❌ Compartilhe em chats públicos
- ❌ Exponha em código frontend

✅ **SEMPRE:**
- ✅ Use variáveis de ambiente
- ✅ Mantenha `.env` no `.gitignore`
- ✅ Use chaves diferentes para teste e produção

---

**Configuração local concluída!** 🎉

Próximo passo: Configure na Vercel e teste o webhook.
