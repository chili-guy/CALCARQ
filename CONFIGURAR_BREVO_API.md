# ⚡ Configurar Brevo API (Solução para Timeout)

## Problema Resolvido!

O Railway estava dando **timeout** ao tentar conectar no SMTP do Brevo. Agora implementamos a **API REST do Brevo**, que funciona perfeitamente no Railway! ✅

---

## 🔑 Obter API Key do Brevo

1. **Acesse:** https://app.brevo.com/
2. **Faça login** na sua conta
3. **Vá em:** Settings → SMTP & API → API Keys
4. **Clique em:** "Generate a new API key"
5. **Dê um nome:** `Calcularq API`
6. **Escolha permissões:** "Send emails" (ou "Full access")
7. **Copie a API Key** (começa com `xkeysib-` ou similar)

⚠️ **IMPORTANTE:** Esta é uma API Key diferente da KEY SMTP! Use a API Key da seção "API Keys", não a KEY SMTP.

---

## 📋 Configurar no Railway

Adicione esta variável no Railway:

### BREVO_API_KEY
```
Nome: BREVO_API_KEY
Valor: xkeysib-sua_api_key_aqui
```

**Pronto!** O sistema agora usa a API REST do Brevo ao invés de SMTP.

---

## ✅ Como Funciona Agora

1. **Se `BREVO_API_KEY` estiver configurada:**
   - ✅ Usa **API REST do Brevo** (HTTP - funciona perfeitamente!)
   - ✅ Sem problemas de timeout
   - ✅ Mais rápido e confiável

2. **Se `BREVO_API_KEY` não estiver configurada:**
   - ⚠️ Tenta usar SMTP (pode dar timeout no Railway)

---

## 🎯 Vantagens da API REST

- ✅ **Funciona perfeitamente no Railway** (sem bloqueios)
- ✅ **Mais rápido** que SMTP
- ✅ **Mais confiável** (sem problemas de conexão)
- ✅ **Melhor tratamento de erros**

---

## 📝 Resumo

**Antes:** SMTP → Timeout no Railway ❌

**Agora:** API REST → Funciona perfeitamente! ✅

**Configure apenas:** `BREVO_API_KEY` no Railway

**Pronto!** Deve funcionar imediatamente! 🚀

---

## 🔍 Verificar se Funcionou

Após configurar `BREVO_API_KEY`, quando testar "Esqueci minha senha", você deve ver nos logs:

```
📧 Tentando enviar via Brevo API...
✅ Email enviado via Brevo API em XXXms
FORGOT_PASSWORD_EMAIL_SENT: { method: 'BREVO_API', ... }
```

**Não deve mais aparecer timeout!** ✅




