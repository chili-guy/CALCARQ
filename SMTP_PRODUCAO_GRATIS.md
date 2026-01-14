# 🎯 SMTP Gratuito para Produção - Recomendações

Este guia foca nas **melhores opções gratuitas** para usar o sistema "Esqueci minha senha" em produção.

---

## ⭐ Recomendação Principal: SendGrid

### Por que SendGrid?
- ✅ **100 emails/dia gratuitos** (3.000/mês) - mais que suficiente para começar
- ✅ **Feito para produção** - infraestrutura profissional
- ✅ **Sem cartão de crédito** necessário
- ✅ **Fácil configuração** - apenas 5 minutos
- ✅ **Confiável** - usado por grandes empresas
- ✅ **Sem limite de tempo** - plano gratuito permanente

### Como configurar SendGrid (Passo a Passo)

#### 1. Criar conta gratuita
1. Acesse: https://signup.sendgrid.com/
2. Preencha o formulário (nome, email, senha)
3. Verifique seu email
4. **IMPORTANTE**: Escolha o plano **Free** (não precisa de cartão de crédito)

#### 2. Criar API Key SMTP
1. Após fazer login, vá em: **Settings** → **API Keys** (ou acesse: https://app.sendgrid.com/settings/api_keys)
2. Clique em **"Create API Key"**
3. Escolha um nome: `Calcularq SMTP`
4. Selecione permissões: **"Full Access"** (ou apenas "Mail Send" se preferir mais seguro)
5. Clique em **"Create & View"**
6. **COPIE A API KEY AGORA** (você só verá ela uma vez!)
   - Formato: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 3. Configurar no Railway
1. Acesse seu projeto no Railway
2. Vá em **"Variables"** ou **"Environment"**
3. Adicione estas variáveis:

```
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = apikey
SMTP_PASS = SG.sua_api_key_aqui
SMTP_FROM = noreply@seu-dominio.com
```

**⚠️ IMPORTANTE:**
- `SMTP_USER` deve ser literalmente a palavra `apikey` (não seu email!)
- `SMTP_PASS` é a API Key que você copiou
- `SMTP_FROM` deve ser um email verificado (pode ser seu email pessoal no início)

#### 4. Verificar remetente (Opcional, mas recomendado)
1. No SendGrid, vá em: **Settings** → **Sender Authentication**
2. Clique em **"Verify a Single Sender"**
3. Preencha seus dados
4. Verifique o email que receberá
5. Use esse email no `SMTP_FROM`

#### 5. Testar
1. Faça o deploy no Railway (ele reinicia automaticamente quando você adiciona variáveis)
2. Acesse sua aplicação
3. Teste o "Esqueci minha senha"
4. Verifique se o email chegou!

**Limite gratuito:** 100 emails/dia (perfeito para começar)

---

## 🥈 Alternativa 1: Brevo (Sendinblue)

### Por que Brevo?
- ✅ **300 emails/dia gratuitos** (9.000/mês) - ainda mais generoso!
- ✅ **Totalmente gratuito** - sem necessidade de cartão
- ✅ **Interface simples**
- ✅ **Focado em transacional** - perfeito para "esqueci senha"

### Como configurar Brevo

#### 1. Criar conta
1. Acesse: https://www.brevo.com/signup/
2. Preencha o cadastro
3. Verifique seu email

#### 2. Obter credenciais SMTP
1. Após login, vá em: **Settings** → **SMTP & API**
2. Vá para a aba **"SMTP"**
3. Você verá suas credenciais:
   - **Server:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **Login:** Seu email cadastrado
   - **Password:** Uma senha SMTP específica (não sua senha de login!)

#### 3. Gerar senha SMTP
1. Se não tiver senha SMTP, clique em **"Generate new password"**
2. Dê um nome: `Calcularq`
3. Copie a senha gerada

#### 4. Configurar no Railway
```
SMTP_HOST = smtp-relay.brevo.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = seu_email@exemplo.com
SMTP_PASS = xxxxxx_senha_smtp_gerada_xxxxxx
SMTP_FROM = seu_email@exemplo.com
```

**Limite gratuito:** 300 emails/dia (excelente!)

---

## 🥉 Alternativa 2: Mailgun

### Por que Mailgun?
- ✅ **5.000 emails/mês gratuitos** (primeiros 3 meses)
- ✅ **Depois: 100 emails/dia** (como SendGrid)
- ✅ **Muito confiável**
- ✅ **Boa documentação**

### Como configurar Mailgun

#### 1. Criar conta
1. Acesse: https://www.mailgun.com/signup
2. Escolha plano **Free**
3. Preencha cadastro
4. Verifique email

#### 2. Verificar domínio (ou usar sandbox)
- **Opção A - Sandbox (mais rápido):** Use o domínio sandbox fornecido
- **Opção B - Seu domínio:** Adicione DNS records (mais profissional)

#### 3. Obter credenciais SMTP
1. No dashboard, vá em: **Sending** → **Domain Settings**
2. Escolha seu domínio (sandbox ou próprio)
3. Na aba **"SMTP credentials"**, copie:
   - **SMTP hostname**
   - **SMTP port** (587)
   - **Default SMTP login**
   - **Default password**

#### 4. Configurar no Railway
```
SMTP_HOST = smtp.mailgun.org
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = postmaster@sandboxxxxxx.mailgun.org
SMTP_PASS = senha_smtp_copiada
SMTP_FROM = noreply@sandboxxxxxx.mailgun.org
```

**Limite gratuito:** 5.000/mês nos primeiros 3 meses, depois 100/dia

---

## 📊 Comparação Rápida

| Serviço | Limite Grátis | Fácil Setup | Recomendado Para |
|---------|---------------|-------------|------------------|
| **SendGrid** ⭐ | 100/dia | ⭐⭐⭐⭐⭐ | Melhor opção geral |
| **Brevo** | 300/dia | ⭐⭐⭐⭐ | Quem precisa de mais volume |
| **Mailgun** | 100/dia* | ⭐⭐⭐ | Alternativa sólida |
| **Gmail** | Ilimitado* | ⭐⭐⭐⭐ | ❌ NÃO para produção |

\* Mailgun: 5.000/mês primeiro trimestre  
\* Gmail: Pode ser bloqueado com muitos envios

---

## 🎯 Minha Recomendação Final

### Para começar AGORA (5 minutos):
**👉 SendGrid** - É o mais rápido de configurar e totalmente adequado para produção.

### Se precisar de mais volume:
**👉 Brevo** - 300 emails/dia é muito generoso para a maioria dos casos.

### Por que NÃO usar Gmail pessoal em produção?
- ❌ Pode ser bloqueado após alguns envios
- ❌ Não é feito para emails transacionais
- ❌ Limites não documentados
- ❌ Pode ir para spam mais facilmente
- ❌ Não tem analytics profissionais

---

## 🚀 Configuração Rápida: SendGrid (Recomendado)

### Passos rápidos:

1. **Criar conta:** https://signup.sendgrid.com/ (2 min)
2. **Criar API Key:** Settings → API Keys → Create (1 min)
3. **Copiar API Key:** `SG.xxxxxxxxxxxxx`
4. **Configurar no Railway:**
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=SG.sua_api_key_aqui
   SMTP_FROM=seu_email@gmail.com
   ```
5. **Deploy automático** - Railway reinicia sozinho
6. **Testar** - Pronto! ✅

**Tempo total: ~5 minutos** ⏱️

---

## 💡 Dicas Importantes

1. **Comece com SendGrid** - É o mais simples e confiável
2. **Use um email profissional no SMTP_FROM** - Melhor para confiança
3. **Monitore os limites** - Verifique no dashboard do provedor
4. **Configure SPF/DKIM** (opcional) - Melhora a entrega (SendGrid e Brevo têm guias)
5. **Não exponha suas credenciais** - Use variáveis de ambiente sempre

---

## ❓ FAQ

**P: Preciso de cartão de crédito?**  
R: Não! Todas essas opções funcionam sem cartão no plano gratuito.

**P: Quando preciso pagar?**  
R: Só se ultrapassar os limites gratuitos (SendGrid: mais de 100/dia, Brevo: mais de 300/dia).

**P: Posso trocar depois?**  
R: Sim! Basta mudar as variáveis de ambiente e fazer novo deploy.

**P: Qual é o melhor para meu caso?**  
R: **SendGrid** - É a escolha mais segura e profissional para começar.

---

**🎉 Resumo:** Use **SendGrid** para produção. É gratuito, confiável e configura em 5 minutos!





