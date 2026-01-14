# 🐛 Debug - Vercel vs Local

## ❌ Problema: Funciona localmente mas não na Vercel

Isso é comum! A diferença é:

- **Local**: Usa Express com middleware `express.raw()`
- **Vercel**: Usa serverless functions (sem Express)

---

## 🔍 Diferenças Principais

### 1. Como o Body é Recebido

**Local (Express):**
- Middleware `express.raw()` converte body para Buffer
- `req.body` já é Buffer

**Vercel (Serverless):**
- Body pode vir como string, objeto ou Buffer
- Precisa ler manualmente

### 2. Código Diferente

**Local:** Usa `server/index.js` (Express)
**Vercel:** Usa `api/webhook/stripe.js` (Serverless)

São arquivos diferentes!

---

## ✅ Solução Aplicada

Criei uma versão do webhook que:
1. ✅ Tenta ler o body de TODAS as formas possíveis
2. ✅ Funciona tanto se o body for string, Buffer ou objeto
3. ✅ Logs detalhados para identificar o problema
4. ✅ Sempre retorna 200 (para não ficar retentando)

---

## 📝 Próximos Passos

### 1. Fazer Commit e Push

```bash
cd "/home/ramon/Secretária/CALCARQ"
git add .
git commit -m "Corrigir webhook para Vercel - ler body de todas as formas"
git push
```

### 2. Aguardar Deploy (2-3 minutos)

### 3. Ver Logs na Vercel

1. Dashboard → Deployments → Último deploy
2. Functions → `api/webhook/stripe` → **Logs**
3. Veja o que aparece

**Procure por:**
- `🔔 === WEBHOOK VERCEL ===`
- `✅ Body é string` ou `✅ Body é Buffer` ou `⚠️ Body foi parseado`
- `✅ Assinatura verificada!`
- `✅ ✅ ✅ SUCESSO!`

### 4. Me Enviar os Logs

Copie TODAS as linhas dos logs e me envie, especialmente:
- Linhas que começam com emojis
- Qualquer linha de erro
- As primeiras linhas (mostram como o body chegou)

---

## 🔍 O Que Verificar

### 1. Variáveis de Ambiente na Vercel

Verifique se estão configuradas:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`
- `NODE_ENV` = `production`

### 2. URL do Webhook no Stripe

Deve ser:
```
https://calcarq-web.vercel.app/api/webhook/stripe
```

**NÃO:**
```
https://calcarq-web.vercel.app/
```

### 3. Logs Mostram o Problema

Os logs vão mostrar:
- Como o body chegou
- Se a verificação funcionou
- Onde está falhando

---

## 🆘 Se Ainda Não Funcionar

Envie-me:

1. **Screenshot completo dos logs da Vercel:**
   - Functions → `api/webhook/stripe` → Logs
   - Últimas 50-100 linhas

2. **Screenshot do evento no Stripe:**
   - Webhooks → Seu webhook → Events
   - Clique no evento que deu erro
   - Veja a resposta

3. **Variáveis de ambiente configuradas:**
   - Confirme quais estão configuradas na Vercel

---

## 💡 Dica

O código agora tenta ler o body de 5 formas diferentes. Os logs vão mostrar qual funcionou (ou se nenhuma funcionou).

**Faça commit, push e me envie os logs!** 🔍









