# SIAE - Sistema Integrado à Assistência Estudantil PR

## Visão Geral

O SIAE é uma solução desenvolvida para modernizar e centralizar os processos de solicitação e análise de auxílios estudantis na Universidade Federal do Ceará (UFC) - Campus Russas. O sistema substitui o processo manual baseado em planilhas e documentos de texto, trazendo eficiência, segurança e rastreabilidade para toda a operação.

### Problema Resolvido
- Processo descentralizado com informações dispersas
- Comunicação ineficiente entre alunos e assistentes
- Processos manuais suscetíveis a erros
- Sobrecarga da equipe diante da crescente demanda

### Objetivo
Centralizar e automatizar o fluxo de trabalho, permitindo que alunos solicitem auxílios e acompanhem seus status, enquanto assistentes avaliam e gerenciam as solicitações de forma integrada e eficiente.

---

## Arquitetura de Software

A arquitetura foi documentada utilizando o **Modelo C4**, que oferece diferentes níveis de abstração para facilitar a compreensão por diferentes stakeholders. Ela pode ser vista com mais detalhes no README da [Arquitetura](Arquitetura/README.md)

### Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React, TypeScript, Axios |
| **Backend** | Node.js, Express, JWT, Bcrypt |
| **Banco de Dados** | PostgreSQL, Prisma ORM |
| **Integrações** | API SIGAA (validação de matrícula), SMTP/Gmail API |
| **Modelagem** | Structurizr, Modelo C4 |

---

## Modelo de Dados

## Padrões Arquiteturais Adotados

### 1. Cliente-Servidor (Client-Server)
- **Aplicação:** Comunicação entre frontend e backend
- **Justificativa:** Separação clara entre interface e lógica de negócio, permitindo escalabilidade independente

### 2. Arquitetura em Camadas (Layered Architecture)
- **Aplicação:** Organização interna do backend
- **Camadas:** Controller → Service → Repository
- **Justificativa:** Separação de responsabilidades, facilidade de manutenção e testabilidade

### 3. Repository Pattern
- **Aplicação:** Camada de persistência
- **Justificativa:** Abstrai detalhes de acesso ao banco de dados, centralizando operações de CRUD

### 4. Middleware Pattern (JWT)
- **Aplicação:** Autenticação e autorização
- **Justificativa:** Separa a lógica de segurança do restante da aplicação, facilitando manutenção e extensão

---

## Segurança

- **Autenticação:** JWT (JSON Web Tokens) para autenticação stateless
- **Autorização:** Middleware que valida tokens e verifica permissões baseadas no campo `permissao` da tabela Auth
- **Proteção de Dados:** Hash de senhas com Bcrypt
- **Integridade de Documentos:** Hash SHA-256 para verificação de integridade de arquivos

---

## Integrações Externas

| Sistema | Finalidade | Protocolo |
|---------|------------|-----------|
| **SIGAA API** | Validação de matrícula ativa do aluno | HTTP/REST |
| **Gmail API / SMTP** | Envio de notificações automáticas | SMTP/HTTPS |


---

