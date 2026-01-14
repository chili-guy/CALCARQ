# 🔑 Qual API Key Escolher no SendGrid?

Ao criar uma API Key no SendGrid, você pode escolher entre diferentes tipos. Vamos ver qual usar!

---

## 📋 Opções de API Key no SendGrid

### 1. **REST API Key** (API Web)
- **Uso:** Para usar a API REST do SendGrid diretamente
- **Como funciona:** Você faz chamadas HTTP para a API do SendGrid
- **Para nosso caso:** ❌ Não é o que precisamos

### 2. **SMTP API Key** (SMTP)
- **Uso:** Para usar servidor SMTP (como estamos fazendo)
- **Como funciona:** Você usa a API Key como senha no servidor SMTP
- **Para nosso caso:** ✅ **Esta é a opção correta!**

---

## ✅ Qual Escolher?

**Escolha "SMTP"** ou **"Full Access"** (que inclui SMTP).

### Opção Recomendada: **Full Access**

1. **Ao criar a API Key, escolha:**
   - **"Full Access"** (recomendado) - tem todas as permissões
   - Ou **"Mail Send"** - apenas permissão de enviar emails

2. **Nome da Key:** `Calcularq SMTP` (ou qualquer nome)

3. **Copie a API Key** (você só verá uma vez!)

---

## 🔧 Como Usar no Railway

Depois de criar a API Key (seja Full Access ou Mail Send), configure assim:

```
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = apikey
SMTP_PASS = SG.sua_api_key_aqui
SMTP_FROM = atendimento@calcularq.com.br
```

**⚠️ IMPORTANTE:**
- `SMTP_USER` sempre deve ser `apikey` (não importa qual tipo de API Key você criou)
- `SMTP_PASS` é a API Key que você copiou
- Funciona com qualquer tipo de API Key do SendGrid (Full Access, Mail Send, etc.)

---

## 💡 Explicação Técnica

**Não importa qual opção você escolher!** 

Todas as API Keys do SendGrid podem ser usadas para SMTP. A diferença é apenas nas permissões:

- **Full Access:** Pode fazer tudo (enviar, ver estatísticas, etc.)
- **Mail Send:** Apenas pode enviar emails (mais seguro)
- **REST API:** Mesma coisa, mas o nome sugere uso via API REST

**Para nosso caso (SMTP com nodemailer), qualquer uma funciona!**

---

## 🎯 Passo a Passo Recomendado

1. **No SendGrid, ao criar API Key:**
   - Escolha **"Full Access"** ou **"Mail Send"**
   - Dê um nome: `Calcularq SMTP`
   - Clique em **"Create & View"**
   - **Copie a API Key** (começa com `SG.`)

2. **No Railway:**
   - Configure as variáveis conforme acima
   - Use `apikey` como `SMTP_USER`
   - Use sua API Key como `SMTP_PASS`

3. **Pronto!** Deve funcionar imediatamente.

---

## ❓ FAQ

**P: Preciso escolher "SMTP" especificamente?**  
R: Não! Qualquer API Key funciona. Escolha "Full Access" ou "Mail Send".

**P: Qual é mais seguro?**  
R: "Mail Send" é mais seguro (apenas pode enviar), mas "Full Access" também funciona perfeitamente.

**P: Posso usar a mesma API Key para outras coisas?**  
R: Sim! Se escolher "Full Access", pode usar para API REST também.

**P: A API Key que já criei funciona?**  
R: Sim! A API Key "TESTE" que você criou funciona perfeitamente para SMTP.

---

## ✅ Resumo

1. **Qualquer API Key do SendGrid funciona** para SMTP
2. **Recomendado:** "Full Access" ou "Mail Send"
3. **No Railway:** Use `apikey` como `SMTP_USER` e sua API Key como `SMTP_PASS`
4. **A API Key "TESTE" que você criou já funciona!** ✅

**Não precisa criar uma nova!** Use a que você já tem e configure no Railway! 🚀





