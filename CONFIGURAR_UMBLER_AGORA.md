# ⚡ Configuração Umbler - Passo a Passo

## Suas Credenciais Umbler

Você já tem tudo configurado! Aqui está como adicionar no Railway:

---

## 📋 Variáveis para Configurar no Railway

Acesse seu projeto no Railway e adicione estas variáveis de ambiente:

### 1. SMTP_HOST
```
Nome: SMTP_HOST
Valor: smtp.umbler.com
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
Valor: atendimento@calcularq.com.br
```

### 5. SMTP_PASS
```
Nome: SMTP_PASS
Valor: Milnara.2001
```
⚠️ **IMPORTANTE:** Mantenha esta senha segura!

### 6. SMTP_FROM
```
Nome: SMTP_FROM
Valor: atendimento@calcularq.com.br
```

---

## 🚀 Como Adicionar no Railway

### Método 1: Via Interface Web

1. Acesse: https://railway.app/
2. Entre no seu projeto Calcularq
3. Clique na aba **"Variables"** ou **"Environment"**
4. Para cada variável acima:
   - Clique em **"New Variable"** ou **"Add Variable"**
   - Cole o **Nome** e o **Valor**
   - Clique em **"Add"** ou **"Save"**
5. Repita para todas as 6 variáveis
6. O Railway reiniciará automaticamente o deploy

### Método 2: Via Railway CLI (se preferir)

```bash
railway variables set SMTP_HOST=smtp.umbler.com
railway variables set SMTP_PORT=587
railway variables set SMTP_SECURE=false
railway variables set SMTP_USER=atendimento@calcularq.com.br
railway variables set SMTP_PASS=Milnara.2001
railway variables set SMTP_FROM=atendimento@calcularq.com.br
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

⚠️ **ATENÇÃO:** Você compartilhou sua senha aqui. Por segurança:

1. **Após configurar no Railway, considere:**
   - Mudar a senha do email na Umbler
   - Usar uma senha mais forte
   - Não compartilhar credenciais publicamente

2. **Nunca commite credenciais no Git!**
   - Use sempre variáveis de ambiente
   - Não adicione no `.env` se for commitar

3. **Proteja suas credenciais:**
   - Não compartilhe em chats públicos
   - Não coloque em documentos públicos
   - Use apenas variáveis de ambiente seguras

---

## 📝 Resumo Rápido

```
✅ SMTP_HOST = smtp.umbler.com
✅ SMTP_PORT = 587
✅ SMTP_SECURE = false
✅ SMTP_USER = atendimento@calcularq.com.br
✅ SMTP_PASS = Milnara.2001
✅ SMTP_FROM = atendimento@calcularq.com.br
```

**Pronto!** Depois de adicionar essas 6 variáveis no Railway, seu sistema de "Esqueci minha senha" estará funcionando com email da Umbler! 🎉

---

## ❓ Problemas Comuns

**Email não chega?**
- Verifique a pasta de spam
- Confira os logs do Railway
- Verifique se o email do destinatário está correto
- Verifique se o usuário existe no sistema

**Erro "Invalid login"?**
- Verifique se `SMTP_USER` está completo: `atendimento@calcularq.com.br`
- Verifique se `SMTP_PASS` está correto (sem espaços extras)
- Verifique se a senha do email está correta na Umbler

**Erro "Connection timeout"?**
- Verifique se `SMTP_HOST` está correto: `smtp.umbler.com`
- Verifique se `SMTP_PORT` é `587`

---

## 💡 Dica

**Depois de configurar, teste imediatamente!** Se funcionar, você verá `FORGOT_PASSWORD_EMAIL_SENT` nos logs e receberá o email. Se não funcionar, os logs mostrarão o erro específico.




