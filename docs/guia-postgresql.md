# 🚀 Guia de Inicialização do Projeto (Setup Inicial)

Existem **dois fluxos** de trabalho: o **Fluxo 1 (Recomendado via Docker)** onde tudo roda encapsulado, e o **Fluxo 2 (Puro Local - Sem Docker)** para quem prefere rodar o Node localmente na máquina.

---

## 🐳 Fluxo 1: Rodando 100% no Docker (Recomendado)

Esse é o método mais seguro porque garante que o banco e a API funcionem em qualquer máquina sem conflitos de versões.

### 1. Clonar o repositório e entrar na pasta
```bash
git clone https://github.com/devsiae-ludi/siae-api.git
cd siae-api
```

### 2. Criar o arquivo `.env` na raiz do projeto
Crie o arquivo `.env` com as seguintes variáveis:
```env
DATABASE_URL="postgresql://siae_user:siae_password@localhost:5432/siae_db?schema=public"
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
JWT_SECRET="SIAEJWTUFC"

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER="email@exemplo.com"
EMAIL_PASS="senha_de_app"
```

### 3. Subir os containers do Docker
Execute o comando para construir a imagem e subir os serviços:
```bash
docker compose up -d --build
```
> O Docker criará o banco Postgres e a API. No momento em que a API sobe, ela executa automaticamente o `npx prisma db push` para criar as tabelas no banco.

### 4. Criar o usuário Administrador padrão (Seed)
Execute o script de seed diretamente no container da API:
```bash
docker exec -it siae-api pnpm seed
```
*(Saída esperada: `Admin criado com sucesso!`)*

### 5. Abrir o Prisma Studio (Visualizador do Banco de Dados)
Para visualizar e manipular os dados no navegador:
```bash
docker exec -it siae-api npx prisma studio --hostname 0.0.0.0 --port 5555
```
Acesse no seu navegador: **[http://localhost:5555](http://localhost:5555)**

---

## 💻 Fluxo 2: Rodando 100% Local (PostgreSQL nativo na máquina - SEM DOCKER)

### 1. Criar o Banco de Dados no PostgreSQL local
É necessário criar a base de dados `siae_db` no PostgreSQL local. Isso pode ser feito via **pgAdmin**, **DBeaver** ou pelo terminal **psql**:

**Pelo terminal**
```bash
psql -U postgres -password
```

**Crie o banco de dados**
```bash
postgres=# CREATE DATABASE siae_db;
```

*(Opcional: Se quiser usar o mesmo usuário e senha do projeto em vez do usuário `postgres` padrão)*:
```sql
CREATE USER siae_user WITH PASSWORD 'siae_password';
GRANT ALL PRIVILEGES ON DATABASE siae_db TO siae_user;
ALTER DATABASE siae_db OWNER TO siae_user;
```

> [!NOTE]
> Pode ser feito pelo pgAdmin também!

---

### 2. Configurar a `DATABASE_URL` no `.env`
No arquivo [`.env`](file:///e:/Arquivos/Documents/1-Programação/siae-api/.env), ajuste a variável `DATABASE_URL` com as credenciais do PostgreSQL local da máquina:

* **Se estiver usando o usuário padrão `postgres`:**
  ```env
  DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/siae_db?schema=public"
  ```
* **Se criou o usuário `siae_user`:**
  ```env
  DATABASE_URL="postgresql://siae_user:siae_password@localhost:5432/siae_db?schema=public"
  ```

---

### 3. Instalar dependências e sincronizar o Prisma
Na raiz do projeto:

```bash
# 1. Instala as dependências
pnpm install

# 2. Gera os tipos do Prisma Client
npx prisma generate

# 3. Cria todas as tabelas no seu PostgreSQL local
npx prisma db push
```

---

### 4. Rodar o Seed (Criar o Administrador padrão)
Com as tabelas criadas no banco local, execute o script de seed:

```bash
pnpm seed
```
> Saída esperada: `Admin criado com sucesso!`

---

### 5. Iniciar a API e o Prisma Studio

* **Para rodar a API:**
  ```bash
  pnpm dev
  ```
  *(API disponível em `http://localhost:3000`)*

* **Para abrir o visualizador de banco (Prisma Studio):**
  ```bash
  npx prisma studio
  ```
  *(Interface aberta em `http://localhost:5555`)*

---

## 🚀 Fluxo 3: Tudo rodando no Docker + acesso ao banco via pgAdmin (Opcional)

### 👾 Dados para conectar no pgAdmin (Banco no Docker)

Ao cadastrar um novo servidor no **pgAdmin**, preencha a aba **Connection** com:

| Campo | Valor |
|---|---|
| **Host name/address** | `localhost` *(ou `127.0.0.1`)* |
| **Port** | `5432` |
| **Maintenance database** | `siae_db` |
| **Username** | `siae_user` |
| **Password** | `siae_password` |

### ⚠️ O único ponto de atenção (Conflito no Windows)

Como você tem o PostgreSQL instalado também nativamente no Windows:

1. **manter os dois rodando juntos sem conflito: (RECOMENDADO)**
   * No [docker-compose.yml](file:///e:/Arquivos/Documents/1-Programação/siae-api/docker-compose.yml#L14), mude a porta externa do container:
     ```yaml
     ports:
       - "5433:5432" # 5433 na máquina -> 5432 no Docker
     ```
   * No pgAdmin, basta colocar a porta **`5433`** na conexão.

2. **Se não quiser mudar a porta do Docker:**
   * O pgAdmin pode acabar conectando no seu banco do Windows em vez do banco do Docker, ou haverá colisão na porta `5432`.
   * **Solução rápida:** Pause o serviço do Windows: (`services.msc` -> parar `postgresql-x64-...`).
    - Segure as teclas **Ctrl + Shift + Esc** para abrir o **Gerenciador de Tarefas**.
    - Clique na aba **Serviços**.
    - Localize o serviço `postgresql-x64-...` (ou similar).
    - Clique com o botão direito sobre ele e selecione **Parar**.

> [!TIP]
> **Dica para não iniciar o postgresql sozinho ao ligar o PC:**  
> Dê um duplo clique no serviço do PostgreSQL, mude o campo **"Tipo de inicialização"** de *Automático* para **Manual** e clique em **Aplicar**. Assim ele só iniciará quando você mandar.

---

## ⚠️ Possíveis Pegadinhas e Como Resolver

1. **Conflito de Porta `5432` no Windows:**
   - Se o desenvolvedor já tiver o PostgreSQL instalado no Windows, o serviço do Windows (`postgres.exe`) ocupa a porta `5432`.
   - **Solução:** Parar o serviço do Windows (`services.msc` -> parar "postgresql-x64...") **OU** mudar a porta exposta no [docker-compose.yml](file:///e:/Arquivos/Documents/1-Programação/siae-api/docker-compose.yml) para `"5433:5432"` e no `.env` usar `localhost:5433`. (como mencionado acima)

2. **Erro `@prisma/client did not initialize yet`:**
   - Ocorre ao rodar comandos locais antes de compilar o Prisma.
   - **Solução:** Rodar `npx prisma generate` na raiz do projeto.

3. **Credenciais do Admin Padrão:**
   - **Email:** `admin@siae.br`
   - **Senha:** `admin123`
   - **Permissão:** `ADMIN`