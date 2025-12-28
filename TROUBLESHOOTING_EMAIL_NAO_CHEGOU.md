# 🔧 Email Não Chegou - Troubleshooting

## Problema: Email de verificação do SendGrid não chegou

Você criou o Sender mas não recebeu o email de verificação. Vamos resolver isso!

---

## ✅ Solução 1: Verificar Email de Verificação do SendGrid

### Passo 1: Verificar Caixa de Entrada
1. Acesse: **ramonsousa1301@gmail.com**
2. Procure por email do **SendGrid**
3. Assunto pode ser: "Verify your sender email" ou "Verify your email address"
4. **Verifique também a pasta de SPAM/Lixo Eletrônico**

### Passo 2: Reenviar Email de Verificação
1. Acesse: https://app.sendgrid.com/
2. Vá em: **Settings** → **Sender Authentication** → **Single Sender Verification**
3. Encontre o Sender que você criou
4. Clique em **"Resend Verification"** ou **"Verify"**
5. Aguarde alguns minutos
6. Verifique novamente o email

### Passo 3: Verificar Status do Sender
No SendGrid, veja o status do Sender:
- ✅ **Verified** = Verificado (pode usar)
- ⚠️ **Pending** = Aguardando verificação
- ❌ **Unverified** = Não verificado (não pode usar)

---

## ✅ Solução 2: Criar Novo Sender com Dados Corretos

Se o email não chegou, pode ser porque os dados estão incorretos. Vamos criar um novo:

### 1. Deletar o Sender Antigo (Opcional)
1. No SendGrid: **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Encontre o Sender com dados aleatórios
3. Clique em **"Delete"** ou **"Remove"**

### 2. Criar Novo Sender Corretamente

Preencha com dados REAIS:

```
From Name: Calcularq
From Email Address: ramonsousa1301@gmail.com
Reply To: ramonsousa1301@gmail.com
Company Address: Seu endereço real (ex: Rua Exemplo, 123)
Company Address Line 2: (deixe em branco ou complemento)
City: Sua cidade real
State: Seu estado real
Zip Code: Seu CEP real
Country: Brazil (não New Zealand!)
Nickname: Calcularq Sender
```

**⚠️ IMPORTANTE:**
- Use dados REAIS (não aleatórios)
- Use **Brazil** como país (não New Zealand)
- Use endereço real (pode ser seu endereço pessoal)

### 3. Aguardar Email de Verificação
- Aguarde 2-5 minutos
- Verifique caixa de entrada
- Verifique pasta de SPAM
- Se não chegou, clique em "Resend Verification"

---

## ✅ Solução 3: Verificar Variáveis no Railway

Mesmo que o Sender não esteja verificado, vamos verificar se as variáveis estão corretas:

### Variáveis que DEVEM estar no Railway:

```
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = apikey
SMTP_PASS = SG.sua_api_key_aqui
SMTP_FROM = ramonsousa1301@gmail.com
```

**⚠️ IMPORTANTE:**
- `SMTP_FROM` deve ser **exatamente** o mesmo email do "From Email Address" do Sender
- Se você mudou o Sender, atualize o `SMTP_FROM` também

### Como Verificar no Railway:
1. Acesse seu projeto no Railway
2. Vá em **"Variables"** ou **"Environment"**
3. Verifique se todas as 6 variáveis estão lá
4. Verifique se os valores estão corretos
5. Se mudou algo, o Railway reinicia automaticamente

---

## ✅ Solução 4: Verificar Logs do Railway

Vamos ver se há erros:

### 1. Acessar Logs
1. No Railway: **"Deployments"** → último deploy
2. Clique em **"View Logs"**

### 2. Procurar por:
- ✅ `FORGOT_PASSWORD_EMAIL_SENT` = Email foi enviado com sucesso
- ❌ `FORGOT_PASSWORD_EMAIL_ERROR` = Erro no envio (veja a mensagem de erro)
- ⚠️ `SMTP não configurado` = Variáveis não foram carregadas
- ❌ `Invalid login` = Credenciais SMTP incorretas
- ❌ `Connection timeout` = Problema de conexão

### 3. Erros Comuns e Soluções:

**"Invalid login"**
- Verifique se `SMTP_USER` é exatamente `apikey` (sem espaços)
- Verifique se `SMTP_PASS` está completo

**"Sender not verified"**
- O Sender precisa estar verificado no SendGrid
- Verifique o email de verificação

**"Connection timeout"**
- Verifique se `SMTP_HOST` está correto: `smtp.sendgrid.net`
- Verifique se `SMTP_PORT` é `587`

---

## ✅ Solução 5: Testar Envio Direto

Vamos testar se o SendGrid está funcionando:

### 1. Verificar no Dashboard do SendGrid
1. Acesse: https://app.sendgrid.com/
2. Vá em **"Activity"** (menu lateral)
3. Veja se há tentativas de envio:
   - ✅ **Delivered** = Email entregue
   - ⚠️ **Bounced** = Email rejeitado
   - ❌ **Blocked** = Email bloqueado
   - ⚠️ **Pending** = Aguardando envio

### 2. Verificar se o Sender está Verificado
1. **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Veja o status do Sender:
   - Se está **"Unverified"** ou **"Pending"**, precisa verificar primeiro
   - Só pode enviar emails se estiver **"Verified"**

---

## 🎯 Passo a Passo Completo para Resolver

### 1. Verificar Email de Verificação
- ✅ Abra: ramonsousa1301@gmail.com
- ✅ Procure email do SendGrid
- ✅ Verifique pasta de SPAM
- ✅ Se não achou, reenvie verificação no SendGrid

### 2. Verificar Status do Sender
- ✅ Acesse SendGrid → Settings → Sender Authentication
- ✅ Veja se está "Verified"
- ✅ Se não, verifique o email

### 3. Verificar Variáveis no Railway
- ✅ Confirme que todas as 6 variáveis estão configuradas
- ✅ Confirme que `SMTP_FROM = ramonsousa1301@gmail.com`
- ✅ Confirme que `SMTP_USER = apikey` (sem espaços)

### 4. Verificar Logs do Railway
- ✅ Veja os logs do último deploy
- ✅ Procure por erros relacionados a email
- ✅ Veja a mensagem de erro específica

### 5. Testar Novamente
- ✅ Acesse sua aplicação
- ✅ Teste "Esqueci minha senha"
- ✅ Verifique se o email chegou
- ✅ Verifique no SendGrid → Activity se o email foi enviado

---

## ⚠️ Problemas Comuns

### Email não chega porque:
1. **Sender não verificado** - Precisa verificar o email primeiro
2. **Variáveis incorretas** - Verifique no Railway
3. **Email no spam** - Verifique pasta de spam
4. **Usuário não existe** - Precisa criar usuário no sistema primeiro
5. **API Key incorreta** - Verifique se copiou completa

### Sender não verifica porque:
1. **Email de verificação não chegou** - Verifique spam, reenvie
2. **Dados incorretos** - Crie novo Sender com dados reais
3. **País errado** - Use Brazil, não New Zealand
4. **Email não existe** - Use email que você tem acesso

---

## 🔍 Checklist de Verificação

Antes de testar novamente, verifique:

- [ ] Sender criado no SendGrid com dados REAIS
- [ ] Email de verificação do SendGrid foi recebido e clicado
- [ ] Sender está com status "Verified" no SendGrid
- [ ] Todas as 6 variáveis SMTP configuradas no Railway
- [ ] `SMTP_FROM` = mesmo email do Sender
- [ ] `SMTP_USER` = exatamente "apikey" (sem espaços)
- [ ] `SMTP_PASS` = API Key completa
- [ ] Deploy do Railway reiniciou após mudanças
- [ ] Usuário existe no sistema (para testar "esqueci senha")
- [ ] Verificou pasta de spam ao testar

---

## 💡 Dica Final

**O problema mais comum é o Sender não estar verificado!**

1. Verifique o email de verificação do SendGrid
2. Clique no link ou cole o código
3. Depois disso, o envio deve funcionar

Se ainda não funcionar, verifique os logs do Railway para ver o erro específico.

---

## 🚀 Próximos Passos

1. **Verifique o email de verificação** do SendGrid (ramonsousa1301@gmail.com)
2. **Crie um novo Sender com dados reais** se necessário
3. **Verifique as variáveis no Railway**
4. **Teste novamente**
5. **Veja os logs** se ainda não funcionar

**Resumo:** O problema provavelmente é o Sender não estar verificado. Verifique o email de verificação do SendGrid primeiro! ✅

