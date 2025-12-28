# ⚡ Configuração Brevo - Passo a Passo

## Suas Credenciais Brevo

Você já tem tudo! Aqui está como configurar no Railway:

---

## 📋 Variáveis para Configurar no Railway

Acesse seu projeto no Railway e configure estas variáveis:

### 1. SMTP_HOST
```
Nome: SMTP_HOST
Valor: smtp-relay.brevo.com
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
Valor: 9eea4a001@smtp-brevo.com
```

### 5. SMTP_PASS
```
Nome: SMTP_PASS
Valor: xsmtpsib-sua_key_aqui
```
⚠️ **IMPORTANTE:** Cole sua KEY completa do Brevo aqui (mantenha segura!)

### 6. SMTP_FROM
```
Nome: SMTP_FROM
Valor: atendimento@calcularq.com.br
```
(Use o email que você verificou no Brevo ou seu email pessoal)

---

## 🚀 Como Configurar no Railway

### Método 1: Via Interface Web

1. Acesse: https://railway.app/
2. Entre no seu projeto **Calcularq**
3. Clique na aba **"Variables"** ou **"Environment"**
4. Para cada variável acima:
   - Se já existe, **edite** (clique no lápis/ícone de edição)
   - Se não existe, **adicione** (clique em "New Variable")
   - **Atualize o valor** conforme acima
   - **Salve**
5. Repita para todas as 6 variáveis
6. O Railway reiniciará automaticamente o deploy

### Método 2: Via Railway CLI (se preferir)

```bash
railway variables set SMTP_HOST=smtp-relay.brevo.com
railway variables set SMTP_PORT=587
railway variables set SMTP_SECURE=false
railway variables set SMTP_USER=9eea4a001@smtp-brevo.com
railway variables set SMTP_PASS=xsmtpsib-sua_key_aqui
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

**Deve aparecer nos logs:**
```
📧 Configurando SMTP: {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  user: '9eea4a001@smtp-brevo.com'
}
```

---

## 🔒 Segurança Importante

⚠️ **ATENÇÃO:** Você compartilhou sua KEY do Brevo aqui. Por segurança:

1. **Após configurar no Railway, considere:**
   - Gerar uma nova KEY no Brevo
   - Deletar a antiga
   - Usar a nova no Railway

2. **Para gerar nova KEY:**
   - Acesse: Brevo → Settings → SMTP & API → SMTP
   - Clique em "Generate new password"
   - Copie a nova KEY
   - Atualize no Railway

3. **Nunca commite credenciais no Git!**
   - Use sempre variáveis de ambiente
   - Não adicione no `.env` se for commitar

---

## 📝 Resumo Rápido

```
✅ SMTP_HOST = smtp-relay.brevo.com
✅ SMTP_PORT = 587
✅ SMTP_SECURE = false
✅ SMTP_USER = 9eea4a001@smtp-brevo.com
✅ SMTP_PASS = xsmtpsib-sua_key_aqui (cole sua KEY completa do Brevo)
✅ SMTP_FROM = atendimento@calcularq.com.br
```

**Pronto!** Depois de adicionar essas 6 variáveis no Railway, seu sistema de "Esqueci minha senha" estará funcionando com Brevo! 🎉

---

## ❓ Problemas Comuns

**Email não chega?**
- Verifique a pasta de spam
- Confira os logs do Railway
- Verifique se o email do destinatário está correto
- Verifique se o usuário existe no sistema

**Erro "Invalid login"?**
- Verifique se `SMTP_USER` está completo: `9eea4a001@smtp-brevo.com`
- Verifique se `SMTP_PASS` está completo (sem espaços extras)
- Verifique se a KEY está correta

**Erro "Connection timeout"?**
- Verifique se `SMTP_HOST` está correto: `smtp-relay.brevo.com`
- Verifique se `SMTP_PORT` é `587`

---

## 💡 Dica

**Brevo é muito mais simples que SendGrid!** Não precisa de "apikey" como usuário, usa seu login normal. Deve funcionar imediatamente após configurar! ✅

