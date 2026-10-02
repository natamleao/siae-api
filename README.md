# siae-api
Este repositório contém o código-fonte do backend para a aplicação SIAE (Sistema Integrado da Assistência Estudantil Facilitando a gestão do Auxílio Emergencial na UFC Russas).

## 🧭 Branches principais

| Branch | Descrição |
|--------|------------|
| **main** | Contém o código em produção (versão estável). Deploys na Vercel partem desta branch. |
| **develop** | Branch principal de desenvolvimento. Aqui são integradas as features antes de irem para `main`. |

---

## 🌱 Branches secundárias

Adotamos o seguinte padrão de nomenclatura para criação de branches:

> **Formato:** `AÇÃO/SIAE-NUMERO_DA_TASK/descricao-resumida`  
> **Exemplo:** `DC/SIAE-01/Aderindo-swagger`

| Descrição da Ação | Ação (Prefixo) | Convenção de Nome | Exemplo | Uso |
|-------------------|:--------------:|-------------------|---------|-----|
| **FEATURE** | `FT` | `FT/SIAE-XXX/descricao` | `FT/SIAE-12/tela-login` | Novas funcionalidades. |
| **REFACTORING** | `RF` | `RF/SIAE-XXX/descricao` | `RF/SIAE-45/refatorando-auth` | Refatorações de código sem alterar comportamento. |
| **FIX** | `FX` | `FX/SIAE-XXX/descricao` | `FX/SIAE-78/ajuste-validacao` | Correções de bugs ou ajustes pontuais. |
| **HOTFIX** | `HT` | `HT/SIAE-XXX/descricao` | `HT/SIAE-99/correcao-urgente` | Correções urgentes que precisam ir direto para `main`. |
| **DOCUMENTATION** | `DC` | `DC/SIAE-XXX/descricao` | `DC/SIAE-01/Aderindo-swagger` | Atualizações ou adições em documentação. |

> [!CAUTION]
> Os números devem está de acordo com o informado no detalhamento da task no Clickup

---

### ⚙️ Passo a Passo para Rodar o Projeto com Docker

Detalhes sobre o passo a passo para rodar o servidor de desenvolvimento: [📖 Guia Completo do Banco de Dados](docs/guia-postgresql.md)


#### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/devsiae-ludi/siae-api
cd siae-api
```

#### 2️⃣ Configurar as Variáveis de Ambiente (`.env`)

##### Copiar o arquivo .env-example e colar como .env
```bash
cp .env-example .env
```

##### Ou criar um arquivo `.env` na raiz do projeto e colar as seguintes variáveis:
```env
DATABASE_URL="postgresql://siae_user:siae_password@localhost:5432/siae_db?schema=public"
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
JWT_SECRET="SIAEJWTUFC"

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER="Email responsável por enviar os emails"
EMAIL_PASS="abc def hji jkl"
```

#### 3️⃣ Subir o Banco de Dados e Sincronizar o Prisma

* **Opção A (Via Docker - Recomendado):**
  ```bash
  # Sobe o banco PostgreSQL no Docker
  docker compose up -d --build

  # Para visualizar e manipular os dados no navegador:
  docker exec -it siae-api npx prisma studio --hostname 0.0.0.0 --port 5555

  # Popula o banco com o usuário ADMIN padrão
  docker exec -it siae-api pnpm seed
  ```

A aplicação estará disponível em:
👉 **http://localhost:3000**

* **Outras opções de como rodar o projeto**
  > Consulte o nosso [📖 Guia Completo do Banco de Dados](docs/guia-postgresql.md) para ver outros fluxos, caso queira.

---

### 🔑 Credenciais Iniciais de Teste (Seed)
* **Email:** `admin@siae.br`
* **Senha:** `admin123`
* **Permissão:** `ADMIN`

---

## 🧭 Fluxo de Desenvolvimento

Siga o fluxo abaixo para contribuir com o projeto de forma organizada:

1. **Crie uma nova branch a partir de `develop`:**

   ```bash
   git checkout develop
   git pull
   git checkout -b FT/SIAE-XX/criando-endpoints
   ```

2. **Faça commits incrementais e descritivos:**

git commit -m "feat: adiciona tela de login"

3. **Ao concluir, abra um Pull Request para `develop`.**

4. **Após revisar e testar, o código é mesclado em `develop`.**

5. **Quando houver uma versão estável, `develop` é mesclado em `main`.**

### 🛠️ Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

* **Node.js:** Versão 18 ou superior.
* **pnpm:** Gerenciador de pacotes (`npm install -g pnpm`).
* **Docker & Docker Compose** (Recomendado para rodar o banco sem complicações) **OU** PostgreSQL instalado localmente.
* **Cliente HTTP:** Postman, Insomnia ou extensão Thunder Client (VS Code).

---

### 📚 Documentação Interativa com Swagger (OpenAPI)

A API conta com documentação interativa gerada pelo Swagger com suporte a autenticação **OAuth2 (Password Flow)** e **Bearer JWT**:

👉 **http://localhost:3000/docs**

#### Como autenticar no Swagger com 1 clique (OAuth2):
1. Acesse `http://localhost:3000/docs`.
2. Clique no botão verde **Authorize 🔓** no canto superior direito.
3. Na seção **OAuth2PasswordBearer**, informe:
   - **username:** seu email cadastrado (ex: `admin@siae.br`)
   - **password:** sua senha (ex: `admin123`)
4. Clique em **Authorize** e depois em **Close**.
5. Pronto! Todas as rotas protegidas (ex: `/funcionario/*`) já estarão autenticadas automaticamente para teste direto no navegador.

---

**Caso você não saiba como usar o Postman para testar requisições HTTP, veja este guia rápido:**  
[Como usar o Postman?](https://www.youtube.com/watch?v=64-O-dDR7ic)

