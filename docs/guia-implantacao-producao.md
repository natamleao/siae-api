# Guia de implantação em produção — SIAE API

Este documento descreve o procedimento de preparação, implantação, atualização e verificação da API do Sistema Integrado da Assistência Estudantil (SIAE) em ambiente de produção utilizando Docker.

A configuração utiliza PostgreSQL externo. O `docker-compose.prod.yml` inicia somente a API.

---

## 1. Pré-requisitos

Antes da implantação, disponibilize:

- Git;
- Docker Engine;
- Docker Compose;
- Acesso ao repositório da API;
- Um servidor PostgreSQL acessível pela API;
- Um domínio e uma infraestrutura de proxy reverso com HTTPS;
- As credenciais e configurações necessárias para os serviços externos.

O servidor PostgreSQL não é criado pelo Compose de produção. Ele deve existir e estar acessível antes da implantação.

## 2. Preparar o projeto

Clone o repositório e entre no diretório:

```bash
git clone https://github.com/devsiae-ludi/siae-api.git
cd siae-api
````

Confira se o Docker está disponível:

```
docker --version
docker compose version
```

## **3. Configurar as variáveis de ambiente**

Crie o arquivo de produção a partir do exemplo:

```
cp .env.prod.example .env.prod
```

Edite o arquivo:

```
nano .env.prod
```

Configure as seguintes variáveis:

| Variável                    | Finalidade                                                        |
| --------------------------- | ----------------------------------------------------------------- |
| `NODE_ENV`                  | Ambiente de execução. Deve ser `production`.                      |
| `PORT`                      | Porta interna da API. Utilize `3000`.                             |
| `DATABASE_URL`              | URL de conexão com o PostgreSQL de produção.                      |
| `JWT_SECRET`                | Segredo forte utilizado na assinatura e validação dos tokens JWT. |
| `CORS_ORIGIN`               | Origem ou lista de origens autorizadas do frontend.               |
| `EMAIL_HOST`                | Servidor SMTP.                                                    |
| `EMAIL_PORT`                | Porta do servidor SMTP.                                           |
| `EMAIL_USER`                | Usuário de autenticação SMTP.                                     |
| `EMAIL_PASS`                | Senha ou credencial SMTP.                                         |
| `SEED_ADMIN_EMAIL`          | E-mail do administrador inicial.                                  |
| `SEED_ADMIN_PASSWORD`       | Senha do administrador inicial.                                   |
| `SEED_ALUNO_ADMIN_EMAIL`    | E-mail do administrador de alunos inicial.                        |
| `SEED_ALUNO_ADMIN_PASSWORD` | Senha do administrador de alunos inicial.                         |

**Atenção:** a versão atual de `.env.prod.example` não contém as quatro variáveis `SEED_*`. Elas precisam ser acrescentadas manualmente ao `.env.prod` antes da execução do seed inicial.

As duas senhas do seed devem possuir entre 8 e 16 caracteres, inclusive. Os dois endereços de e-mail devem ser diferentes.

### **Cuidados com as variáveis**

- Utilize um `JWT_SECRET` forte, aleatório e exclusivo para produção.
- Não utilize credenciais de desenvolvimento.
- Configure `CORS_ORIGIN` com o domínio real do frontend, sem liberar origens desnecessárias.
- Se houver mais de uma origem autorizada, separe-as por vírgulas.
- Configure o SMTP conforme os parâmetros fornecidos pelo serviço de e-mail.
- A `DATABASE_URL` deve apontar para o endereço do PostgreSQL acessível a partir do container da API. Não utilize `localhost` para representar um banco externo ao container.
- Caracteres especiais presentes na senha do PostgreSQL precisam estar codificados corretamente na URL de conexão.

Restrinja as permissões do arquivo:

```
chmod 600 .env.prod
```

O arquivo contém credenciais e não deve ser versionado nem compartilhado.

## **4. Preparar o PostgreSQL**

Antes de executar as migrations:

1. Crie o banco de dados de produção.
2. Crie ou disponibilize um usuário com as permissões necessárias.
3. Configure a conexão e a segurança de rede.
4. Confirme que o servidor PostgreSQL está acessível a partir do ambiente onde a API será executada.
5. Configure uma rotina de backup e recuperação.

A API utiliza Prisma para acessar o banco.

As migrations estão versionadas em:

```
prisma/migrations/
```

Nunca utilize `prisma migrate dev` ou `prisma migrate reset` no banco de produção.

Antes de aplicar alterações de estrutura em um banco existente, faça um backup e avalie a compatibilidade das migrations com a versão da API em execução.

## **5. Construir a imagem de produção**

Na raiz do projeto, execute:

```
docker compose -f docker-compose.prod.yml build api
```

A imagem utiliza o estágio `production` do Dockerfile, com dependências de produção e aplicação compilada.

## **6. Aplicar as migrations**

Antes de iniciar ou atualizar a API, aplique as migrations pendentes:

```
docker compose -f docker-compose.prod.yml run --rm api pnpm db:migrate:deploy
```

Esse comando executa as migrations versionadas que ainda não foram aplicadas ao banco.

Para consultar o estado das migrations:

```
docker compose -f docker-compose.prod.yml run --rm api pnpm db:migrate:status
```

O comando `run --rm` cria um container temporário para executar a operação e o remove ao terminar. Ele utiliza as configurações de ambiente do serviço, inclusive o arquivo `.env.prod`.

## **7. Executar o seed inicial**

Na primeira implantação, depois de aplicar as migrations, execute:

```
docker compose -f docker-compose.prod.yml run --rm api pnpm seed:deploy
```

O seed inicial cria:

- Usuário administrador (`ADMIN`);
- Usuário administrador aluno (`ALUNO_ADMIN`);
- Registro de aluno associado ao usuário `ALUNO_ADMIN`;
- Auxílios iniciais do sistema.

O seed utiliza as quatro variáveis `SEED_*`.

A operação é idempotente para os registros existentes: não duplica os registros nem redefine senhas já cadastradas. Entretanto, se um e-mail já existir com uma permissão diferente da esperada, o seed interromperá a execução.

O seed é uma etapa de inicialização. Não é necessário executá-lo automaticamente a cada reinicialização ou atualização da API.

Após a criação dos usuários iniciais, proteja as credenciais e evite reutilizá-las em outros ambientes.

## **8. Iniciar a API**

Depois de preparar o banco, aplicar as migrations e executar o seed inicial:

```
docker compose -f docker-compose.prod.yml up -d
```

O serviço utiliza:

| Configuração                | Valor                 |
| --------------------------- | --------------------- |
| Container                   | `siae-api-production` |
| Porta interna               | `3000`                |
| Porta publicada no host     | `3001`                |
| Política de reinicialização | `unless-stopped`      |
| Healthcheck                 | `/health/ready`       |
| Intervalo do healthcheck    | 30 segundos           |

A API ficará disponível no host pela porta `3001`.

O Compose não configura proxy reverso, certificado HTTPS ou regras de firewall. Esses componentes devem ser preparados na infraestrutura de produção.

## **9. Verificar a implantação**

Confira o estado dos serviços:

```
docker compose -f docker-compose.prod.yml ps
```

Consulte os logs:

```
docker compose -f docker-compose.prod.yml logs --tail=100 api
```

Verifique se o processo está ativo:

```
curl -i http://localhost:3001/health/live
```

Resposta esperada: HTTP 200.

Verifique a prontidão da API e a conexão com o banco:

```
curl -i http://localhost:3001/health/ready
```

Resposta esperada quando o banco estiver acessível:

```
{
  "success": true,
  "status": "ready",
  "database": "connected"
}
```

Se o banco estiver indisponível, a rota retorna HTTP 503:

```
{
  "success": false,
  "status": "not_ready",
  "database": "unavailable"
}
```

A rota `/health/ready` executa uma consulta `SELECT 1` no PostgreSQL.

## **10. Documentação Swagger**

Por segurança, a documentação Swagger fica desabilitada quando `NODE_ENV=production`.

Em produção, as rotas abaixo devem retornar HTTP 404:

```
/docs
/docs.json
```

A documentação permanece disponível nos ambientes que não utilizam `NODE_ENV=production`.

## **11. Atualizar uma implantação existente**

Antes de atualizar a aplicação:

1. Avalie as alterações da versão.
2. Faça backup do banco de dados.
3. Verifique se as migrations são compatíveis com a versão atualmente em execução.
4. Atualize o código do projeto.
5. Construa a nova imagem.
6. Aplique as migrations pendentes.
7. Atualize o serviço.

Comandos:

```
docker compose -f docker-compose.prod.yml build api
```

```
docker compose -f docker-compose.prod.yml run --rm api pnpm db:migrate:deploy
```

```
docker compose -f docker-compose.prod.yml up -d
```

Depois da atualização, confira o estado do container, os logs e os endpoints de saúde.

Em atualizações que envolvam mudanças incompatíveis no banco, planeje uma janela de manutenção e uma estratégia de recuperação antes de aplicar as migrations.

## **12. Cuidados operacionais e de segurança**

- Não versione `.env.prod`.
- Não exponha `JWT_SECRET`, senhas, tokens ou credenciais SMTP.
- Não utilize credenciais de desenvolvimento em produção.
- Mantenha o PostgreSQL protegido por regras de rede e autenticação.
- Mantenha backups regulares do banco e teste a recuperação.
- Utilize HTTPS por meio de um proxy reverso ou infraestrutura equivalente.
- Restrinja o acesso externo à porta da API conforme a arquitetura de rede.
- Monitore os logs e o estado de saúde do container.
- Não execute `prisma migrate reset` ou `prisma migrate dev` em produção.
- Não utilize `docker compose down -v` como procedimento de atualização.
- Não remova volumes ou dados persistentes sem uma autorização e um plano de recuperação específicos.

## **13. Pendências antes da implantação pública**

A configuração de infraestrutura não significa, por si só, que todas as funcionalidades da aplicação estejam prontas para produção.

Antes de disponibilizar o sistema publicamente, confira especialmente:

1. **URL de recuperação de senha:** o serviço de e-mail atualmente gera um link fixo para `http://localhost:5173`. Ele precisa apontar para o domínio real do frontend.
2. **SMTP:** configure e teste o envio real de e-mails, principalmente o fluxo de recuperação de senha.
3. **Variáveis do seed:** inclua as quatro variáveis `SEED_*` no arquivo de ambiente de produção antes da inicialização.
4. **Frontend:** configure a URL da API e as origens CORS para os domínios reais.
5. **Formulários:** valide os fluxos que ainda não foram integrados à API.
6. **Infraestrutura:** configure HTTPS, firewall, DNS, backups e monitoramento.

O limite atual de JSON da API é de 1 MB. Ele foi validado em teste de runtime. Esse limite deverá ser reavaliado quando os formulários completos estiverem integrados e seus payloads reais forem conhecidos.

A implantação pública deve ocorrer somente depois da resolução das pendências aplicáveis e da validação integrada do frontend, da API e do banco de produção.
