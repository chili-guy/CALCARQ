# 🔄 Atualizar Variáveis para SendGrid

## Problema

Os logs mostram que está usando **Umbler** (`smtp.umbler.com`), mas você quer usar **SendGrid**.

Isso significa que as variáveis no Railway ainda estão configuradas para Umbler.

---

## ✅ Solução: Atualizar Variáveis no Railway

### 1. Acesse o Railway

1. Vá em: https://railway.app/
2. Entre no seu projeto **Calcularq**
3. Clique na aba **"Variables"** ou **"Environment"**

### 2. Atualize as Variáveis

**Substitua as variáveis atuais por estas:**

#### SMTP_HOST
```
Nome: SMTP_HOST
Valor: smtp.sendgrid.net
```
(Substitua `smtp.umbler.com` por `smtp.sendgrid.net`)

#### SMTP_PORT
```
Nome: SMTP_PORT
Valor: 587
```
(Se estiver 465, mude para 587)

#### SMTP_SECURE
```
Nome: SMTP_SECURE
Valor: false
```
(Se estiver `true`, mude para `false`)

#### SMTP_USER
```
Nome: SMTP_USER
Valor: apikey
```
⚠️ **IMPORTANTE:** Deve ser literalmente a palavra `apikey` (não seu email!)

#### SMTP_PASS
```
Nome: SMTP_PASS
Valor: SG.sua_api_key_do_sendgrid_aqui
```
(Substitua pela sua API Key do SendGrid)

#### SMTP_FROM
```
Nome: SMTP_FROM
Valor: atendimento@calcularq.com.br
```
(Pode manter o mesmo)

---

## 📋 Checklist de Atualização

- [ ] `SMTP_HOST` = `smtp.sendgrid.net` (não `smtp.umbler.com`)
- [ ] `SMTP_PORT` = `587` (não `465`)
- [ ] `SMTP_SECURE` = `false` (não `true`)
- [ ] `SMTP_USER` = `apikey` (não `atendimento@calcularq.com.br`)
- [ ] `SMTP_PASS` = `SG.sua_api_key` (sua API Key do SendGrid)
- [ ] `SMTP_FROM` = `atendimento@calcularq.com.br` (pode manter)

---

## 🔍 Como Verificar se Está Correto

Após atualizar, quando o servidor reiniciar, você deve ver nos logs:

```
📧 Configurando SMTP: {
  host: 'smtp.sendgrid.net',  ← Deve ser sendgrid.net, não umbler.com
  port: 587,
  secure: false,
  user: 'apikey'  ← Deve ser 'apikey', não seu email
}
```

Se ainda aparecer `smtp.umbler.com`, as variáveis não foram atualizadas corretamente.

---

## 🚀 Depois de Atualizar

1. **Railway reinicia automaticamente** após mudar variáveis
2. **Aguarde ~30 segundos** para o deploy
3. **Teste "Esqueci minha senha"** novamente
4. **Verifique os logs:**
   - Deve aparecer `smtp.sendgrid.net`
   - Deve aparecer `FORGOT_PASSWORD_EMAIL_SENT` (não timeout!)

---

## ❓ Se Não Tiver API Key do SendGrid

Se você não tem a API Key do SendGrid:

1. **Acesse:** https://app.sendgrid.com/
2. **Vá em:** Settings → API Keys
3. **Clique em:** "Create API Key"
4. **Nome:** `Calcularq SMTP`
5. **Permissões:** "Full Access" ou "Mail Send"
6. **Copie a API Key** (você só verá uma vez!)
7. **Use no `SMTP_PASS`**

---

## 📝 Resumo

**O problema:** Variáveis no Railway ainda estão para Umbler

**A solução:** Atualizar todas as variáveis para SendGrid

**Depois:** Deve funcionar imediatamente! ✅

---

## ⚠️ Importante

**`SMTP_USER` deve ser `apikey`** (não seu email!)

Isso é específico do SendGrid. Outros provedores usam o email como usuário, mas SendGrid usa `apikey` e a API Key como senha.



