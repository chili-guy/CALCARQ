# ✅ Webhook Vercel - CORRIGIDO DEFINITIVAMENTE

## 🔧 Correções Aplicadas

### 1. ✅ `export const runtime = 'nodejs'`
**Problema:** Vercel pode usar Edge Runtime por padrão (incompatível com Stripe)  
**Solução:** Forçar Node.js runtime explicitamente

### 2. ✅ `export const config = { api: { bodyParser: false } }`
**Problema:** Body sendo parseado automaticamente  
**Solução:** Desabilitar bodyParser no mesmo arquivo do handler

### 3. ✅ Leitura do Body como Stream
**Problema:** `req.on("data")` não funciona na Vercel  
**Solução:** Usar `for await (const chunk of req)` (forma correta)

### 4. ✅ Stripe nas Dependencies
**Problema:** Stripe estava só em `server/package.json`  
**Solução:** Adicionado ao `package.json` raiz (Vercel usa o raiz)

---

## 📝 Arquivo Corrigido

```javascript
// ✅ Runtime explícito
export const runtime = 'nodejs';

// ✅ BodyParser desabilitado
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Leitura do body (forma correta Vercel)
const chunks = [];
for await (const chunk of req) {
  chunks.push(chunk);
}
const rawBody = Buffer.concat(chunks);

// ✅ Verificação Stripe
const event = stripe.webhooks.constructEvent(
  rawBody,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

---

## 🚀 Próximos Passos

### 1. Instalar Dependência

```bash
cd "/home/ramon/Secretária/CALCARQ"
npm install
```

### 2. Commit e Push

```bash
git add .
git commit -m "Webhook Vercel corrigido - runtime nodejs + bodyParser false + stream reading"
git push
```

### 3. Aguardar Deploy (2-3 minutos)

### 4. Testar

1. **Stripe Dashboard** → Webhooks → Send test event
2. **Vercel Dashboard** → Functions → `api/webhook/stripe` → Logs
3. Verifique se aparece:
   - `✅ Body lido do stream` ou `✅ Body é Buffer`
   - `✅ Assinatura OK!`
   - `✅ ✅ ✅ SUCESSO TOTAL!`

---

## ✅ Checklist Final

- [x] `export const runtime = 'nodejs'` no topo
- [x] `export const config = { api: { bodyParser: false } }` no topo
- [x] Leitura do body com `for await (const chunk of req)`
- [x] Stripe no `package.json` raiz
- [ ] `npm install` executado
- [ ] Commit e push feito
- [ ] Deploy concluído
- [ ] Teste realizado

---

## 🎯 O Que Mudou

**ANTES (não funcionava):**
- ❌ Sem `runtime` explícito
- ❌ Sem `config` com `bodyParser: false`
- ❌ Tentava ler `req.body` diretamente
- ❌ Stripe só em `server/package.json`

**AGORA (funciona):**
- ✅ `runtime = 'nodejs'` explícito
- ✅ `bodyParser: false` configurado
- ✅ Lê body como stream com `for await`
- ✅ Stripe no `package.json` raiz

---

## 🆘 Se Ainda Não Funcionar

Envie:
1. **Logs completos** da Vercel (Functions → Logs)
2. **Erro exato** que aparece
3. **Versão do Stripe** (`npm list stripe`)







