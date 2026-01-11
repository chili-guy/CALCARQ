# 🔧 Troubleshooting: Timeout ao Enviar Email SMTP

## Problema Identificado

O log mostra:
```
❌ Erro ao enviar email: Error: Timeout ao enviar email (30s)
FORGOT_PASSWORD_EMAIL_ERROR: { error: 'Timeout ao enviar email (30s)' }
```

Isso significa que o servidor SMTP **não está respondendo** ou há problema de conexão/autenticação.

---

## 🔍 Possíveis Causas

### 1. Credenciais SMTP Incorretas
- **Sintoma:** Timeout ao tentar autenticar
- **Solução:** Verifique `SMTP_USER` e `SMTP_PASS` no Railway

### 2. Servidor SMTP Incorreto
- **Sintoma:** Não consegue conectar
- **Solução:** Verifique se `SMTP_HOST` está correto

### 3. Porta Bloqueada
- **Sintoma:** Timeout na conexão
- **Solução:** Verifique se a porta `587` está correta para Umbler

### 4. Firewall/Rede Bloqueando
- **Sintoma:** Timeout na conexão
- **Solução:** Railway pode estar bloqueando conexões SMTP

### 5. Configuração Umbler Diferente
- **Sintoma:** Timeout mesmo com credenciais corretas
- **Solução:** Verifique se precisa de configuração especial

---

## ✅ Verificações Necessárias

### 1. Verificar Variáveis no Railway

Confirme que estão EXATAMENTE assim:

```
SMTP_HOST = smtp.umbler.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = atendimento@calcularq.com.br
SMTP_PASS = Milnara.2001
SMTP_FROM = atendimento@calcularq.com.br
```

**⚠️ IMPORTANTE:**
- Sem espaços extras
- Sem aspas
- Valores exatos

### 2. Verificar no Painel da Umbler

1. Acesse o painel da Umbler
2. Vá em **"Email"** ou **"E-mails"**
3. Verifique:
   - Se o email `atendimento@calcularq.com.br` está ativo
   - Se a senha está correta
   - Se há alguma restrição de acesso

### 3. Testar Conexão SMTP

A Umbler pode ter restrições de IP ou precisar de configuração especial.

---

## 🔧 Soluções

### Solução 1: Verificar Credenciais

1. **No Railway, verifique cada variável:**
   - `SMTP_USER` deve ser: `atendimento@calcularq.com.br` (sem espaços)
   - `SMTP_PASS` deve ser: `Milnara.2001` (exatamente assim)
   - `SMTP_HOST` deve ser: `smtp.umbler.com`
   - `SMTP_PORT` deve ser: `587` (número, não string)

2. **Reinicie o deploy** após verificar

### Solução 2: Tentar Porta 465 (SSL)

Se porta 587 não funcionar, tente 465:

```
SMTP_HOST = smtp.umbler.com
SMTP_PORT = 465
SMTP_SECURE = true
SMTP_USER = atendimento@calcularq.com.br
SMTP_PASS = Milnara.2001
SMTP_FROM = atendimento@calcularq.com.br
```

### Solução 3: Verificar com Suporte Umbler

Entre em contato com suporte da Umbler e pergunte:
- Servidor SMTP correto
- Porta correta
- Se há restrições de IP
- Se precisa de configuração especial para aplicações

### Solução 4: Usar SendGrid (Alternativa)

Se a Umbler continuar dando timeout, considere usar SendGrid:
- Mais confiável para produção
- Configuração mais simples
- Melhor documentação

---

## 🧪 Teste Rápido

### 1. Verificar Logs de Inicialização

Quando o servidor inicia, você deve ver:
```
📧 Configurando SMTP: { host: 'smtp.umbler.com', port: 587, ... }
```

Se não aparecer, as variáveis não estão sendo carregadas.

### 2. Verificar Logs ao Tentar Enviar

Você deve ver:
```
📧 Iniciando envio de email...
📧 Configuração: { to: '...', from: '...', host: '...', port: '...' }
```

Se aparecer timeout, o problema é na conexão SMTP.

---

## 📞 Próximos Passos

1. **Verifique as variáveis no Railway** (sem espaços, valores exatos)
2. **Verifique no painel da Umbler** se o email está ativo
3. **Tente porta 465 com SSL** se 587 não funcionar
4. **Entre em contato com suporte da Umbler** se persistir
5. **Considere usar SendGrid** como alternativa

---

## 💡 Dica

**Timeout geralmente significa:**
- Credenciais incorretas (tentando autenticar e falhando)
- Servidor não acessível (host/porta errados)
- Firewall bloqueando (Railway pode ter restrições)

**Verifique primeiro as credenciais e depois a conectividade!**



