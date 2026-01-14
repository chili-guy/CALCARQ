# 🚨 Solução: Timeout com Umbler SMTP

## Problema

O Railway está dando **timeout ao tentar conectar** no servidor SMTP da Umbler. Isso geralmente significa:

1. **Railway bloqueia conexões SMTP** (comum em alguns provedores)
2. **Umbler tem restrições de IP** (só aceita conexões de IPs específicos)
3. **Servidor SMTP não está acessível** do Railway

---

## ✅ Solução Recomendada: Usar SendGrid

A **melhor solução** é usar **SendGrid** ao invés da Umbler:

### Por quê SendGrid?
- ✅ **Funciona perfeitamente no Railway** (sem bloqueios)
- ✅ **Gratuito** (100 emails/dia)
- ✅ **Mais confiável** para produção
- ✅ **Configuração simples** (5 minutos)
- ✅ **Melhor documentação**

### Como Configurar SendGrid:

1. **Criar conta:** https://signup.sendgrid.com/ (plano Free)
2. **Criar API Key:** Settings → API Keys → Create API Key
3. **Configurar no Railway:**

```
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = apikey
SMTP_PASS = SG.sua_api_key_aqui
SMTP_FROM = atendimento@calcularq.com.br
```

**Pronto!** SendGrid funciona imediatamente no Railway.

---

## 🔧 Alternativa: Verificar com Umbler

Se você **precisa** usar a Umbler, entre em contato com suporte:

### Perguntas para o Suporte Umbler:

1. **O servidor SMTP está acessível externamente?**
   - Alguns provedores bloqueiam conexões de fora

2. **Há restrições de IP?**
   - Railway usa IPs dinâmicos, pode ser bloqueado

3. **Qual é o servidor SMTP correto?**
   - Pode ser diferente de `smtp.umbler.com`

4. **Precisa de configuração especial?**
   - Alguns provedores precisam de whitelist de IP

5. **Há firewall bloqueando?**
   - Railway pode estar em uma rede bloqueada

---

## 🧪 Teste Local (Para Verificar)

Se quiser testar se a Umbler funciona localmente:

1. **Configure as variáveis no `.env` local**
2. **Teste do seu computador** (não do Railway)
3. **Se funcionar localmente mas não no Railway:**
   - Confirma que é bloqueio de rede/firewall
   - Railway não consegue acessar a Umbler

---

## 💡 Por que SendGrid é Melhor

| Característica | Umbler | SendGrid |
|----------------|--------|----------|
| Funciona no Railway | ❌ Timeout | ✅ Sim |
| Gratuito | ✅ Sim | ✅ Sim (100/dia) |
| Confiável | ⚠️ Depende | ✅ Muito |
| Documentação | ⚠️ Limitada | ✅ Excelente |
| Suporte | ⚠️ Limitado | ✅ Bom |

---

## 🎯 Recomendação Final

**Use SendGrid!** É a solução mais rápida e confiável:

1. **5 minutos para configurar**
2. **Funciona imediatamente no Railway**
3. **Gratuito e adequado para produção**
4. **Sem problemas de timeout**

**Guia completo:** Veja `SMTP_PRODUCAO_GRATIS.md` ou `CONFIGURAR_SENDGRID_AGORA.md`

---

## 📝 Se Insistir na Umbler

Se realmente precisa usar Umbler:

1. **Entre em contato com suporte Umbler**
2. **Pergunte sobre acesso SMTP externo**
3. **Pergunte sobre whitelist de IP**
4. **Considere usar API de email da Umbler** (se tiver)

Mas **SendGrid é muito mais simples e confiável!** 🚀





