# 🔍 Email Não Chegou - Troubleshooting Brevo

## Problema

O log mostra que o email foi enviado com sucesso:
```
✅ Email enviado via Brevo API: { messageId: '...' }
FORGOT_PASSWORD_EMAIL_SENT
```

Mas o email **não chegou** na caixa de entrada nem no spam.

---

## 🔍 Possíveis Causas

### 1. **Sender Não Verificado no Brevo** ⚠️ MAIS COMUM

O Brevo **exige que o email remetente seja verificado** antes de enviar emails.

**Sintoma:** Email aceito pelo Brevo, mas não chega ao destinatário.

**Solução:**
1. Acesse: https://app.brevo.com/
2. Vá em: **Settings** → **Senders & IP**
3. Clique em **"Add a sender"**
4. Adicione: `atendimento@calcularq.com.br`
5. **Verifique o email** (Brevo enviará um email de verificação)
6. Confirme o email clicando no link enviado

**⚠️ IMPORTANTE:** Você precisa ter acesso ao email `atendimento@calcularq.com.br` para verificar!

---

### 2. **Usar Email Verificado no Brevo**

Se você não tem acesso a `atendimento@calcularq.com.br`, use um email que você já verificou no Brevo:

**Opção A:** Usar o email da sua conta Brevo
- Se você se cadastrou com `seu_email@gmail.com`, use esse email

**Opção B:** Verificar outro email
- Adicione e verifique um email que você tem acesso

**Depois, atualize no Railway:**
```
SMTP_FROM = seu_email_verificado@gmail.com
```

---

### 3. **Verificar Status do Envio no Brevo**

1. Acesse: https://app.brevo.com/
2. Vá em: **Statistics** → **Email Activity**
3. Procure pelo email enviado (use o messageId dos logs)
4. Veja o status:
   - ✅ **Delivered** = Email entregue (pode estar no spam)
   - ⚠️ **Bounced** = Email rejeitado
   - ❌ **Blocked** = Bloqueado (sender não verificado)

---

### 4. **Verificar Logs do Brevo**

1. Acesse: https://app.brevo.com/
2. Vá em: **Statistics** → **Email Activity**
3. Procure pelo email usando:
   - Email do destinatário: `ramonsousa1301@gmail.com`
   - Data/hora do envio
4. Veja os detalhes do envio

---

### 5. **Gmail Pode Estar Bloqueando**

O Gmail pode estar bloqueando emails do Brevo se:
- O sender não está verificado
- O domínio não tem SPF/DKIM configurado
- O email parece spam

**Solução:** Verifique o sender no Brevo primeiro.

---

## ✅ Solução Rápida

### Passo 1: Verificar Sender no Brevo

1. **Acesse:** https://app.brevo.com/
2. **Vá em:** Settings → Senders & IP
3. **Verifique se** `atendimento@calcularq.com.br` está listado e **verificado**
4. **Se não estiver:**
   - Clique em "Add a sender"
   - Adicione `atendimento@calcularq.com.br`
   - Verifique o email (Brevo enviará um email de confirmação)
   - Confirme clicando no link

### Passo 2: Usar Email Verificado (Alternativa)

Se não conseguir verificar `atendimento@calcularq.com.br`:

1. **Use um email que você já verificou** (ex: o email da sua conta Brevo)
2. **Atualize no Railway:**
   ```
   SMTP_FROM = seu_email_verificado@gmail.com
   ```

### Passo 3: Testar Novamente

1. **Aguarde o deploy** reiniciar
2. **Teste "Esqueci minha senha"** novamente
3. **Verifique a caixa de entrada e spam**

---

## 🔍 Verificar Status no Brevo

Para ver o que aconteceu com o email:

1. **Acesse:** https://app.brevo.com/
2. **Vá em:** Statistics → Email Activity
3. **Procure pelo email** usando:
   - Email: `ramonsousa1301@gmail.com`
   - Data: 28/12/2025 ~22:03
4. **Veja o status:**
   - Se aparecer "Blocked" = Sender não verificado
   - Se aparecer "Bounced" = Email rejeitado
   - Se aparecer "Delivered" = Email entregue (pode estar no spam)

---

## 📝 Resumo

**Problema mais comum:** Sender não verificado no Brevo

**Solução:**
1. Verificar `atendimento@calcularq.com.br` no Brevo
2. Ou usar um email já verificado
3. Atualizar `SMTP_FROM` no Railway

**Depois:** Testar novamente

---

## 💡 Dica

**Se você não tem acesso a `atendimento@calcularq.com.br`:**
- Use o email da sua conta Brevo (já verificado)
- Ou verifique outro email que você tem acesso
- Atualize `SMTP_FROM` no Railway

**O importante é que o sender esteja verificado no Brevo!** ✅




