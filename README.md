# Calcularq

Calculadora inteligente de precificação para projetos de arquitetura.

## 🚀 Deploy no Vercel

### Opção 1: Deploy via Interface Web (Recomendado)

1. **Acesse [vercel.com](https://vercel.com)** e faça login (ou crie uma conta)

2. **Conecte seu repositório:**
   - Clique em "Add New Project"
   - Conecte seu repositório Git (GitHub, GitLab ou Bitbucket)
   - Ou faça upload do projeto diretamente

3. **Configure o projeto:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (já configurado)
   - Output Directory: `dist` (já configurado)
   - Install Command: `npm install` (já configurado)

4. **Clique em "Deploy"**

### Opção 2: Deploy via CLI

1. **Instale a CLI da Vercel:**
   ```bash
   npm i -g vercel
   ```

2. **No diretório do projeto, execute:**
   ```bash
   vercel
   ```

3. **Siga as instruções:**
   - Faça login na Vercel
   - Confirme as configurações
   - Aguarde o deploy

4. **Para produção:**
   ```bash
   vercel --prod
   ```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção

## 🛠️ Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM

## 📝 Notas

- O arquivo `vercel.json` já está configurado para SPA (Single Page Application)
- Todas as rotas são redirecionadas para `index.html` para funcionar com React Router
- O domínio configurado é: **calcularq.com.br**
