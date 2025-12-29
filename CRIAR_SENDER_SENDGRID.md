# 📧 Como Criar Sender no SendGrid

O SendGrid exige criar um "Sender" (remetente) para compliance com leis anti-spam (CAN-SPAM, CASL). É obrigatório e simples!

---

## 📋 Como Preencher o Formulário

### 1. **From Name** (Nome do Remetente)
```
Calcularq
```
ou
```
Calcularq - Calculadora de Precificação
```
**O que é:** Nome que aparecerá como remetente no email  
**Exemplo:** Quando o usuário receber o email, verá "Calcularq" como remetente

---

### 2. **From Email Address** (Email do Remetente)
```
noreply@calcarq.com.br
```
ou
```
contato@calcarq.com.br
```
ou (se não tiver domínio próprio):
```
seu_email_pessoal@gmail.com
```

**⚠️ IMPORTANTE:**
- Use um email que você tenha acesso
- Você receberá um email de verificação neste endereço
- Este será o email usado no `SMTP_FROM`
- Se usar Gmail pessoal, pode funcionar, mas é melhor usar um domínio próprio

**O que é:** Email que aparecerá como remetente

---

### 3. **Reply To** (Email para Respostas)
```
atendimento.calcularq@gmail.com
```
ou
```
contato@calcarq.com.br
```

**O que é:** Email para onde as respostas serão enviadas  
**Dica:** Use o mesmo email de atendimento que você já tem

---

### 4. **Company Address** (Endereço da Empresa - Linha 1)
```
Rua Exemplo, 123
```
ou
```
Av. Principal, 456
```

**O que é:** Endereço físico da empresa (obrigatório por lei)  
**Dica:** Use seu endereço real ou o endereço onde você trabalha

---

### 5. **Company Address Line 2** (Endereço - Linha 2)
```
Sala 101
```
ou
```
Apto 302
```
ou deixe em branco se não precisar

**O que é:** Complemento do endereço (opcional)

---

### 6. **City** (Cidade)
```
São Paulo
```
ou sua cidade

**O que é:** Cidade onde a empresa está localizada

---

### 7. **State** (Estado)
```
São Paulo
```
ou seu estado

**O que é:** Estado onde a empresa está localizada

---

### 8. **Zip Code** (CEP)
```
01234-567
```
ou seu CEP

**O que é:** CEP do endereço

---

### 9. **Country** (País)
```
Brazil
```
ou
```
Brasil
```

**O que é:** País onde a empresa está localizada

---

### 10. **Nickname** (Apelido/Nome)
```
Calcularq Sender
```
ou
```
Remetente Principal
```

**O que é:** Nome interno para identificar este remetente (só você vê)  
**Dica:** Pode ser qualquer nome que te ajude a identificar

---

## ✅ Exemplo Completo Preenchido

```
From Name: Calcularq
From Email Address: contato@calcarq.com.br
Reply To: atendimento.calcularq@gmail.com
Company Address: Rua Exemplo, 123
Company Address Line 2: (deixe em branco ou "Sala 101")
City: São Paulo
State: São Paulo
Zip Code: 01234-567
Country: Brazil
Nickname: Calcularq Sender
```

---

## 🔍 O que Acontece Depois?

1. **SendGrid enviará um email de verificação** para o endereço que você colocou em "From Email Address"

2. **Você precisa verificar o email:**
   - Abra sua caixa de entrada
   - Procure email do SendGrid
   - Clique no link de verificação
   - Ou copie o código e cole no SendGrid

3. **Após verificar:**
   - O Sender estará ativo
   - Você poderá usar esse email no `SMTP_FROM`
   - Pode começar a enviar emails

---

## ⚠️ Dicas Importantes

### Se você NÃO tem domínio próprio:
- ✅ Pode usar seu email pessoal (Gmail, Outlook, etc.)
- ✅ O SendGrid enviará verificação para esse email
- ✅ Funciona perfeitamente para começar
- ⚠️ Mas é melhor usar domínio próprio depois (melhor reputação)

### Se você TEM domínio próprio:
- ✅ Use um email do seu domínio (ex: `noreply@calcarq.com.br`)
- ✅ Configure DNS do domínio no SendGrid (Domain Authentication)
- ✅ Melhor reputação e entrega
- ✅ Mais profissional

### Email de Verificação:
- 📧 Você receberá um email do SendGrid
- 🔗 Clique no link ou copie o código
- ✅ Verifique para ativar o Sender

---

## 🎯 Passo a Passo Rápido

1. **Preencha o formulário** com os dados acima
2. **Clique em "Create"** ou "Save"
3. **Verifique seu email** (caixa de entrada ou spam)
4. **Clique no link de verificação** do SendGrid
5. **Pronto!** O Sender está ativo
6. **Use esse email no `SMTP_FROM`** no Railway

---

## 📝 Depois de Criar o Sender

### Atualizar no Railway:

Depois que o Sender estiver verificado, atualize a variável:

```
SMTP_FROM = contato@calcarq.com.br
```
(Use o mesmo email que você colocou em "From Email Address")

---

## ❓ FAQ

**P: Preciso ter domínio próprio?**  
R: Não! Pode usar email pessoal, mas domínio próprio é melhor.

**P: O email de verificação não chegou?**  
R: Verifique a pasta de spam. Pode demorar alguns minutos.

**P: Posso mudar depois?**  
R: Sim! Pode criar novos Senders quando quiser.

**P: Preciso colocar endereço real?**  
R: Sim, é obrigatório por lei anti-spam, mas pode ser seu endereço pessoal se trabalhar de casa.

**P: O que acontece se não criar?**  
R: Não conseguirá enviar emails. É obrigatório.

---

## 🚀 Resumo

1. **Preencha o formulário** com seus dados
2. **Use um email que você tem acesso** (para verificação)
3. **Verifique o email** que o SendGrid enviar
4. **Use esse email no `SMTP_FROM`** no Railway
5. **Pronto!** Pode enviar emails

**Dica:** Se não tiver domínio próprio, use seu email pessoal por enquanto. Funciona perfeitamente! ✅


