# 📊 Como Ver os Logs na Vercel

## 🔍 Passo a Passo para Ver os Logs

### 1. Acessar o Dashboard da Vercel

1. Acesse: **https://vercel.com/dashboard**
2. Faça login se necessário
3. Clique no seu projeto (`calcarq-web` ou o nome que você deu)

### 2. Ver Logs do Deploy

1. Na página do projeto, vá em **"Deployments"**
2. Clique no **último deploy** (o mais recente)
3. Você verá várias abas:
   - **Overview**
   - **Build Logs**
   - **Functions**
   - **Analytics**

### 3. Ver Logs da Function do Webhook

1. Clique na aba **"Functions"**
2. Procure por: **`api/webhook/stripe`**
3. Clique nele
4. Você verá:
   - **Logs** - Logs em tempo real
   - **Metrics** - Métricas de performance

### 4. Ver Logs em Tempo Real

1. Na página da function, clique em **"Logs"**
2. Você verá todos os logs
3. **Filtre por:**
   - Últimas 24 horas
   - Última hora
   - Últimos 15 minutos

### 5. O Que Procurar nos Logs

**Logs de sucesso:**
```
=== WEBHOOK RECEBIDO ===
Method: POST
Verificando assinatura do Stripe...
Assinatura verificada com sucesso
Processando evento: checkout.session.completed
Checkout session completed: { sessionId: '...', userId: '...' }
Pagamento confirmado, atualizando usuário: ...
Usuário atualizado com sucesso
=== WEBHOOK PROCESSADO COM SUCESSO ===
```

**Logs de erro:**
```
Erro ao verificar webhook: ...
Erro ao processar body: ...
Erro ao atualizar pagamento: ...
```

---

## 🧪 Testar e Ver Logs

### 1. Fazer Pagamento de Teste

1. Acesse sua aplicação
2. Faça um pagamento de teste
3. Use cartão: `4242 4242 4242 4242`

### 2. Ver Logs Imediatamente

1. Vá para os logs da Vercel (seguindo passos acima)
2. Você verá os logs aparecendo em tempo real
3. Procure por `=== WEBHOOK RECEBIDO ===`

### 3. Copiar Logs de Erro

Se houver erro:
1. Selecione as linhas de erro
2. Copie (Ctrl+C)
3. Me envie para eu analisar

---

## 📸 Screenshot dos Logs

Para me ajudar a debugar, tire screenshot:

1. **Tela completa dos logs** (últimas 20-30 linhas)
2. **Especialmente as linhas com erro** (se houver)
3. **Linhas que começam com `===`** (logs de debug)

---

## 🔍 Filtros Úteis

Nos logs da Vercel, você pode:
- **Buscar** por palavras-chave (ex: "WEBHOOK", "ERROR")
- **Filtrar por nível** (Error, Warning, Info)
- **Ver logs em tempo real** (atualiza automaticamente)

---

## 📝 Exemplo de Logs Esperados

**Sucesso:**
```
[2025-12-25T17:10:00.000Z] WEBHOOK_VERIFIED: {"eventType":"checkout.session.completed"}
[2025-12-25T17:10:00.100Z] CHECKOUT_SESSION_COMPLETED: {"sessionId":"cs_...","userId":"1766554733325"}
[2025-12-25T17:10:00.200Z] PAYMENT_PROCESSED_SUCCESS: {"userId":"1766554733325"}
```

**Erro:**
```
[2025-12-25T17:10:00.000Z] WEBHOOK_VERIFICATION_ERROR: {"error":"No signatures found..."}
```

---

## 🆘 Se Não Ver Logs

1. **Verifique se o deploy foi concluído**
2. **Aguarde alguns segundos** após o pagamento
3. **Atualize a página** dos logs
4. **Verifique se está na function correta** (`api/webhook/stripe`)

---

**Com esses logs detalhados, vamos conseguir identificar exatamente o problema!** 🔍




