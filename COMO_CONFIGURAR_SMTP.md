# Guia de Configuração SMTP

Este guia explica como configurar o SMTP para envio de emails no sistema "Esqueci minha senha".

## Variáveis de Ambiente Necessárias

Você precisa configurar as seguintes variáveis no seu ambiente (Railway, Vercel, ou arquivo `.env` local):

```
SMTP_HOST=smtp.gmail.com          # Servidor SMTP
SMTP_PORT=587                      # Porta (587 para TLS, 465 para SSL)
SMTP_SECURE=false                  # true para SSL (porta 465), false para TLS (porta 587)
SMTP_USER=seu_email@gmail.com      # Email do remetente
SMTP_PASS=sua_senha_de_app         # Senha ou senha de app
SMTP_FROM=seu_email@gmail.com      # Email de origem (opcional)
```

---

## Opção 1: Gmail (Recomendado para testes)

### Passo 1: Habilitar verificação em duas etapas
1. Acesse: https://myaccount.google.com/security
2. Ative "Verificação em duas etapas"

### Passo 2: Criar Senha de App
1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "App" → "Email"
3. Selecione "Dispositivo" → "Outro (nome personalizado)"
4. Digite: "Calcularq" (ou qualquer nome)
5. Clique em "Gerar"
6. Copie a senha de 16 caracteres (exemplo: `abcd efgh ijkl mnop`)

### Passo 3: Configurar Variáveis
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASS=abcdefghijklmnop    # A senha de app (sem espaços)
SMTP_FROM=seu_email@gmail.com
```

**⚠️ IMPORTANTE:** 
- Use a **Senha de App** (16 caracteres), não sua senha normal
- Remova os espaços da senha se houver
- Sem a Senha de App, o Gmail bloqueará o acesso

---

## Opção 2: Outlook / Microsoft 365

### Passo 1: Habilitar acesso de aplicativos
1. Acesse: https://account.microsoft.com/security
2. Ative "Verificação em duas etapas"
3. Acesse: https://account.microsoft.com/security/app-passwords
4. Crie uma senha de app para "Email"

### Passo 2: Configurar Variáveis
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@outlook.com
SMTP_PASS=sua_senha_de_app
SMTP_FROM=seu_email@outlook.com
```

**Alternativa (porta 465 com SSL):**
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=seu_email@outlook.com
SMTP_PASS=sua_senha_de_app
```

---

## Opção 3: SendGrid (Recomendado para produção)

SendGrid é um serviço profissional de envio de emails, ideal para produção.

### Passo 1: Criar conta
1. Acesse: https://sendgrid.com/
2. Crie uma conta gratuita (até 100 emails/dia gratuitos)

### Passo 2: Criar API Key
1. Acesse: https://app.sendgrid.com/settings/api_keys
2. Clique em "Create API Key"
3. Dê um nome (ex: "Calcularq")
4. Escolha permissões: "Full Access" ou "Mail Send"
5. Copie a API Key

### Passo 3: Configurar Variáveis
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey                    # Sempre "apikey"
SMTP_PASS=SG.xxxxxxxxxxxxx          # Sua API Key do SendGrid
SMTP_FROM=seu_email@seu-dominio.com
```

---

## Opção 4: Mailgun

### Passo 1: Criar conta
1. Acesse: https://www.mailgun.com/
2. Crie uma conta gratuita (até 5.000 emails/mês)

### Passo 2: Obter credenciais SMTP
1. Acesse o dashboard do Mailgun
2. Vá em "Sending" → "Domain Settings"
3. Copie as credenciais SMTP

### Passo 3: Configurar Variáveis
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@seu-dominio.mailgun.org
SMTP_PASS=sua_senha_smtp
SMTP_FROM=noreply@seu-dominio.com
```

---

## Opção 5: Amazon SES (Para alta escala)

### Passo 1: Configurar no AWS
1. Acesse AWS SES no console
2. Verifique seu email/domínio
3. Obtenha credenciais SMTP

### Passo 2: Configurar Variáveis
```
SMTP_HOST=email-smtp.regiao.amazonaws.com  # Ex: email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=sua_access_key
SMTP_PASS=sua_secret_key
SMTP_FROM=seu_email@seu-dominio.com
```

---

## Configuração no Railway

1. Acesse seu projeto no Railway
2. Vá em "Variables" ou "Environment"
3. Adicione cada variável:
   - Clique em "New Variable"
   - Adicione o nome (ex: `SMTP_HOST`)
   - Adicione o valor (ex: `smtp.gmail.com`)
   - Repita para todas as variáveis
4. O deploy será reiniciado automaticamente

**Exemplo visual:**
```
Variables
├── SMTP_HOST = smtp.gmail.com
├── SMTP_PORT = 587
├── SMTP_SECURE = false
├── SMTP_USER = seu_email@gmail.com
├── SMTP_PASS = abcdefghijklmnop
└── SMTP_FROM = seu_email@gmail.com
```

---

## Configuração no Vercel

1. Acesse seu projeto no Vercel
2. Vá em "Settings" → "Environment Variables"
3. Adicione cada variável:
   - Clique em "Add New"
   - Adicione o nome (ex: `SMTP_HOST`)
   - Adicione o valor
   - Selecione os ambientes (Production, Preview, Development)
   - Clique em "Save"
4. Faça um novo deploy

---

## Configuração Local (Desenvolvimento)

Crie um arquivo `.env` na pasta `server/`:

```bash
cd server
cp env.example.txt .env
```

Edite o arquivo `.env` e preencha as variáveis:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
SMTP_FROM=seu_email@gmail.com
```

---

## Testando a Configuração

### 1. Verificar se o servidor iniciou sem erros
No console do servidor, você deve ver:
```
🚀 Servidor rodando na porta 3001
```

Se houver erro relacionado ao SMTP, verifique as variáveis.

### 2. Testar envio de email
1. Acesse a página de login
2. Clique em "Esqueci minha senha"
3. Digite um email cadastrado
4. Verifique se recebeu o email

### 3. Verificar logs
No console do servidor, você deve ver:
```
[2025-01-01] FORGOT_PASSWORD_TOKEN_GENERATED: { userId: '...', email: '...' }
[2025-01-01] FORGOT_PASSWORD_EMAIL_SENT: { userId: '...', email: '...' }
```

---

## Troubleshooting (Solução de Problemas)

### ❌ Erro: "Invalid login"
- **Causa:** Credenciais incorretas
- **Solução:** Verifique `SMTP_USER` e `SMTP_PASS`

### ❌ Erro: "Connection timeout"
- **Causa:** Porta ou host incorretos
- **Solução:** Verifique `SMTP_HOST` e `SMTP_PORT`

### ❌ Gmail bloqueando acesso
- **Causa:** Tentando usar senha normal ao invés de Senha de App
- **Solução:** Use Senha de App (veja Opção 1)

### ❌ Email não chega
- **Verifique:** Pasta de spam/lixo eletrônico
- **Verifique:** Se o email do destinatário está correto
- **Verifique:** Logs do servidor para erros

### ❌ "SMTP não configurado"
- **Causa:** Variáveis não definidas
- **Solução:** Configure todas as variáveis SMTP
- **Nota:** Em desenvolvimento, isso é normal - tokens serão logados no console

---

## Recomendações

### Para Desenvolvimento/Testes:
- ✅ **Gmail com Senha de App** - Rápido e fácil de configurar
- ✅ Grátis e suficiente para testes

### Para Produção:
- ✅ **SendGrid** - Plano gratuito generoso (100 emails/dia)
- ✅ **Mailgun** - Alternativa gratuita (5.000 emails/mês)
- ✅ **Amazon SES** - Para alta escala (paga por uso)

### Não recomendado para produção:
- ❌ Gmail pessoal - Pode ser bloqueado com muitos envios
- ❌ Outlook pessoal - Limitações similares

---

## Exemplo Completo: Gmail

```env
# .env ou variáveis do Railway/Vercel
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=calcularq@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=calcularq@gmail.com
```

Depois de configurar, reinicie o servidor e teste!





