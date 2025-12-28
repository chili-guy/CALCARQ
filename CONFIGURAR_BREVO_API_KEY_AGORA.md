# ⚡ Configurar Brevo API Key no Railway

## Sua API Key do Brevo

Você já tem a API Key! Agora vamos configurar no Railway.

⚠️ **IMPORTANTE:** Use a API Key completa que você copiou do Brevo.

---

## 📋 Configurar no Railway

### 1. Acesse o Railway

1. Vá em: https://railway.app/
2. Entre no seu projeto **Calcularq**
3. Clique na aba **"Variables"** ou **"Environment"**

### 2. Adicione a Variável

**BREVO_API_KEY**
```
Nome: BREVO_API_KEY
Valor: xkeysib-sua_api_key_completa_aqui
```
Cole sua API Key completa do Brevo (começa com `xkeysib-`)

⚠️ **IMPORTANTE:** 
- Sem espaços extras
- Valor completo (começa com `xkeysib-`)
- Salve após adicionar

### 3. Aguarde o Deploy

O Railway reiniciará automaticamente após adicionar a variável (~30 segundos).

---

## ✅ Verificar se Funcionou

Após configurar, quando testar "Esqueci minha senha", você deve ver nos logs:

```
📧 Configurando Brevo API...
📧 Enviando email via Brevo API... { to: '...', from: '...', subject: '...' }
✅ Email enviado via Brevo API: { messageId: '...' }
FORGOT_PASSWORD_EMAIL_SENT: { method: 'BREVO_API', ... }
```

**Não deve mais aparecer timeout!** ✅

---

## 🎯 O que Mudou

**Antes:**
- ❌ SMTP → Timeout no Railway
- ❌ `ETIMEDOUT` errors

**Agora:**
- ✅ API REST → Funciona perfeitamente!
- ✅ Sem problemas de conexão
- ✅ Mais rápido e confiável

---

## 📝 Resumo

1. **Adicione no Railway:** `BREVO_API_KEY = xkeysib-sua_api_key_completa_aqui`
2. **Aguarde o deploy** reiniciar
3. **Teste "Esqueci minha senha"**
4. **Verifique os logs** - deve funcionar!

**Pronto!** Deve funcionar imediatamente! 🚀

---

## 🔒 Segurança

⚠️ **ATENÇÃO:** Você compartilhou sua API Key aqui. Por segurança:

1. **Após configurar no Railway, considere:**
   - Gerar uma nova API Key no Brevo
   - Deletar a antiga
   - Usar a nova no Railway

2. **Para gerar nova key:**
   - Acesse: Brevo → Settings → SMTP & API → API Keys
   - Delete a key antiga
   - Crie uma nova
   - Atualize no Railway

3. **Nunca commite credenciais no Git!**

