# c14-library

Sistema de gerenciamento de livraria com controle de livros, membros e empréstimos.

Monorepo com NestJS (API REST) + React (frontend), orquestrado via Turborepo e pnpm workspaces.

---

## Estrutura do projeto

```
c14-library/
├── apps/
│   ├── api/          # Backend — NestJS + Prisma + PostgreSQL
│   └── web/          # Frontend — React + Vite + Axios
├── nginx/            # Configuração do reverse proxy (produção)
├── docker-compose.yml
└── turbo.json
```

---

## Pré-requisitos

- Node.js 22+
- pnpm 10.32+
- Docker e Docker Compose

```bash
npm install -g pnpm
```

---

## Desenvolvimento local

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Subir o banco de dados

```bash
docker compose up postgres -d
```

### 3. Configurar variáveis de ambiente

**API** (`apps/api/.env`):
```env
DATABASE_URL="postgresql://c14:c14pass@localhost:5432/c14_library?schema=public"
PORT=3000
```

**Frontend** (`apps/web/.env`):
```env
VITE_API_URL=http://localhost:3000
```

### 4. Rodar as migrations

```bash
pnpm --filter @c14/api db:migrate
```

### 5. Iniciar os serviços

Todos juntos (API + Web em paralelo):
```bash
pnpm dev
```

Ou individualmente:
```bash
pnpm dev:api   # API em http://localhost:3000
pnpm dev:web   # Web em http://localhost:5173
```

A documentação Swagger fica disponível em `http://localhost:3000/docs`.

---

## Produção (Docker)

### 1. Gerar o certificado SSL (self-signed)

Necessário para o nginx terminar TLS. Rode uma vez no servidor:

```bash
mkdir -p nginx/certs
openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
  -keyout nginx/certs/key.pem \
  -out nginx/certs/cert.pem \
  -subj "/CN=<IP_DO_SERVIDOR>"
```

### 2. Configurar variáveis de ambiente

**API** (`apps/api/.env`):
```env
DATABASE_URL="postgresql://c14:c14pass@postgres:5432/c14_library?schema=public"
PORT=3000
```

### 3. Subir todos os containers

```bash
docker compose up -d --build
```

Serviços iniciados:
| Container | Função | Porta exposta |
|---|---|---|
| `c14-library-nginx` | Reverse proxy HTTPS | `3030` |
| `c14-library-api` | NestJS API | interno (`3000`) |
| `c14-library-db` | PostgreSQL | `5432` |

### 4. Rodar as migrations em produção

```bash
docker compose exec api pnpm --filter @c14/api db:migrate
```

### 5. Aceitar o certificado self-signed

Na primeira vez, acesse `https://<IP>:3030` diretamente no browser e confirme a exceção de segurança. Após isso, o frontend consegue se comunicar com a API sem bloqueios de mixed content.

---

## Comandos úteis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia API e Web em modo watch |
| `pnpm build` | Gera build de produção de todos os apps |
| `pnpm test` | Roda os testes de todos os apps |
| `pnpm lint` | Lint em todos os apps |
| `pnpm --filter @c14/api db:migrate` | Cria/aplica migrations |
| `pnpm --filter @c14/api db:studio` | Abre o Prisma Studio |
| `pnpm --filter @c14/api db:push` | Sincroniza schema sem criar migration |
| `docker compose logs -f api` | Acompanha logs da API |
| `docker compose down -v` | Para e remove containers e volumes |

---

## Modelos de dados

```
Book        — id, title, author, isbn (unique), quantity
Member      — id, name, email (unique)
Loan        — id, bookId, memberId, loanedAt, dueDate, returnedAt?
```

---

## Variáveis de ambiente

### `apps/api/.env`

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://c14:c14pass@localhost:5432/c14_library` |
| `PORT` | Porta do servidor NestJS | `3000` |

### `apps/web/.env`

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da API | `http://localhost:3000` |

---

## URLs do ambiente

| Serviço | Local | Produção |
|---|---|---|
| Frontend | `http://localhost:5173` | https://c14.bruno-teixeira.com/ |
| API | `http://localhost:3000` | https://c14-api.bruno-teixeira.com |
| Swagger | `http://localhost:3000/docs` | https://c14-api.bruno-teixeira.com/docs |


## Uso de IA

Os prompts utilizados para desenvolvimento do codigo estao no arquivo PROMPTS.md que foram sendo adicionados pelo proprio claude code.

O uso foi muito produtivo, pois agilizou meu processo de desenvolvimento.

Alem disso tambem usei o chatgpt para tirar duvidas sobre alguns processos. Principalmente sobre algumas configuracoes na AWS.