# 📧 Configuração SMTP com Email da Umbler

Guia para configurar o sistema "Esqueci minha senha" usando email da Umbler.

---

## 📋 Informações SMTP da Umbler

A Umbler usa estas configurações SMTP:

```
SMTP_HOST = smtp.umbler.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = seu_email@seu-dominio.com
SMTP_PASS = sua_senha_do_email
SMTP_FROM = seu_email@seu-dominio.com
```

**✅ Configuração Oficial da Umbler:**
- **Servidor SMTP:** `smtp.umbler.com`
- **Porta:** `587`
- **Criptografia:** STARTTLS (SMTP_SECURE = false)
- **Autenticação:** Ativada
- **Usuário:** Email completo (ex: `contato@calcarq.com.br`)

**⚠️ IMPORTANTE:** 
- Use o email completo (com @dominio.com)
- Use a senha do email (não a senha do painel da Umbler)
- Porta 587 com STARTTLS (não SSL)

---

## 🔧 Configuração no Railway

### Variáveis de Ambiente:

1. **SMTP_HOST**
   ```
   smtp.umbler.com
   ```
   ou
   ```
   mail.umbler.com
   ```
   (Verifique no painel da Umbler qual é o servidor correto)

2. **SMTP_PORT**
   ```
   587
   ```
   ou
   ```
   465
   ```
   (587 para TLS, 465 para SSL)

3. **SMTP_SECURE**
   ```
   false
   ```
   (se usar porta 587)
   ou
   ```
   true
   ```
   (se usar porta 465)

4. **SMTP_USER**
   ```
   seu_email@seu-dominio.com
   ```
   (Email completo da Umbler)

5. **SMTP_PASS**
   ```
   sua_senha_do_email
   ```
   (Senha do email, não do painel)

6. **SMTP_FROM**
   ```
   seu_email@seu-dominio.com
   ```
   (Mesmo email do SMTP_USER)

---

## 📝 Como Obter as Configurações da Umbler

### Opção 1: Painel da Umbler

1. Acesse o painel da Umbler
2. Vá em **"Email"** ou **"E-mails"**
3. Procure por **"Configurações SMTP"** ou **"Configurações de Email"**
4. Copie as informações:
   - Servidor SMTP
   - Porta
   - Se usa SSL/TLS

### Opção 2: Documentação da Umbler

1. Acesse: https://www.umbler.com/br/ajuda
2. Procure por "Configuração SMTP" ou "Configuração de Email"
3. Veja as instruções específicas

### Opção 3: Suporte da Umbler

Se não encontrar, entre em contato com o suporte da Umbler e pergunte:
- Servidor SMTP
- Porta SMTP
- Se usa SSL ou TLS
- Se precisa de autenticação especial

---

## 🎯 Exemplo Completo

### Configuração Oficial da Umbler (Porta 587 com STARTTLS):

```
SMTP_HOST = smtp.umbler.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = contato@calcarq.com.br
SMTP_PASS = senha_do_email
SMTP_FROM = contato@calcarq.com.br
```

**✅ Esta é a configuração recomendada pela Umbler!**

---

## ⚙️ Configuração no Railway

### Passo a Passo:

1. **Acesse seu projeto no Railway**
2. **Vá em "Variables" ou "Environment"**
3. **Adicione cada variável:**

   ```
   SMTP_HOST = smtp.umbler.com
   SMTP_PORT = 587
   SMTP_SECURE = false
   SMTP_USER = seu_email@seu-dominio.com
   SMTP_PASS = sua_senha_do_email
   SMTP_FROM = seu_email@seu-dominio.com
   ```

4. **O Railway reiniciará automaticamente**

---

## ✅ Testar Configuração

### 1. Verificar Logs do Railway

Após configurar, teste e veja os logs:

1. **Railway → Deployments → Último deploy → View Logs**
2. **Procure por:**
   - ✅ `FORGOT_PASSWORD_EMAIL_SENT` = Funcionou!
   - ❌ `FORGOT_PASSWORD_EMAIL_ERROR` = Erro (veja a mensagem)

### 2. Testar no Aplicativo

1. Acesse sua aplicação
2. Vá em "Esqueci minha senha"
3. Digite um email cadastrado
4. Verifique se o email chegou

---

## 🔍 Troubleshooting

### Erro: "Invalid login"

**Causa:** Credenciais incorretas

**Solução:**
- Verifique se `SMTP_USER` está completo (com @dominio.com)
- Verifique se `SMTP_PASS` é a senha do email (não do painel)
- Verifique se não há espaços extras

---

### Erro: "Connection timeout"

**Causa:** Servidor ou porta incorretos

**Solução:**
- Verifique o servidor SMTP correto no painel da Umbler
- Tente porta 587 primeiro, depois 465
- Verifique se `SMTP_HOST` está correto

---

### Erro: "Authentication failed"

**Causa:** Autenticação SMTP falhou

**Solução:**
- Verifique se o email está ativo na Umbler
- Verifique se a senha está correta
- Verifique se precisa de autenticação especial

---

### Email não chega

**Verifique:**
1. Logs do Railway (veja se foi enviado)
2. Pasta de spam
3. Se o usuário existe no sistema
4. Se o email do destinatário está correto

---

## 💡 Dicas Importantes

1. **Use email do seu domínio:** Se você tem domínio na Umbler, use um email desse domínio (ex: `contato@calcarq.com.br`)

2. **Verifique no painel:** As configurações podem variar. Sempre verifique no painel da Umbler

3. **Teste ambas as portas:** Se 587 não funcionar, tente 465 (e mude `SMTP_SECURE` para `true`)

4. **Senha do email:** Use a senha do email, não a senha do painel da Umbler

5. **Limites:** Verifique se há limites de envio na Umbler (alguns provedores limitam)

---

## 📞 Se Não Funcionar

1. **Verifique no painel da Umbler:**
   - Configurações SMTP
   - Status do email
   - Limites de envio

2. **Entre em contato com suporte da Umbler:**
   - Pergunte as configurações SMTP exatas
   - Pergunte se há limitações
   - Pergunte se precisa de configuração especial

3. **Verifique os logs do Railway:**
   - Veja a mensagem de erro específica
   - Isso ajuda a identificar o problema

---

## 🎯 Resumo Rápido

1. **Obtenha as configurações SMTP da Umbler** (painel ou suporte)
2. **Configure no Railway:**
   ```
   SMTP_HOST = smtp.umbler.com (ou o servidor correto)
   SMTP_PORT = 587 (ou 465)
   SMTP_SECURE = false (ou true se porta 465)
   SMTP_USER = seu_email@seu-dominio.com
   SMTP_PASS = senha_do_email
   SMTP_FROM = seu_email@seu-dominio.com
   ```
3. **Teste e verifique os logs**
4. **Se não funcionar, tente porta 465 com SMTP_SECURE = true**

---

**⚠️ IMPORTANTE:** As configurações podem variar. Sempre verifique no painel da Umbler ou entre em contato com o suporte para obter as configurações exatas do seu plano!

