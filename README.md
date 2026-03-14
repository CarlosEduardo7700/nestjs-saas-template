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
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/database
DATABASE_SYNCHRONIZE=true
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

## Endpoints

### Auth

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Autenticar usuário (público) |

### User

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/user` | Criar usuário (público) |
| `GET` | `/user` | Listar usuários |
| `GET` | `/user/:id` | Buscar usuário por ID |
| `PATCH` | `/user/:id` | Atualizar usuário |
| `DELETE` | `/user/:id` | Deletar usuário |

> **Nota:** Exceto rotas marcadas como públicas, todos os endpoints requerem autenticação via Bearer Token no header `Authorization`.

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
