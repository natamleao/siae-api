FROM node:18

# Instala pnpm
RUN npm install -g pnpm

# Diretório da aplicação
WORKDIR /app

# Copia arquivos de dependência
COPY package.json pnpm-lock.yaml ./

# Instala dependências
RUN pnpm install

# Copia o resto do projeto
COPY . .

# Gera Prisma Client
RUN npx prisma generate

# Compila TypeScript
RUN pnpm build

# Expõe a porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/app.js"]