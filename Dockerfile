FROM node:20

RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]