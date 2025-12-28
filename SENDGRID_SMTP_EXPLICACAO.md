# 📧 SendGrid SMTP - Como Funciona

## Você está usando SMTP (correto!)

Você está certo - estamos usando **SMTP** (não API REST). Mas para autenticar no servidor SMTP do SendGrid, você ainda precisa de uma **API Key**.

---

## 🔑 Por que Precisa de API Key para SMTP?

O SendGrid usa API Keys para autenticação, mesmo via SMTP:

- **Servidor SMTP:** `smtp.sendgrid.net`
- **Usuário SMTP:** `apikey` (sempre esta palavra)
- **Senha SMTP:** Sua API Key do SendGrid (começa com `SG.`)

**É assim que o SendGrid funciona!** Eles usam API Keys mesmo para SMTP.

---

## ✅ Configuração Correta para SMTP

No Railway, configure assim:

```
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = apikey          ← Sempre "apikey"
SMTP_PASS = SG.sua_api_key  ← Sua API Key do SendGrid
SMTP_FROM = atendimento@calcularq.com.br
```

**Como funciona:**
1. Seu código se conecta ao servidor SMTP (`smtp.sendgrid.net`)
2. Autentica usando `apikey` como usuário
3. E sua API Key como senha
4. SendGrid valida a API Key e permite enviar emails

---

## 🎯 Qual API Key Escolher?

Para usar via SMTP, você pode escolher qualquer tipo:

- ✅ **Full Access** - Funciona
- ✅ **Mail Send** - Funciona (mais seguro)
- ✅ **REST API** - Também funciona para SMTP

**Todos funcionam!** A diferença é apenas nas permissões, mas todos podem ser usados para SMTP.

---

## 📝 Resumo

**Você está usando SMTP** ✅ (correto!)

**Mas precisa de API Key** porque:
- SendGrid usa API Keys para autenticação
- Mesmo via SMTP, você autentica com API Key
- `SMTP_USER` = `apikey`
- `SMTP_PASS` = sua API Key do SendGrid

**A API Key "TESTE" que você criou funciona perfeitamente para SMTP!** ✅

---

## 🚀 Próximo Passo

1. **Use a API Key que você já criou** ("TESTE")
2. **Configure no Railway:**
   - `SMTP_USER` = `apikey`
   - `SMTP_PASS` = sua API Key
3. **Pronto!** Funciona via SMTP! 📧

**Não precisa criar uma nova API Key!** A que você tem já funciona! 🎉

