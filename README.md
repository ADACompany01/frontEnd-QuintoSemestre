<p align="center">
  <img src="assets/hero/AdaHome.png" alt="ADA Company Banner" width="600"/>
</p>

# ADA Company - Projeto Final

<p align="center">
  <a href="https://newadacompany-3drnxk22f-ada-companys-projects.vercel.app/"><img src="https://img.shields.io/badge/Frontend-Online-green" /></a>
  <a href="https://backend-adacompany.onrender.com/"><img src="https://img.shields.io/badge/Backend-Online-blue" /></a>
</p>

---

## 🗂️ Sumário

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Requisitos Funcionais](#requisitos-funcionais)
3. [Demonstração Visual](#demonstração-visual)
4. [Tecnologias Utilizadas](#tecnologias-utilizadas)
5. [Organização dos Repositórios](#organização-dos-repositórios)
6. [Como Executar](#como-executar)
7. [Integração e Entrega Contínua (CI/CD)](#integração-e-entrega-contínua-cicd)
8. [Documentação Docker](#documentação-docker)
9. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
10. [Documentação da API](#documentação-da-api)
11. [Exemplos de Integração](#exemplos-de-integração)
12. [Links das Aplicações Publicadas](#links-das-aplicações-publicadas)
13. [Integrantes](#integrantes)
14. [Licença](#licença)
15. [Referências e Suporte](#referências-e-suporte)

---

## ✨ Sobre o Projeto

Sistema completo para gestão de serviços, clientes e funcionários, com interface web moderna e API robusta. O sistema foi desenvolvido como projeto final do quarto semestre, utilizando arquitetura em camadas, containers Docker e API RESTful documentada.

---

## ✅ Requisitos Funcionais

- **Cadastro de Usuários:**
  O sistema deve permitir o cadastro de diferentes tipos de usuários (clientes, funcionários).

- **Autenticação e Autorização:**
  O sistema deve permitir login seguro e garantir que apenas usuários autenticados acessem funcionalidades restritas.

- **Gestão de Serviços:**
  O sistema deve permitir o cadastro, edição, exclusão e listagem de serviços oferecidos pela empresa.

- **Gestão de Clientes:**
  O sistema deve permitir o cadastro, edição, exclusão e listagem de clientes.

- **Gestão de Funcionários:**
  O sistema deve permitir o cadastro, edição, exclusão e listagem de funcionários.

- **Orçamento:**
  O sistema deve permitir que clientes solicitem orçamentos e acompanhem o status.

- **Dashboard:**
  O sistema deve apresentar um painel com informações resumidas (quantidade de clientes, serviços, orçamentos, etc).

- **Integração Frontend/Backend:**
  O frontend deve consumir a API do backend para todas as operações de CRUD.

- **Notificações:**
  O cliente deve acompanhar o status de pedidos através da página de acesso no frontend.

- **Avaliação de url via API:**
  O cliente deve conseguir avaliar o nível de acessibilidade do seu site informando a url dele.

---

## 🖼️ Demonstração Visual

<p align="center">
  <img src="assets/hero/heroImage.png" alt="Tela Inicial" width="400"/>
  <img src="assets/about/aboutImage.png" alt="Sobre o Projeto" width="400"/>
</p>

<p align="center">
  <img src="assets/cards/site-idosos.jpg" alt="Card Idosos" width="250"/>
  <img src="assets/cards/site-infantil.jpg" alt="Card Infantil" width="250"/>
  <img src="assets/cards/site-acessibilidade.jpg" alt="Card Acessibilidade" width="250"/>
</p>

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React + Vite, CSS Modules, Nginx
- **Backend:** NestJS, TypeScript, Sequelize, JWT, Swagger
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker, Docker Compose
- **Ferramentas:** Git, GitHub, Vercel, Render

---

## 🗃️ Organização dos Repositórios

- [Repositório Backend](https://github.com/ADACompany01/backEnd-QuartoSemestre)
- [Repositório Frontend](https://github.com/ADACompany01/frontEnd-QuartoSemestre)

Estrutura de pastas principal:

```
Projetos/
├── backEnd-QuartoSemestre/
│   └── API_NEST/
│       └── API_ADA_COMPANY_NESTJS/
│           ├── docker-compose.yml
│           ├── dockerfile
│           └── src/
└── frontEnd-QuartoSemestre/
    ├── dockerfile
    ├── nginx.conf
    └── src/
```

---

## 📦 Como Executar

Para rodar o sistema completo localmente (frontend, backend e banco de dados), basta usar o docker-compose já configurado no backend:

1. **Clone os repositórios:**
   ```sh
   git clone https://github.com/ADACompany01/backEnd-QuartoSemestre.git
   git clone https://github.com/ADACompany01/frontEnd-QuartoSemestre.git
   ```
2. **Navegue até a pasta do docker-compose:**
   ```sh
   cd backEnd-QuartoSemestre/API_NEST/API_ADA_COMPANY_NESTJS
   ```
3. **Suba todos os containers:**
   ```sh
   docker-compose up --build
   ```

- O frontend estará disponível em: [http://localhost](http://localhost)
- O backend (Swagger) estará em: [http://localhost:3000/api](http://localhost:3000/api)

> **Observação:**
> - Não é necessário criar arquivos `.env` para rodar via Docker, pois todas as variáveis já estão no `docker-compose.yml`.
> - O compose já está ajustado para não depender de healthcheck nem de depends_on no frontend, facilitando o uso local.

---

## 🚦 Integração e Entrega Contínua (CI/CD)

O projeto utiliza um pipeline automatizado com GitHub Actions para o frontend, localizado em `.github/workflows/ci-frontend.yml`.

**Principais etapas automatizadas:**
- Instalação de dependências do frontend
- Execução de testes automatizados (placeholder, pode ser expandido)
- Build do código frontend
- Versionamento semântico automático e criação de tags
- Build e push de imagens Docker do frontend para o Docker Hub
- Deploy automático do frontend na Vercel
- Notificações por e-mail em caso de falha
- Uso de secrets para credenciais sensíveis
- Cache de build para acelerar execuções

**Resumo do fluxo:**
1. Build, teste, versionamento e publicação da imagem Docker do frontend.
2. Deploy automático do frontend na Vercel ao criar uma nova versão.
3. Notificações automáticas por e-mail em caso de falha em qualquer etapa.

Para mais detalhes, consulte o arquivo de workflow `.github/workflows/ci-frontend.yml` no repositório.

---

## 🐳 Documentação Docker

O arquivo `docker-compose.yml` já está pronto para uso local, sem healthcheck e sem depends_on no frontend. Basta seguir o passo a passo acima para rodar tudo localmente.

### Docker Compose

O arquivo `docker-compose.yml` configura três serviços principais:

```yaml
services:
  database:
    build: ../../database/postgres
    container_name: ada-postgres-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: adacompanysteam
      POSTGRES_PASSWORD: 2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee
      POSTGRES_DB: adacompanybd
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./database/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql

  backend:
    build:
      context: .
      dockerfile: dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://adacompanysteam:2N1lrqwIaBxO4eCZU7w0mjGCBXX7QVee@database:5432/adacompanybd
      JWT_SECRET: "ada_company_secret_key_2025"
    depends_on:
      database:
        condition: service_healthy

  frontend:
    build:
      context: ../../frontEnd-QuartoSemestre
      dockerfile: dockerfile
    container_name: ada-frontend-app
    ports:
      - "80:80"
    environment:
      REACT_APP_BACKEND_URL: "http://backend:3000"
    depends_on:
      backend:
        condition: service_healthy
```

### Dockerfile Backend

```dockerfile
# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY . .
RUN npm install
RUN npm run build
# Etapa 2: imagem final
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist/src ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Dockerfile Frontend

```dockerfile
# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build
# Etapa 2: servidor Nginx para servir os arquivos
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Comandos Docker Úteis

```sh
docker-compose ps
docker-compose logs
docker-compose down
docker-compose up -d --build --force-recreate
docker exec -it ada-postgres-db psql -U adacompanysteam -d adacompanybd
docker exec ada-postgres-db pg_dump -U adacompanysteam adacompanybd > backup.sql
```

---

## 🗄️ Estrutura do Banco de Dados

```
usuarios
├── id_usuario (UUID, PK)
├── email (STRING, UNIQUE)
└── senha (STRING)

clientes
├── id_cliente (UUID, PK)
├── nome_completo (STRING)
├── cnpj (STRING, UNIQUE)
├── telefone (STRING)
├── email (STRING, UNIQUE)
└── id_usuario (UUID, FK -> usuarios)

funcionarios
├── id_funcionario (UUID, PK)
├── nome_completo (STRING)
├── email (STRING, UNIQUE)
├── telefone (STRING)
└── id_usuario (UUID, FK -> usuarios)

pacotes
├── id_pacote (UUID, PK)
├── id_cliente (UUID, FK -> clientes)
├── tipo_pacote (STRING) - A, AA, AAA
└── valor_base (DECIMAL)

orcamentos
├── cod_orcamento (UUID, PK)
├── valor_orcamento (DECIMAL)
├── data_orcamento (DATE)
├── data_validade (DATE)
└── id_pacote (UUID, FK -> pacotes)

contratos
├── id_contrato (UUID, PK)
├── valor_contrato (DECIMAL)
├── cod_orcamento (UUID, FK -> orcamentos)
├── status_contrato (STRING) - EM_ANALISE, EM_ANDAMENTO, CANCELADO, CONCLUIDO
├── data_inicio (DATE)
└── data_entrega (DATE)
```

Relacionamentos:
- **usuarios** ↔ **clientes** (1:1)
- **usuarios** ↔ **funcionarios** (1:1)
- **clientes** ↔ **pacotes** (1:N)
- **pacotes** ↔ **orcamentos** (1:1)
- **orcamentos** ↔ **contratos** (1:1)

---

## 📋 Documentação da API

A API RESTful foi desenvolvida utilizando NestJS e oferece endpoints para todas as funcionalidades do sistema. A documentação completa está disponível via Swagger na URL `/docs` quando o servidor estiver rodando.

Principais endpoints:
- `GET /auth/token` - Obter token de teste
- `POST /auth/login` - Login de usuário
- `POST /clientes/cadastro` - Cadastrar cliente (público)
- `GET /clientes` - Listar clientes (funcionários)
- `POST /pacotes` - Criar pacote
- `POST /orcamentos` - Criar orçamento
- `POST /contratos` - Criar contrato

Veja a lista completa e exemplos na seção seguinte.

---

## 🔌 Exemplos de Integração

### Autenticação

```bash
GET /auth/token
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

```bash
POST /auth/login
Content-Type: application/json
{
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

### Clientes

```bash
POST /clientes/cadastro
Content-Type: application/json
{
  "nome_completo": "Empresa ABC Ltda",
  "cnpj": "12.345.678/0001-90",
  "telefone": "(11) 99999-9999",
  "email": "contato@empresaabc.com"
}
```

### Pacotes

```bash
POST /pacotes
Authorization: Bearer <token>
Content-Type: application/json
{
  "id_cliente": "uuid-do-cliente",
  "tipo_pacote": "AA",
  "valor_base": 1500.00
}
```

### Orçamentos

```bash
POST /orcamentos
Authorization: Bearer <token>
Content-Type: application/json
{
  "valor_orcamento": 2000.00,
  "data_orcamento": "2023-10-26T10:00:00Z",
  "data_validade": "2023-11-26T10:00:00Z",
  "id_pacote": "uuid-do-pacote"
}
```

### Contratos

```bash
POST /contratos
Authorization: Bearer <token>
Content-Type: application/json
{
  "valor_contrato": 2000.00,
  "cod_orcamento": "uuid-do-orcamento",
  "status_contrato": "EM_ANALISE",
  "data_inicio": "2023-10-26T10:00:00Z",
  "data_entrega": "2023-12-26T10:00:00Z"
}
```

---

## 🌐 Links das Aplicações Publicadas

- **Frontend:** [https://newadacompany.vercel.app/](https://newadacompany.vercel.app/)
- **Backend:** [https://backend-adacompany.onrender.com/api](https://backend-adacompany.onrender.com/api)

---

## 👥 Integrantes

- Luiz Riato
- Matheus Prusch
- Maycon Sanches
- Pietro Adrian
- Samuel Pregnolatto

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 📚 Referências e Suporte

- [Documentação React](https://react.dev/)
- [Documentação NestJS](https://nestjs.com/)
- [Documentação PostgreSQL](https://www.postgresql.org/)
- [Documentação Docker](https://www.docker.com/)
- [Swagger](https://swagger.io/)

Para dúvidas ou problemas:
- Abra uma issue no repositório correspondente
- Entre em contato com a equipe de desenvolvimento
- Consulte a documentação da API em `/docs` (Swagger) 
