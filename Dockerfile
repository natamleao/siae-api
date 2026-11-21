# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

# Dependências
FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Desenvolvimento
FROM dependencies AS development

COPY . .

RUN pnpm exec prisma generate

EXPOSE 3000

CMD ["pnpm", "dev"]

# Compilação
FROM dependencies AS build

COPY . .

RUN pnpm exec prisma generate
RUN pnpm build
RUN pnpm prune --prod

# Produção
FROM base AS production

ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build --chown=node:node /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

USER node

EXPOSE 3000

CMD ["node", "dist/app.js"]
