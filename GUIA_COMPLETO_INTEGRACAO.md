# 🎯 GUIA COMPLETO - Integração de Pagamento Stripe (Linux)
## Passo a Passo Detalhado - Do Zero ao Funcionando

> **Sistema:** Linux  
> **Este guia é específico para Linux - todos os comandos são para terminal Linux**

---

## 🎬 COMEÇE AQUI - Resumo Rápido

**O que você precisa fazer (em ordem):**

1. ✅ **Criar conta no Stripe** → https://dashboard.stripe.com/register
2. ✅ **Copiar a chave secreta** → https://dashboard.stripe.com/apikeys
3. ✅ **Instalar Stripe CLI** → https://stripe.com/docs/stripe-cli
4. ✅ **Obter webhook secret** → `stripe listen --forward-to localhost:3001/api/webhook/stripe`
5. ✅ **Criar arquivo `.env`** na pasta `server/` com as chaves
6. ✅ **Instalar dependências** → `cd server && npm install`
7. ✅ **Iniciar servidor** → `cd server && npm run dev`
8. ✅ **Configurar frontend** → Criar `.env` na raiz com `VITE_API_URL=http://localhost:3001`
9. ✅ **Iniciar frontend** → `npm run dev`
10. ✅ **Testar pagamento** → Acessar http://localhost:5173 e fazer um pagamento de teste

**⏱️ Tempo estimado: 15-30 minutos**

**📝 Se preferir, siga o guia completo abaixo com todos os detalhes!**

---

## 📋 O QUE VOCÊ VAI FAZER

Você vai configurar o sistema para que:
1. Quando o usuário clicar em "Realizar Pagamento"
2. Abra a página de pagamento do Stripe
3. Após o pagamento ser confirmado
4. O sistema libere automaticamente o acesso à calculadora

---

## ✅ PRÉ-REQUISITOS (O que você precisa ter)

- [ ] Conta no Stripe (se não tiver, crie em: https://dashboard.stripe.com/register)
- [ ] Node.js instalado (verifique com: `node --version`)
- [ ] Terminal aberto (Ctrl+Alt+T ou procure por "Terminal" no menu)
- [ ] Acesso sudo (para instalar o Stripe CLI, se necessário)

---

## 🚀 ETAPA 1: CRIAR CONTA NO STRIPE (se ainda não tiver)

### Passo 1.1: Criar a conta
1. Acesse: https://dashboard.stripe.com/register
2. Preencha seus dados
3. Confirme o email

### Passo 1.2: Ativar modo de teste
1. No canto superior direito, veja se está escrito "Test mode" (modo de teste)
2. Se estiver "Live mode", clique e mude para "Test mode"
3. ✅ Agora você está no modo de teste (seguro para testar)

---

## 🔑 ETAPA 2: OBTER A CHAVE SECRETA DO STRIPE

### Passo 2.1: Acessar as chaves
1. Acesse: https://dashboard.stripe.com/apikeys
2. Faça login se necessário

### Passo 2.2: Encontrar a chave secreta
1. Você verá uma seção chamada **"Secret keys"**
2. Procure por uma chave que começa com `sk_test_`
3. Ao lado dela, há um botão **"Reveal test key"** ou **"Reveal"**
4. Clique nesse botão

### Passo 2.3: Copiar a chave
1. A chave será revelada (algo como: `sk_test_51ABC123...`)
2. **COPIE A CHAVE COMPLETA** (clique com botão direito > Copiar, ou Ctrl+C)
3. ⚠️ **IMPORTANTE**: Guarde essa chave em um lugar seguro (você vai usar agora)

---

## 🔔 ETAPA 3: CONFIGURAR O WEBHOOK (Para detectar pagamentos)

### Opção A: Usando Stripe CLI (RECOMENDADO - Mais fácil)

#### Passo 3.1: Instalar Stripe CLI no Linux

**Método 1: Usando o instalador oficial (Recomendado)**

1. Abra o Terminal
2. Execute os seguintes comandos:

```bash
# Baixar o instalador
curl -s https://packages.stripe.com/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg

# Adicionar repositório
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.com/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list

# Atualizar e instalar
sudo apt update
sudo apt install stripe
```

**Método 2: Baixar binário direto**

1. Acesse: https://github.com/stripe/stripe-cli/releases/latest
2. Baixe o arquivo `stripe_X.X.X_linux_x86_64.tar.gz`
3. No terminal, execute:

```bash
# Ir para a pasta Downloads (ou onde baixou)
cd ~/Downloads

# Extrair o arquivo
tar -xzf stripe_*.tar.gz

# Mover para /usr/local/bin (ou outra pasta no PATH)
sudo mv stripe /usr/local/bin/

# Verificar se funcionou
stripe --version
```

**Método 3: Usando snap (se disponível)**

```bash
sudo snap install stripe
```

#### Passo 3.2: Fazer login no Stripe CLI
1. Abra o Terminal/Command Prompt
2. Execute:
```bash
stripe login
```
3. Uma página do navegador abrirá
4. Clique em "Allow access"
5. Volte ao terminal - você verá "Done!"

#### Passo 3.3: Iniciar o webhook local
1. No terminal, execute:
```bash
stripe listen --forward-to localhost:3001/api/webhook/stripe
```

2. Você verá algo assim:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
```

3. **COPIE O SECRET** que aparece (começa com `whsec_`)
4. ⚠️ **DEIXE ESSE TERMINAL ABERTO** enquanto testa

### Opção B: Configurar Webhook no Dashboard (Para produção)

> **Nota:** Use esta opção apenas quando estiver em produção. Para desenvolvimento, use a Opção A (Stripe CLI).

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em **"Add endpoint"**
3. Preencha:
   - **Endpoint URL**: `https://seu-dominio.com/api/webhook/stripe`
   - **Description**: "Calcularq Payment Webhook"
4. Selecione os eventos:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Clique em **"Add endpoint"**
6. Clique em **"Reveal"** ao lado de "Signing secret"
7. **COPIE O SECRET** (começa com `whsec_`)

---

## 📁 ETAPA 4: CRIAR O ARQUIVO .env NO SERVIDOR

### Passo 4.1: Navegar até a pasta do servidor
1. Abra o Terminal/Command Prompt
2. Execute:
```bash
cd "/home/ramon/Secretária/CALCARQ/server"
```

### Passo 4.2: Criar o arquivo .env
No terminal, execute:
```bash
touch .env
```

### Passo 4.3: Abrir o arquivo .env
Abra o arquivo `.env` com um editor de texto. Você pode usar:

**Opção 1: nano (editor simples no terminal)**
```bash
nano .env
```

**Opção 2: gedit (editor gráfico)**
```bash
gedit .env
```

**Opção 3: VS Code (se tiver instalado)**
```bash
code .env
```

**Opção 4: Criar diretamente com echo**
```bash
cat > .env << 'EOF'
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
EOF
```

Depois edite com `nano .env` para adicionar os valores.

### Passo 4.4: Colar as configurações
Cole o seguinte conteúdo no arquivo `.env`:

```env
STRIPE_SECRET_KEY=COLE_AQUI_A_CHAVE_QUE_VOCÊ_COPIOU_NA_ETAPA_2
STRIPE_WEBHOOK_SECRET=COLE_AQUI_O_SECRET_QUE_VOCÊ_COPIOU_NA_ETAPA_3
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

### Passo 4.5: Substituir pelos valores reais
1. Substitua `COLE_AQUI_A_CHAVE_QUE_VOCÊ_COPIOU_NA_ETAPA_2` pela chave que você copiou (começa com `sk_test_`)
2. Substitua `COLE_AQUI_O_SECRET_QUE_VOCÊ_COPIOU_NA_ETAPA_3` pelo secret que você copiou (começa com `whsec_`)
3. Salve o arquivo:
   - **nano**: Ctrl+O (salvar), Enter (confirmar), Ctrl+X (sair)
   - **gedit**: Ctrl+S
   - **VS Code**: Ctrl+S

**Exemplo de como deve ficar:**
```env
STRIPE_SECRET_KEY=sk_test_51ABC123xyz789...
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

---

## 📦 ETAPA 5: INSTALAR DEPENDÊNCIAS DO SERVIDOR

### Passo 5.1: Verificar se está na pasta correta
No terminal, você deve estar em: `/home/ramon/Secretária/CALCARQ/server`

Se não estiver, execute:
```bash
cd "/home/ramon/Secretária/CALCARQ/server"
```

### Passo 5.2: Instalar dependências
Execute:
```bash
npm install
```

Aguarde até terminar (pode levar alguns minutos).

---

## 🖥️ ETAPA 6: INICIAR O SERVIDOR BACKEND

### Passo 6.1: Iniciar o servidor
No terminal (ainda na pasta `server`), execute:
```bash
npm run dev
```

### Passo 6.2: Verificar se funcionou
Você deve ver algo assim:
```
🚀 Servidor rodando na porta 3001
📊 Health check: http://localhost:3001/health
🔔 Webhook: http://localhost:3001/api/webhook/stripe
```

✅ **Se apareceu isso, o servidor está funcionando!**

### Passo 6.3: DEIXAR ESSE TERMINAL ABERTO
⚠️ **IMPORTANTE**: Deixe esse terminal aberto e rodando. Abra um NOVO terminal para os próximos passos.

---

## 🎨 ETAPA 7: CONFIGURAR O FRONTEND

### Passo 7.1: Abrir novo terminal
Abra um **NOVO** terminal/Command Prompt (deixe o anterior rodando o servidor)

### Passo 7.2: Navegar para a pasta raiz do projeto
```bash
cd "/home/ramon/Secretária/CALCARQ"
```

### Passo 7.3: Verificar se existe arquivo .env na raiz
Execute:
```bash
ls -la .env
```

Se o arquivo não existir, você verá: `ls: cannot access '.env': No such file or directory`

### Passo 7.4: Criar arquivo .env na raiz (se não existir)
No terminal, execute:
```bash
touch .env
```

Ou crie diretamente com o conteúdo:
```bash
echo "VITE_API_URL=http://localhost:3001" > .env
```

Para verificar se foi criado corretamente:
```bash
cat .env
```

Deve mostrar: `VITE_API_URL=http://localhost:3001`

### Passo 7.5: Configurar a URL da API
Abra o arquivo `.env` na raiz do projeto e adicione:
```env
VITE_API_URL=http://localhost:3001
```

Salve o arquivo.

### Passo 7.6: Instalar dependências do frontend
No terminal (na pasta raiz), execute:
```bash
npm install
```

Aguarde até terminar.

---

## 🚀 ETAPA 8: INICIAR O FRONTEND

### Passo 8.1: Iniciar o frontend
No terminal (ainda na pasta raiz), execute:
```bash
npm run dev
```

### Passo 8.2: Verificar se funcionou
Você deve ver algo assim:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Se apareceu isso, o frontend está funcionando!**

### Passo 8.3: Abrir no navegador
1. Abra seu navegador
2. Acesse: http://localhost:5173
3. Você deve ver a página inicial do Calcularq

---

## 🧪 ETAPA 9: TESTAR O PAGAMENTO

### Passo 9.1: Criar uma conta de teste
1. No navegador, acesse: http://localhost:5173
2. Clique em "Login" ou "Cadastro"
3. Crie uma conta de teste (use qualquer email e senha)

### Passo 9.2: Acessar a página de pagamento
1. Após fazer login, você será redirecionado
2. Se não for redirecionado automaticamente, acesse: http://localhost:5173/payment
3. Você deve ver a página de pagamento

### Passo 9.3: Clicar em "Realizar Pagamento"
1. Clique no botão "Realizar Pagamento"
2. Uma nova janela abrirá com o checkout do Stripe

### Passo 9.4: Preencher dados de teste
Use estes dados de teste do Stripe:

**Número do cartão:**
```
4242 4242 4242 4242
```

**Data de expiração:**
```
Qualquer data futura (ex: 12/25)
```

**CVC:**
```
Qualquer 3 dígitos (ex: 123)
```

**CEP:**
```
Qualquer CEP válido (ex: 12345)
```

**Email:**
```
Use qualquer email (ex: teste@teste.com)
```

### Passo 9.5: Completar o pagamento
1. Preencha todos os campos
2. Clique em "Pagar" ou "Complete payment"
3. Aguarde alguns segundos

### Passo 9.6: Verificar se funcionou
1. Após o pagamento, você deve ser redirecionado automaticamente para a calculadora
2. Se não redirecionar em 10 segundos, verifique:
   - Se o terminal do Stripe CLI está rodando (Etapa 3.3)
   - Se o servidor backend está rodando (Etapa 6)
   - Abra o console do navegador (F12) para ver erros

---

## ✅ ETAPA 10: VERIFICAR SE ESTÁ TUDO FUNCIONANDO

### Passo 10.1: Verificar logs do servidor
No terminal onde o servidor está rodando, você deve ver mensagens como:
```
[2024-01-01T12:00:00.000Z] CHECKOUT_SESSION_COMPLETED: ...
[2024-01-01T12:00:01.000Z] PAYMENT_PROCESSED_SUCCESS: ...
```

### Passo 10.2: Verificar logs via API
1. Abra o navegador
2. Acesse: http://localhost:3001/api/logs
3. Você deve ver uma lista de eventos de pagamento

### Passo 10.3: Verificar status do usuário
1. Acesse: http://localhost:3001/api/user/SEU_USER_ID/payment-status
2. Substitua `SEU_USER_ID` pelo ID do seu usuário
3. Você deve ver: `{"hasPaid": true}`

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### Problema: "Cannot find module 'dotenv'"
**Solução:**
```bash
cd server
npm install
```

### Problema: "STRIPE_SECRET_KEY não configurado"
**Solução:**
1. Verifique se o arquivo `.env` está na pasta `server/`
2. Verifique se não há espaços antes ou depois do `=`
3. Verifique se copiou a chave completa

### Problema: "Webhook Error"
**Solução:**
1. Verifique se o Stripe CLI está rodando (Etapa 3.3)
2. Verifique se o `STRIPE_WEBHOOK_SECRET` está correto no `.env`
3. Reinicie o servidor backend

### Problema: Pagamento não é detectado
**Solução:**
1. Verifique se o Stripe CLI está rodando
2. Verifique se o servidor backend está rodando
3. Verifique os logs em: http://localhost:3001/api/logs
4. Aguarde até 30 segundos após o pagamento

### Problema: Frontend não conecta ao backend
**Solução:**
1. Verifique se o arquivo `.env` na raiz tem: `VITE_API_URL=http://localhost:3001`
2. Reinicie o frontend (Ctrl+C e `npm run dev` novamente)

### Problema: Porta já está em uso
**Solução:**
```bash
# Verificar qual processo está usando a porta 3001
sudo lsof -i :3001
# ou
sudo netstat -tulpn | grep 3001

# Matar o processo (substitua PID pelo número do processo)
sudo kill -9 PID
```

### Problema: Permissão negada ao executar scripts
**Solução:**
```bash
chmod +x verificar-configuracao.sh
chmod +x start-dev.sh
```

### Problema: Node.js não encontrado
**Solução:**
```bash
# Verificar se está instalado
node --version

# Se não estiver, instale:
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Ou use nvm (recomendado):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

---

## 📝 RESUMO DO QUE VOCÊ FEZ

✅ Criou conta no Stripe  
✅ Obteve a chave secreta (STRIPE_SECRET_KEY)  
✅ Configurou o webhook (STRIPE_WEBHOOK_SECRET)  
✅ Criou arquivo .env no servidor  
✅ Instalou dependências do servidor  
✅ Iniciou o servidor backend  
✅ Configurou o frontend  
✅ Iniciou o frontend  
✅ Testou o pagamento  
✅ Verificou que está funcionando  

---

## 🎉 PRONTO!

Agora o sistema está configurado e funcionando. Quando um usuário fizer um pagamento:
1. O Stripe processa o pagamento
2. O webhook notifica seu servidor
3. O servidor atualiza o status do usuário
4. O frontend detecta a mudança
5. O acesso à calculadora é liberado automaticamente!

---

## 🛠️ FERRAMENTA DE VERIFICAÇÃO

Execute este comando para verificar se tudo está configurado corretamente:

```bash
# Dar permissão de execução (se necessário)
chmod +x verificar-configuracao.sh

# Executar o script
./verificar-configuracao.sh
```

Este script verifica:
- ✅ Se Node.js está instalado
- ✅ Se os arquivos .env existem
- ✅ Se as chaves estão configuradas
- ✅ Se as dependências estão instaladas
- ✅ Se o Stripe CLI está instalado

**Nota:** Se o script não executar, verifique as permissões:
```bash
ls -l verificar-configuracao.sh
# Deve mostrar: -rwxr-xr-x (o 'x' significa executável)
```

---

## 📞 PRECISA DE AJUDA?

Se algo não funcionar:
1. Execute `./verificar-configuracao.sh` para diagnosticar problemas
2. Verifique se seguiu todos os passos
3. Verifique os logs do servidor
4. Verifique o console do navegador (F12)
5. Verifique os logs em: http://localhost:3001/api/logs

