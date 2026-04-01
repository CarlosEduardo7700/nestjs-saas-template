# NestJS SaaS Template

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descrição

Template base para construção de aplicações SaaS utilizando NestJS. Inclui arquitetura modular com classes base reutilizáveis, integração com PostgreSQL via TypeORM, validação de dados e suporte a Stripe.

## Stack Tecnológica

- **NestJS** - Framework Node.js para aplicações server-side
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Banco de dados relacional
- **class-validator** - Validação de dados com decorators
- **TypeScript** - Superset tipado do JavaScript
- **Resend** - Email transacional
- **Stripe** - Processamento de pagamentos
- **Throttler** - Rate limiting para proteção da API
- **Terminus** - Health checks para monitoramento

## Setup Inicial

### Pré-requisitos

- Node.js 18+
- PostgreSQL

### Instalação

```bash
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Server
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/database
DATABASE_SYNCHRONIZE=true

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
SALT_ROUNDS=10

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
APP_NAME=Your App Name

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
STRIPE_PRICE_ID=price_xxxxxxxxxxxx

# Frontend
FRONTEND_URL=http://localhost:3001
```

> **Opcional:** Se `SALT_ROUNDS` não for definido, o valor padrão utilizado pela aplicação é `10`.

## Migrations

O projeto utiliza TypeORM para gerenciar migrations do banco de dados.

### Gerar Migration

Gera uma migration com base nas diferenças entre as entidades e o banco:

```bash
npm run migration:generate src/database/migrations/nome-da-migration
```

> **Nota:** Para funcionar corretamente, `DATABASE_SYNCHRONIZE` deve estar `false` no `.env`.

### Executar Migrations

Aplica todas as migrations pendentes:

```bash
npm run migration:run
```

### Reverter Migration

Reverte a última migration executada:

```bash
npm run migration:revert
```

### Criar Migration Vazia

Cria uma migration vazia para escrita manual:

```bash
npm run migration:create src/database/migrations/nome-da-migration
```

## Endpoints

### Auth

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Autenticar usuário (público) |
| `POST` | `/auth/forgot-password` | Solicitar reset de senha (público) |
| `POST` | `/auth/reset-password` | Resetar senha com token (público) |

### User

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/user` | Criar usuário (público) |
| `GET` | `/user` | Listar usuários |
| `GET` | `/user/:id` | Buscar usuário por ID |
| `PATCH` | `/user/:id` | Atualizar usuário |
| `DELETE` | `/user/:id` | Deletar usuário |

### Health

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Status completo (DB, memória, disco) |
| `GET` | `/health/live` | Liveness probe (aplicação responde) |
| `GET` | `/health/ready` | Readiness probe (banco conectado) |

> **Nota:** Exceto rotas marcadas como públicas, todos os endpoints requerem autenticação via Bearer Token no header `Authorization`.

## Health Checks

A aplicação expõe endpoints para monitoramento:

```bash
# Status completo
curl http://localhost:3000/health

# Resposta de exemplo
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" },
    "disk": { "status": "up" }
  }
}
```

### Indicadores

| Indicador | Descrição | Limite |
|-----------|-----------|--------|
| `database` | Conexão com PostgreSQL | Ping OK |
| `memory_heap` | Memória heap do Node.js | 300 MB |
| `memory_rss` | Memória RSS do processo | 500 MB |
| `disk` | Espaço em disco disponível | 5% livre |

### Uso com Kubernetes

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Rate Limiting

A API possui proteção contra abuso com limites de requisições:

### Limites Globais

| Janela | Limite |
|--------|--------|
| 1 segundo | 3 requests |
| 10 segundos | 20 requests |
| 1 minuto | 100 requests |

### Limites em Rotas Sensíveis

| Rota | Limite |
|------|--------|
| `POST /auth/login` | 5/min, 20/hora |
| `POST /auth/forgot-password` | 3/min, 5/hora |
| `POST /auth/reset-password` | 5/min, 10/hora |
| `POST /user` (cadastro) | 5/min, 10/hora |

> **Nota:** Quando o limite é excedido, a API retorna status `429 Too Many Requests`.

## Scripts Disponíveis

```bash
npm run start          # Iniciar aplicação
npm run start:dev      # Modo watch
npm run start:debug    # Modo debug
npm run build          # Build para produção
npm run test           # Testes unitários
npm run test:e2e       # Testes e2e
npm run test:cov       # Cobertura de testes
npm run lint           # ESLint
npm run format         # Prettier
```

## Executando a Aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

Disponível em: `http://localhost:3000`

## Roadmap

- [ ] Integração completa com Stripe
- [ ] Testes unitários e e2e
- [ ] Docker e docker-compose
- [ ] Woodpecker CI
- [ ] Tratamento de erro global
- [ ] Configuração das migrations

## Licença

[MIT](LICENSE)
