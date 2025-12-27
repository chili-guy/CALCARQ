# 🐧 Comandos Úteis para Linux

## 📋 Comandos Básicos

### Navegação
```bash
# Ir para a pasta do projeto
cd "/home/ramon/Secretária/CALCARQ"

# Ver onde você está
pwd

# Listar arquivos
ls -la

# Ver conteúdo de um arquivo
cat arquivo.txt

# Editar arquivo
nano arquivo.txt
# Salvar no nano: Ctrl+O, Enter, Ctrl+X
```

### Criar arquivos
```bash
# Criar arquivo vazio
touch arquivo.txt

# Criar arquivo com conteúdo
echo "conteúdo" > arquivo.txt

# Adicionar conteúdo ao arquivo
echo "mais conteúdo" >> arquivo.txt
```

### Verificar processos
```bash
# Ver processos rodando na porta 3001
sudo lsof -i :3001
# ou
sudo netstat -tulpn | grep 3001

# Ver processos do Node.js
ps aux | grep node

# Matar processo (substitua PID pelo número)
kill PID
# ou forçar
kill -9 PID
```

### Permissões
```bash
# Dar permissão de execução
chmod +x script.sh

# Ver permissões
ls -l arquivo.sh
```

## 🔧 Comandos Específicos do Projeto

### Verificar configuração
```bash
cd "/home/ramon/Secretária/CALCARQ"
chmod +x verificar-configuracao.sh
./verificar-configuracao.sh
```

### Instalar dependências
```bash
# Frontend
cd "/home/ramon/Secretária/CALCARQ"
npm install

# Backend
cd "/home/ramon/Secretária/CALCARQ/server"
npm install
```

### Iniciar servidores
```bash
# Backend (Terminal 1)
cd "/home/ramon/Secretária/CALCARQ/server"
npm run dev

# Frontend (Terminal 2)
cd "/home/ramon/Secretária/CALCARQ"
npm run dev

# Stripe CLI (Terminal 3)
stripe listen --forward-to localhost:3001/api/webhook/stripe
```

### Parar servidores
```bash
# No terminal onde está rodando, pressione:
Ctrl+C
```

## 🐛 Solução de Problemas

### Verificar se Node.js está instalado
```bash
node --version
npm --version
```

### Verificar se Stripe CLI está instalado
```bash
stripe --version
```

### Ver logs do servidor
```bash
# Se estiver usando o script start-dev.sh
tail -f server.log

# Ou ver diretamente no terminal onde está rodando
```

### Verificar arquivos .env
```bash
# Ver conteúdo do .env do servidor
cat server/.env

# Ver conteúdo do .env da raiz
cat .env
```

### Limpar cache do npm
```bash
npm cache clean --force
```

### Reinstalar dependências
```bash
# Remover node_modules
rm -rf node_modules
rm -rf server/node_modules

# Reinstalar
npm install
cd server && npm install
```

## 📝 Dicas

### Abrir múltiplos terminais
- **Ctrl+Alt+T**: Abre novo terminal
- **Ctrl+Shift+T**: Nova aba no terminal atual
- **Ctrl+PageUp/PageDown**: Alternar entre abas

### Copiar/colar no terminal
- **Ctrl+Shift+C**: Copiar
- **Ctrl+Shift+V**: Colar
- Ou botão direito do mouse

### Autocompletar
- **Tab**: Autocompletar nomes de arquivos/pastas
- **Tab Tab**: Mostrar opções disponíveis

### Histórico de comandos
- **Seta para cima**: Comando anterior
- **Ctrl+R**: Buscar no histórico
- **history**: Ver histórico completo




