# ⚡ Configuração SendGrid - Passo a Passo

## Suas Credenciais SendGrid

Você já tem tudo que precisa! Aqui está como configurar:

---

## 📋 Variáveis para Configurar no Railway

Acesse seu projeto no Railway e adicione estas variáveis de ambiente:

### 1. SMTP_HOST
```
Nome: SMTP_HOST
Valor: smtp.sendgrid.net
```

### 2. SMTP_PORT
```
Nome: SMTP_PORT
Valor: 587
```

### 3. SMTP_SECURE
```
Nome: SMTP_SECURE
Valor: false
```

### 4. SMTP_USER
```
Nome: SMTP_USER
Valor: apikey
```
⚠️ **IMPORTANTE:** Deve ser literalmente a palavra `apikey` (não seu email!)

### 5. SMTP_PASS
```
Nome: SMTP_PASS
Valor: SG.sua_api_key_aqui
```
⚠️ **IMPORTANTE:** Cole sua API Key completa do SendGrid aqui (mantenha segura!)

### 6. SMTP_FROM
```
Nome: SMTP_FROM
Valor: seu_email@gmail.com
```
(Use o email que você verificou no SendGrid ou seu email pessoal)

---

## 🚀 Como Adicionar no Railway

### Método 1: Via Interface Web

1. Acesse: https://railway.app/
2. Entre no seu projeto
3. Clique na aba **"Variables"** ou **"Environment"**
4. Para cada variável acima:
   - Clique em **"New Variable"** ou **"Add Variable"**
   - Cole o **Nome** e o **Valor**
   - Clique em **"Add"** ou **"Save"**
5. Repita para todas as 6 variáveis
6. O Railway reiniciará automaticamente o deploy

### Método 2: Via Railway CLI (se preferir)

```bash
railway variables set SMTP_HOST=smtp.sendgrid.net
railway variables set SMTP_PORT=587
railway variables set SMTP_SECURE=false
railway variables set SMTP_USER=apikey
railway variables set SMTP_PASS=SG.sua_api_key_aqui
railway variables set SMTP_FROM=seu_email@gmail.com
```

---

## ✅ Verificar se Funcionou

1. **Aguarde o deploy reiniciar** (Railway faz isso automaticamente)
2. **Acesse sua aplicação**
3. **Teste o "Esqueci minha senha":**
   - Vá para a página de login
   - Clique em "Esqueci minha senha"
   - Digite um email cadastrado
   - Clique em "Enviar"
4. **Verifique se o email chegou!** 📧

---

## 🔍 Verificar Logs (se não funcionar)

No Railway, vá em **"Deployments"** → clique no último deploy → **"View Logs"**

Procure por:
- ✅ `FORGOT_PASSWORD_EMAIL_SENT` = funcionou!
- ❌ `FORGOT_PASSWORD_EMAIL_ERROR` = erro no envio
- ⚠️ `SMTP não configurado` = variáveis não foram carregadas

---

## 🔒 Segurança Importante

⚠️ **ATENÇÃO:** Você compartilhou sua API Key aqui. Por segurança:

1. **Se esta key foi exposta publicamente**, considere:
   - Gerar uma nova API Key no SendGrid
   - Deletar a antiga
   - Usar a nova no Railway

2. **Para gerar nova key:**
   - Acesse: https://app.sendgrid.com/settings/api_keys
   - Delete a key antiga
   - Crie uma nova
   - Atualize no Railway

3. **Nunca commite credenciais no Git!**
   - Use sempre variáveis de ambiente
   - Não adicione no `.env` se for commitar

---

## 📝 Resumo Rápido

```
✅ SMTP_HOST = smtp.sendgrid.net
✅ SMTP_PORT = 587
✅ SMTP_SECURE = false
✅ SMTP_USER = apikey
✅ SMTP_PASS = SG.sua_api_key_aqui (cole sua API Key real aqui)
✅ SMTP_FROM = seu_email@gmail.com
```

**Pronto!** Depois de adicionar essas 6 variáveis no Railway, seu sistema de "Esqueci minha senha" estará funcionando! 🎉

---

## ❓ Problemas Comuns

**Email não chega?**
- Verifique a pasta de spam
- Confira os logs do Railway
- Verifique se o email do destinatário está correto

**Erro "Invalid login"?**
- Verifique se `SMTP_USER` é exatamente `apikey` (sem espaços)
- Verifique se `SMTP_PASS` está completo (sem quebras de linha)

**Erro "Connection timeout"?**
- Verifique se `SMTP_HOST` está correto: `smtp.sendgrid.net`
- Verifique se `SMTP_PORT` é `587`

