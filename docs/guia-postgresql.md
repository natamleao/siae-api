# Guia de configuração do PostgreSQL

Este guia apresenta três cenários de utilização do banco de dados no SIAE:

1. **Docker (recomendado):** API e PostgreSQL executados em containers.
2. **Ambiente local:** API e PostgreSQL executados diretamente na máquina.
3. **pgAdmin:** acesso visual ao PostgreSQL executado no Docker.

Também há uma seção sobre aplicação de migrations no banco de produção (Supabase).

---

## 1. Pré-requisitos

### Para utilizar Docker

- Git
- Docker
- Docker Compose

### Para executar sem Docker

- Node.js 22
- pnpm 10.18.3
- PostgreSQL

---

## 2. Fluxo recomendado: API e PostgreSQL no Docker

### 2.1. Clonar o repositório

```bash
git clone https://github.com/devsiae-ludi/siae-api.git
cd siae-api
````

### **2.2. Configurar as variáveis de ambiente**

Crie o arquivo `.env` na raiz do projeto, utilizando `.env-example` como referência.

A variável `DATABASE_URL` deve apontar para a porta exposta pelo Docker na máquina:

```
DATABASE_URL="postgresql://siae_user:siae_password@localhost:5433/siae_db?schema=public"
```

Configure também as demais variáveis necessárias:

- `CORS_ORIGIN`
- `NODE_ENV`
- `JWT_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`

Para executar o seed inicial, configure também as quatro variáveis:

```
SEED_ADMIN_EMAIL=admin@siae.br
SEED_ADMIN_PASSWORD=sua_senha_segura
SEED_ALUNO_ADMIN_EMAIL=alunoadmin@siae.br
SEED_ALUNO_ADMIN_PASSWORD=outra_senha_segura
```

As duas senhas devem ter pelo menos 12 caracteres. Os endereços de e-mail devem ser diferentes.

**Importante:** o arquivo `.env` contém informações privadas e não deve ser enviado ao Git.

### **2.3. Iniciar os containers**

Na raiz do projeto, execute:

```
docker compose up -d --build
```

O Docker iniciará:

- PostgreSQL, no container `siae-postgres`;
- API, no container `siae-api`.

A API utiliza a URL interna `postgres:5432` para se comunicar com o banco. Já os comandos executados diretamente na máquina utilizam `localhost:5433`.

O projeto não cria ou altera automaticamente as tabelas ao iniciar os containers. É necessário aplicar as migrations.

### **2.4. Aplicar as migrations**

Execute:

```
docker exec -it siae-api pnpm db:migrate:deploy
```

Esse comando aplica as migrations existentes no diretório `prisma/migrations`.

Para verificar o estado das migrations:

```
docker exec -it siae-api pnpm db:migrate:status
```

### **2.5. Criar os usuários e dados iniciais**

Depois de aplicar as migrations, execute:

```
docker exec -it siae-api pnpm seed
```

O seed inicial cria:

- Usuário administrador (`ADMIN`);
- Usuário administrador de alunos (`ALUNO_ADMIN`);
- Registro de aluno associado ao usuário `ALUNO_ADMIN`;
- Auxílios iniciais do sistema.

O seed utiliza as quatro variáveis `SEED_*` configuradas no `.env`.

Ele pode ser executado novamente sem duplicar os registros existentes. Entretanto, não altera as senhas dos usuários já cadastrados.

### **2.6. Acessar a API**

A API estará disponível em:

```
http://localhost:3000
```

### **2.7. Abrir o Prisma Studio**

Para visualizar e manipular os dados do banco:

```
docker exec -it siae-api pnpm exec prisma studio --hostname 0.0.0.0 --port 5555
```

Acesse:

```
http://localhost:5555
```

### **2.8. Verificar a conexão com PostgreSQL**

Execute:

```
docker exec -it siae-postgres psql -U siae_user -d siae_db -c "SELECT 1;"
```

Se a conexão estiver funcionando, o PostgreSQL retornará o resultado da consulta.

## **3. Fluxo alternativo: execução totalmente local**

Neste cenário, a API e o PostgreSQL são executados diretamente na máquina, sem containers.

### **3.1. Criar o banco de dados**

Certifique-se de que o serviço PostgreSQL esteja em execução.

Acesse o PostgreSQL:

```
psql -U postgres
```

Crie o banco:

```
CREATE DATABASE siae_db;
```

Se desejar utilizar um usuário específico para o projeto:

```
CREATE USER siae_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE siae_db TO siae_user;
ALTER DATABASE siae_db OWNER TO siae_user;
```

### **3.2. Configurar o&#x20;**`.env`

Para utilizar o PostgreSQL local, configure a URL de conexão com a porta correspondente à instalação local.

Exemplo utilizando o usuário `postgres`:

```
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/siae_db?schema=public"
```

Se estiver utilizando o usuário `siae_user`:

```
DATABASE_URL="postgresql://siae_user:SUA_SENHA@localhost:5432/siae_db?schema=public"
```

Configure também as demais variáveis de ambiente, incluindo as quatro variáveis `SEED_*` necessárias para o seed inicial.

### **3.3. Instalar dependências**

Na raiz do projeto:

```
pnpm install
```

### **3.4. Gerar o Prisma Client**

```
pnpm db:generate
```

### **3.5. Aplicar as migrations**

```
pnpm db:migrate:deploy
```

### **3.6. Executar o seed**

Depois que as migrations forem aplicadas:

```
pnpm seed
```

### **3.7. Iniciar a API**

```
pnpm dev
```

A API estará disponível em:

```
http://localhost:3000
```

### **3.8. Abrir o Prisma Studio**

```
pnpm exec prisma studio
```

Acesse:

```
http://localhost:5555
```

## **4. Acessar o PostgreSQL do Docker pelo pgAdmin**

Também é possível utilizar o pgAdmin ou DBeaver para acessar visualmente o banco executado no Docker.

Ao cadastrar um novo servidor, preencha os campos de conexão:

| Campo                | Valor                               |
| -------------------- | ----------------------------------- |
| Host name/address    | `localhost`                         |
| Port                 | `5433`                              |
| Maintenance database | `siae_db`                           |
| Username             | `siae_user`                         |
| Password             | Valor configurado no Docker Compose |

**Atenção:** a porta `5433` é a porta externa da máquina. Dentro da rede Docker, a porta do PostgreSQL continua sendo `5432`.

## **5. Gerenciamento de migrations**

O projeto utiliza Prisma Migrate para controlar as alterações no esquema do banco.

Os comandos disponíveis são:

| Comando                  | Finalidade                                         |
| ------------------------ | -------------------------------------------------- |
| `pnpm db:generate`       | Gera o Prisma Client                               |
| `pnpm db:migrate:dev`    | Cria e aplica migrations durante o desenvolvimento |
| `pnpm db:migrate:deploy` | Aplica migrations existentes                       |
| `pnpm db:migrate:status` | Verifica o estado das migrations                   |

### **5.1. Criar uma nova migration**

Quando houver uma alteração no arquivo `prisma/schema.prisma`, crie uma migration com:

```
pnpm db:migrate:dev --name descricao_da_alteracao
```

Esse comando deve ser executado na raiz do projeto, com o banco de desenvolvimento disponível e a variável `DATABASE_URL` apontando para ele.

Se estiver utilizando Docker, execute dentro do container da API:

```
docker exec -it siae-api pnpm db:migrate:dev --name descricao_da_alteracao
```

As migrations são armazenadas em `prisma/migrations` e devem ser versionadas no Git.

### **5.2. Aplicar migrations existentes**

Para ambientes que já possuem as migrations versionadas, utilize:

```
pnpm db:migrate:deploy
```

Esse é o comando utilizado para preparar o banco em ambientes de implantação.

**Não utilize `prisma db push` como substituto do fluxo de migrations do projeto.**

## 6. Banco de produção: Supabase

O ambiente de produção utiliza PostgreSQL hospedado no Supabase. A URL de conexão é configurada nas variáveis de ambiente do backend no Render.

### 6.1. Tipo de conexão

Para executar migrations, utilize a conexão **Session Pooler** do Supabase.

Não utilize a conexão Transaction Pooler neste procedimento.

A URL de produção é uma credencial privada e nunca deve ser versionada no Git.

### 6.2. Aplicar migrations em produção

As migrations devem ser aplicadas somente depois de confirmar que o container de execução contém a versão correta do projeto e os arquivos de migration necessários.

Neste projeto, o procedimento pode ser realizado por meio do container de teste `siae-api-production-test`.

Primeiro, solicite a URL do Session Pooler sem exibi-la no terminal:

```bash
read -rsp "URL do Supabase (Session Pooler): " SUPABASE_DATABASE_URL
echo
```

Verifique o estado das migrations no banco de produção:

```bash
docker exec \
  -e DATABASE_URL="$SUPABASE_DATABASE_URL" \
  siae-api-production-test \
  pnpm db:migrate:status
```

Se o destino estiver correto e as migrations pendentes forem as esperadas, aplique-as:

```bash
docker exec \
  -e DATABASE_URL="$SUPABASE_DATABASE_URL" \
  siae-api-production-test \
  pnpm db:migrate:deploy
```

Ao terminar, remova a variável da sessão:

```bash
unset SUPABASE_DATABASE_URL
```

**Atenção:**

- Confirme o projeto Supabase antes de executar os comandos.
- Confirme que o container contém as migrations da versão que será implantada.
- Nunca utilize a URL local do container como destino de produção.
- Não execute migrations de produção sem verificar previamente o destino.
- Não utilize comandos de reset ou exclusão do banco de dados em produção.
- Não compartilhe a URL de conexão em commits, logs ou mensagens.

## **7. Problemas comuns**

### **7.1. Conflito na porta 5432**

Se o PostgreSQL já estiver instalado e em execução na máquina, ele poderá utilizar a porta `5432`.

O Docker Compose do projeto expõe o banco na porta `5433`, evitando esse conflito.

Se houver conflito na porta `5433`, verifique qual processo está utilizando essa porta antes de alterar a configuração.

### **7.2. Erro de conexão com o banco**

Confira:

- Se o container `siae-postgres` está em execução;
- Se o banco está saudável;
- Se a `DATABASE_URL` corresponde ao ambiente de execução;
- Se as credenciais estão corretas.

Para verificar os containers:

```
docker compose ps
```

Para consultar os logs do PostgreSQL:

```
docker logs siae-postgres
```

### **7.3. Erro `@prisma/client did not initialize yet`**

Gere o Prisma Client:

```
pnpm db:generate
```

No Docker:

```
docker exec -it siae-api pnpm db:generate
```

### **7.4. Migrations pendentes**

Verifique o estado das migrations:

```
pnpm db:migrate:status
```

No Docker:

```
docker exec -it siae-api pnpm db:migrate:status
```

Se houver migrations pendentes, aplique-as com `pnpm db:migrate:deploy`, certificando-se de que a conexão aponta para o banco correto.

## **8. Observações importantes**

- O arquivo `.env` não deve ser versionado.
- As migrations devem ser mantidas no Git.
- O seed deve ser executado somente depois das migrations.
- As senhas do seed devem ser fortes e possuir pelo menos 12 caracteres.
- Os comandos de desenvolvimento e produção devem utilizar as respectivas URLs de conexão.
- Antes de executar operações no banco, confirme sempre o ambiente de destino.