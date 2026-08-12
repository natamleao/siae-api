FROM node:20-alpine

# Instala pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm prisma generate

# Adicionei a porta do Prisma Studio
EXPOSE 3000 5555  

CMD ["pnpm", "dev"]