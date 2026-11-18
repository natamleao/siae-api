# siae-api

Este repositório contém o código-fonte do backend para a aplicação SIAE (Sistema Integrado da Assistência Estudantil Facilitando a gestão do Auxílio Emergencial na UFC Russas).

## 🧭 Branches principais

| Branch | Descrição |
|--------|------------|
| **main** | Contém o código em produção (versão estável). |
| **develop** | Branch principal de desenvolvimento. Aqui são integradas as features antes de irem para `main`. |

---

## 🌱 Branches secundárias

Adotamos o seguinte padrão de nomenclatura para criação de branches:

**Formato:** `AÇÃO/SIAE-NUMERO_DA_TASK/descricao-resumida`

**Exemplo:** `DC/SIAE-01/Aderindo-swagger`

| Descrição da Ação | Ação (Prefixo) | Convenção de Nome | Exemplo | Uso |
|-------------------|:--------------:|-------------------|---------|-----|
| **FEATURE** | `FT` | `FT/SIAE-XXX/descricao` | `FT/SIAE-12/tela-login` | Novas funcionalidades. |
| **REFACTORING** | `RF` | `RF/SIAE-XXX/descricao` | `RF/SIAE-45/refatorando-auth` | Refatorações de código sem alterar comportamento. |
| **FIX** | `FX` | `FX/SIAE-XXX/descricao` | `FX/SIAE-78/ajuste-validacao` | Correções de bugs ou ajustes pontuais. |
| **HOTFIX** | `HT` | `HT/SIAE-XXX/descricao` | `HT/SIAE-99/correcao-urgente` | Correções urgentes que precisam ir diretamente para `main`. |
| **DOCUMENTATION** | `DC` | `DC/SIAE-XXX/descricao` | `DC/SIAE-01/Aderindo-swagger` | Atualizações ou adições em documentação. |

> [!CAUTION]
> Os números devem estar de acordo com o informado no detalhamento da task no ClickUp.

---

### ⚙️ Passo a Passo para Rodar o Projeto com Docker

Detalhes sobre configuração, migrations e recuperação do banco: [📖 Guia Completo do Banco de Dados](docs/guia-postgresql.md).

#### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/devsiae-ludi/siae-api.git
cd siae-api
```

#### 2️⃣ Configurar as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env-example .env
```

Edite o arquivo `.env` e configure principalmente:

- `DATABASE_URL`: endereço de conexão com o PostgreSQL. Para conexões feitas diretamente pela máquina, utilize `localhost:5433`. Dentro do container da API, o Docker Compose configura automaticamente a conexão para `postgres:5432`.
- `JWT_SECRET`: segredo utilizado na autenticação.
- `CORS_ORIGIN`: origens autorizadas a acessar a API.
- `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`: credenciais do administrador.
- `SEED_ALUNO_ADMIN_EMAIL` e `SEED_ALUNO_ADMIN_PASSWORD`: credenciais do aluno administrador.

As duas senhas utilizadas pelo seed devem possuir entre 8 e 16 caracteres, inclusive. Utilize e-mails diferentes para as duas contas.

Configure também as variáveis de e-mail caso precise utilizar o envio de mensagens.

#### 3️⃣ Subir os containers

```bash
docker compose up -d --build
```

Esse comando inicia a API e o PostgreSQL.

#### 4️⃣ Aplicar as migrations

Com os containers em execução, aplique as migrations versionadas no banco:

```bash
docker exec -it siae-api pnpm db:migrate:deploy
```

Esse comando aplica as migrations pendentes sem criar novas migrations.

#### 5️⃣ Executar o seed

Após aplicar as migrations, execute:

```bash
docker exec -it siae-api pnpm seed
```

O seed cria os seguintes registros iniciais:

- Um usuário com permissão `ADMIN`.
- Um usuário com permissão `ALUNO_ADMIN` e seu respectivo cadastro de aluno.
- Quatro auxílios padrão.

O seed exige as quatro variáveis `SEED_*` configuradas no arquivo `.env` e deve ser executado após a aplicação das migrations.

O script pode ser executado novamente sem duplicar os registros existentes. Ele também não redefine as senhas de contas já cadastradas.

#### 6️⃣ Acessar a aplicação

- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/docs

Para abrir o Prisma Studio:

```bash
docker exec -it siae-api pnpm exec prisma studio --hostname 0.0.0.0 --port 5555
```

Acesse: http://localhost:5555

Para outros cenários de execução, consulte o [📖 Guia Completo do Banco de Dados](docs/guia-postgresql.md).

## 🧭 Fluxo de Desenvolvimento

Siga o fluxo abaixo para contribuir com o projeto de forma organizada:

1. **Crie uma nova branch a partir de `develop`:**

   ```bash
   git checkout develop
   git pull
   git checkout -b FT/SIAE-XX/criando-endpoints
   ```

2. **Faça commits incrementais e descritivos:**

   ```bash
   git commit -m "feat: adiciona tela de login"
   ```

3. **Ao concluir, abra um Pull Request para `develop`.**

4. **Após revisar e testar, o código é mesclado em `develop`.**

5. **Quando houver uma versão estável, `develop` é mesclado em `main`.**

6. **Quando precisar alterar o banco de dados:**

   Crie uma nova migration utilizando o comando abaixo, executado na raiz do projeto, fora do container. Certifique-se de que o PostgreSQL local esteja em execução pelo Docker Compose:

   ```bash
   pnpm db:migrate:dev --name descricao_da_alteracao
   ```

   Esse comando cria a migration e atualiza o Prisma Client.

   Caso precise gerar o Prisma Client separadamente, utilize:

   ```bash
   pnpm db:generate
   ```

### Ao trocar de branch

Ao mudar de branch, verifique se existem migrations pendentes:

```bash
pnpm db:migrate:status
```

Se houver migrations versionadas pendentes, aplique-as com:

```bash
pnpm db:migrate:deploy
```

Não execute `migrate dev` apenas por ter trocado de branch. Esse comando é destinado ao desenvolvimento e à criação de novas migrations.

### 🛠️ Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- **Node.js:** versão 22 ou superior.
- **pnpm:** gerenciador de pacotes (`npm install -g pnpm`), caso execute o projeto fora do Docker.
- **Docker e Docker Compose:** recomendados para executar a aplicação e o PostgreSQL.
- **Cliente HTTP:** Postman, Insomnia ou extensão Thunder Client (VS Code).

---

### 📚 Documentação Interativa com Swagger (OpenAPI)

A API conta com documentação interativa gerada pelo Swagger, com suporte à autenticação **OAuth2 (Password Flow)** e **Bearer JWT**:

👉 **http://localhost:3000/docs**

#### Como autenticar no Swagger com 1 clique (OAuth2):

1. Acesse http://localhost:3000/docs.
2. Clique no botão verde **Authorize 🔓** no canto superior direito.
3. Na seção **OAuth2PasswordBearer**, informe:
   - **username:** e-mail configurado em `SEED_ADMIN_EMAIL`.
   - **password:** senha configurada em `SEED_ADMIN_PASSWORD`.
4. Clique em **Authorize** e depois em **Close**.
5. Pronto! As rotas protegidas poderão ser testadas diretamente pelo Swagger.

---

**Caso você não saiba como usar o Postman para testar requisições HTTP, veja este guia rápido:**

[Como usar o Postman?](https://www.youtube.com/watch?v=64-O-dDR7ic)

## Problemas

### ⚠️ There might be data loss when applying the changes

Esse aviso pode ocorrer quando o schema da branch atual apresenta diferenças incompatíveis com o estado do banco de dados, como alterações ou remoções de valores de enums que ainda existem no banco.

Se estiver trabalhando em um banco **local descartável** e não precisar preservar os dados, é possível resetá-lo:

```bash
docker compose exec api pnpm exec prisma migrate reset --force
```

> [!CAUTION]
> Esse comando apaga os dados do banco, recria sua estrutura e reaplica as migrations. Utilize somente em ambientes locais descartáveis. **Nunca execute esse procedimento em produção ou no banco Supabase de produção.**
