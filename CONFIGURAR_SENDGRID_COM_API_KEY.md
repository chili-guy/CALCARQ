# ✅ Configurar SendGrid com sua API Key

Você criou a API Key "TESTE" no SendGrid. Agora vamos configurar no Railway!

---

## 🔑 Sua API Key do SendGrid

Você criou a API Key "TESTE" no SendGrid. Use essa API Key no `SMTP_PASS`.

⚠️ **IMPORTANTE:** Mantenha sua API Key segura! Não compartilhe publicamente.

---

## 📋 Variáveis para Configurar no Railway

Acesse seu projeto no Railway e configure estas variáveis:

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
⚠️ **CRÍTICO:** Deve ser literalmente a palavra `apikey` (não seu email!)

### 5. SMTP_PASS
```
Nome: SMTP_PASS
Valor: SG.sua_api_key_aqui
```
⚠️ **IMPORTANTE:** Cole sua API Key completa do SendGrid aqui (a que você criou chamada "TESTE")

### 6. SMTP_FROM
```
Nome: SMTP_FROM
Valor: atendimento@calcularq.com.br
```
(Use o email que você verificou no SendGrid)

---

## 🚀 Passo a Passo no Railway

1. **Acesse:** https://railway.app/
2. **Entre no seu projeto Calcularq**
3. **Vá em "Variables" ou "Environment"**
4. **Para cada variável:**
   - Se já existe, **edite** (clique no lápis)
   - Se não existe, **adicione** (clique em "New Variable")
   - **Atualize o valor** conforme acima
   - **Salve**

5. **O Railway reiniciará automaticamente** após salvar

---

## ✅ Verificar se Está Correto

Após atualizar, quando o servidor reiniciar, você deve ver nos logs:

```
📧 Configurando SMTP: {
  host: 'smtp.sendgrid.net',  ← Deve ser sendgrid.net
  port: 587,
  secure: false,
  user: 'apikey'  ← Deve ser 'apikey'
}
✅ Servidor SMTP verificado e pronto
```

**Se ainda aparecer `smtp.umbler.com`**, as variáveis não foram atualizadas.

---

## 🧪 Testar

1. **Aguarde o deploy reiniciar** (~30 segundos)
2. **Acesse sua aplicação**
3. **Teste "Esqueci minha senha"**
4. **Verifique os logs:**
   - Deve aparecer `smtp.sendgrid.net`
   - Deve aparecer `FORGOT_PASSWORD_EMAIL_SENT` (não timeout!)
   - O email deve chegar! 📧

---

## 📊 O que Deve Aparecer nos Logs

### ✅ Se Funcionar:

```
📧 Configurando SMTP: { host: 'smtp.sendgrid.net', ... }
✅ Servidor SMTP verificado e pronto
📧 Iniciando envio de email...
✅ Email enviado com sucesso em XXXms
FORGOT_PASSWORD_EMAIL_SENT: { ... }
```

### ❌ Se Não Funcionar:

```
FORGOT_PASSWORD_EMAIL_ERROR: { error: '...' }
```

Se aparecer erro, veja a mensagem específica nos logs.

---

## 🔒 Segurança

⚠️ **ATENÇÃO:** Você compartilhou sua API Key aqui. Por segurança:

1. **Após configurar no Railway, considere:**
   - Gerar uma nova API Key no SendGrid
   - Deletar a antiga
   - Usar a nova no Railway

2. **Para gerar nova key:**
   - Acesse: https://app.sendgrid.com/settings/api_keys
   - Delete a key "TESTE"
   - Crie uma nova
   - Atualize no Railway

3. **Nunca commite credenciais no Git!**

---

## 📝 Resumo Rápido

```
✅ SMTP_HOST = smtp.sendgrid.net
✅ SMTP_PORT = 587
✅ SMTP_SECURE = false
✅ SMTP_USER = apikey
✅ SMTP_PASS = SG.sua_api_key_aqui (cole a API Key que você criou)
✅ SMTP_FROM = atendimento@calcularq.com.br
```

**Pronto!** Depois de atualizar essas variáveis no Railway, seu sistema de "Esqueci minha senha" funcionará com SendGrid! 🎉

---

## ❓ Problemas Comuns

**Ainda aparece `smtp.umbler.com` nos logs?**
- Verifique se atualizou `SMTP_HOST` corretamente
- Aguarde o deploy reiniciar completamente

**Erro "Invalid login"?**
- Verifique se `SMTP_USER` é exatamente `apikey` (sem espaços)
- Verifique se `SMTP_PASS` está completo (sem quebras de linha)

**Email não chega?**
- Verifique pasta de spam
- Verifique se o Sender está verificado no SendGrid
- Veja os logs para erros específicos

