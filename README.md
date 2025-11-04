# siae-api
Este repositório contém o código-fonte do backend para a aplicação SIAE (Sistema Integrado da Assistência Estudantil Facilitando a gestão do Auxílio Emergencial na UFC Russas).

## 🧭 Branches principais

| Branch | Descrição |
|--------|------------|
| **main** | Contém o código em produção (versão estável). Deploys na Vercel partem desta branch. |
| **develop** | Branch principal de desenvolvimento. Aqui são integradas as features antes de irem para `main`. |

---

## 🌱 Branches secundárias

| Tipo | Convenção de nome | Uso |
|------|--------------------|-----|
| **feature/** | `feature/nome-da-funcionalidade` | Novas funcionalidades (ex.: `feature/tela-login`). |
| **fix/** | `fix/correção-bug` | Correções de bugs ou ajustes pontuais. |
| **hotfix/** | `hotfix/nome-do-hotfix` | Correções urgentes que precisam ir direto para `main`. |
| **docs/** | `docs/atualizacao-readme` | Atualizações em documentação. |
| **refactor/** | `refactor/nome-refatoracao` | Refatorações de código sem alterar comportamento. |

---

## 🧭 Fluxo de Desenvolvimento

Siga o fluxo abaixo para contribuir com o projeto de forma organizada:

1. **Crie uma nova branch a partir de `develop`:**

   ```bash
   git checkout develop
   git pull
   git checkout -b feature/nome-da-feature

2. **Faça commits incrementais e descritivos:**

git commit -m "feat: adiciona tela de login"

3. **Ao concluir, abra um Pull Request para `develop`.**

4. **Após revisar e testar, o código é mesclado em `develop`.**

5. **Quando houver uma versão estável, `develop` é mesclado em `main`.**

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

* **Node.js:** Versão 18 ou superior.
* **pnpm** (Gerenciador de pacotes, recomendado conforme seu lockfile) ou **npm**.
* **TypeScript** (instalado globalmente ou via `pnpm install`).
* **Cliente REST** (Postman, Insomnia ou Thunder Client) para testar os endpoints.

### ⚙️ Passo a passo

1️⃣ Clonar o repositório
```bash
git clone https://github.com/devsiae-ludi/siae-api
cd siae-api
```

2️⃣ Instalar as dependências
```bash
pnpm install
```

3️⃣ Executar o servidor de desenvolvimento
```bash
pnpm dev
```

A aplicação estará disponível em:
👉 http://localhost:3000

**Caso você não saiba como usar o Postman para testar requisições HTTP, veja este guia rápido:**  
[Como usar o Postman?](https://www.youtube.com/watch?v=64-O-dDR7ic)