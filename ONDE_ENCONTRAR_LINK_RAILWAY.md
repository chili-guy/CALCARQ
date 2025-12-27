# 🔗 Onde Encontrar o Link do Projeto no Railway

## 📍 3 Formas de Encontrar a URL

### 1️⃣ Na Página Principal do Projeto (Mais Fácil)

1. Acesse: https://railway.app
2. Clique no seu projeto **CALCARQ**
3. Na parte superior da página, procure por:
   - **"Networking"** ou
   - **"Domains"** ou
   - **"Public Domain"**
4. Você verá algo como:
   ```
   https://CALCARQ-production.up.railway.app
   ```
   ou
   ```
   https://CALCARQ.railway.app
   ```

### 2️⃣ Em Settings → Networking

1. No projeto Railway, clique em **"Settings"** (⚙️ ícone de engrenagem)
2. No menu lateral, clique em **"Networking"** ou **"Domains"**
3. Você verá:
   - Domínios existentes
   - Botão **"Generate Domain"** (se não tiver domínio)
4. Copie a URL que aparece

### 3️⃣ No Deploy Ativo

1. No projeto Railway, vá em **"Deployments"**
2. Clique no deploy mais recente (que está rodando)
3. Na parte superior da página do deploy, você verá:
   - **"Service URL"** ou
   - **"Public URL"**
4. Copie essa URL

---

## 🆕 Se Não Tiver Domínio Ainda

### Gerar Domínio Público

1. Railway → Seu Projeto → **"Settings"**
2. **"Networking"** ou **"Domains"**
3. Clique em **"Generate Domain"** ou **"Add Domain"**
4. O Railway vai gerar automaticamente uma URL como:
   - `https://CALCARQ-production.up.railway.app`
   - ou `https://CALCARQ.railway.app`

---

## 📝 Formato das URLs do Railway

As URLs do Railway geralmente seguem este padrão:

```
https://[nome-do-projeto]-[hash].up.railway.app
```

ou

```
https://[nome-do-projeto].railway.app
```

**Exemplos:**
- `https://CALCARQ-production.up.railway.app`
- `https://calcarq-abc123.up.railway.app`
- `https://CALCARQ.railway.app`

---

## ✅ Depois de Encontrar a URL

Use essa URL para:

1. **Atualizar `FRONTEND_URL`** nas variáveis de ambiente:
   ```
   FRONTEND_URL=https://CALCARQ-production.up.railway.app
   ```

2. **Configurar Webhook no Stripe**:
   ```
   https://CALCARQ-production.up.railway.app/api/webhook/stripe
   ```

3. **Acessar seu site**:
   ```
   https://CALCARQ-production.up.railway.app
   ```

---

## 🖼️ Onde Procurar Visualmente

### Na Página do Projeto:
```
┌─────────────────────────────────────┐
│  CALCARQ                            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Networking                    │ │
│  │ https://CALCARQ.up.railway.app│ │ ← AQUI!
│  └───────────────────────────────┘ │
│                                     │
│  Deployments | Settings | Variables │
└─────────────────────────────────────┘
```

### Em Settings → Networking:
```
Settings
├── General
├── Networking  ← CLIQUE AQUI
│   └── Public Domain: https://CALCARQ.up.railway.app
├── Variables
└── ...
```

---

## 💡 Dica

Se você não encontrar a URL em nenhum lugar, significa que:
1. O deploy ainda não terminou (aguarde alguns minutos)
2. O domínio ainda não foi gerado (clique em "Generate Domain")

---

**Última atualização**: Janeiro 2025


