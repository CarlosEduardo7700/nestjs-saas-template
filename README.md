# NestJS SaaS Template

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descrição

Template base para construção de aplicações SaaS utilizando NestJS. Inclui arquitetura modular com classes base reutilizáveis, integração com PostgreSQL via TypeORM, validação de dados e suporte a Stripe.

## Stack Tecnológica

| Tecnologia | Descrição |
|------------|-----------|
| **NestJS** | Framework Node.js para aplicações server-side |
| **TypeORM** | ORM para TypeScript/JavaScript |
| **PostgreSQL** | Banco de dados relacional (via Supabase ou local) |
| **TypeScript** | Superset tipado do JavaScript |
| **class-validator** | Validação de dados com decorators |
| **Swagger** | Documentação automática da API |
| **JWT** | Autenticação stateless com tokens |
| **Resend** | Envio de emails transacionais |
| **Stripe** | Processamento de pagamentos e assinaturas |
| **Throttler** | Rate limiting para proteção da API |
| **Terminus** | Health checks para monitoramento |

## Setup Inicial

### 1. Pré-requisitos

- **Node.js** 18+ ([download](https://nodejs.org/))
- **PostgreSQL** ([Supabase](https://supabase.com/))
- **Stripe CLI** (opcional, para testar webhooks localmente) - [instalação](https://stripe.com/docs/stripe-cli)

### 2. Instalação das Dependências

```bash
npm install
```

### 3. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Server
PORT=3000

# Database (use a connection string do Supabase)
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

> **Nota:** Se `SALT_ROUNDS` não for definido, o valor padrão é `10`.

### 4. Executar a Aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

Disponível em: `http://localhost:3000`

## Como Usar

### Configurar Roles

O sistema possui roles para controle de acesso. Para modificar ou adicionar roles:

1. Edite o enum em `src/modules/core/user/enums/user-role.enum.ts`:

```typescript
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  // Adicione novas roles aqui
  MODERATOR = 'moderator',
}

// Define quais roles têm acesso de moderador
export const MODERATOR_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.MODERATOR];
```

2. Use o decorator `@Roles()` nos controllers para proteger rotas:

```typescript
@Roles(UserRole.ADMIN)
@Get('admin-only')
async adminRoute() { }
```

### Criar Novos Modules/Features

1. **Gere o módulo** usando o CLI do NestJS:

```bash
nest g module modules/features/nome-do-modulo
nest g controller modules/features/nome-do-modulo
nest g service modules/features/nome-do-modulo
```

2. **Crie a entidade** estendendo `BaseEntity`:

```typescript
// nome-do-modulo.entity.ts
import { BaseEntity } from 'src/common/base/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('nome_da_tabela')
export class NomeEntity extends BaseEntity {
  @Column()
  campo: string;
}
```

3. **Crie os DTOs** em `dto/requests/` e `dto/responses/`

4. **Crie a Factory** implementando `IBaseFactory`

5. **Estenda o Service** de `BaseService` e o **Controller** de `BaseController`

### Rodar Migrations

```bash
# Ver status das migrations
npm run migration:show

# Aplicar migrations pendentes
npm run migration:run

# Gerar migration baseada nas entidades
npm run migration:generate src/database/migrations/nome-da-migration

# Reverter última migration
npm run migration:revert

# Criar migration vazia (para escrita manual)
npm run migration:create src/database/migrations/nome-da-migration
```

> **Importante:** Para gerar migrations, `DATABASE_SYNCHRONIZE` deve estar `false` no `.env`.

### Adicionar Rate Limiting Customizado

1. Crie ou edite arquivo em `src/common/constants/rate-limiting/`:

```typescript
// minha-feature.rate-limits.ts
import { RateLimitsByWindow } from './interfaces/rate-limits-by-window.interface';

export const RATE_LIMITS_FOR_MINHA_ROTA: RateLimitsByWindow = {
  short: { ttl: 1000, limit: 1 },
  medium: { ttl: 60000, limit: 5 },
  long: { ttl: 3600000, limit: 10 },
};
```

2. Use no controller:

```typescript
@Throttle(RATE_LIMITS_FOR_MINHA_ROTA)
@Post()
async minhaRota() { }
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
| `POST` | `/user` | Criar novo usuário (público) |
| `GET` | `/user/me` | Obter dados do usuário autenticado |
| `PATCH` | `/user/me` | Atualizar perfil do usuário autenticado |
| `DELETE` | `/user/me` | Deletar conta do usuário autenticado |
| `GET` | `/user` | Listar todos usuários (moderador) |
| `GET` | `/user/:id` | Buscar usuário por ID (moderador) |
| `PATCH` | `/user/:id` | Atualizar usuário por ID (moderador) |
| `DELETE` | `/user/:id` | Deletar usuário por ID (moderador) |

### Payments

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/payments/checkout` | Criar sessão de checkout do Stripe |
| `POST` | `/payments/webhook` | Receber eventos do Stripe (público, chamado pelo Stripe) |

### Health

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Status completo (DB, memória, disco) |
| `GET` | `/health/live` | Liveness probe (aplicação responde) |
| `GET` | `/health/ready` | Readiness probe (banco conectado) |

> **Nota:** Exceto rotas marcadas como públicas, todos os endpoints requerem autenticação via Bearer Token no header `Authorization`.

## Documentação da API (Swagger)

A documentação interativa da API está disponível em:

```
http://localhost:3000/api/docs
```

Na interface do Swagger você pode:
- Visualizar todos os endpoints disponíveis
- Testar requisições diretamente no navegador
- Autenticar usando o botão "Authorize" (Bearer Token)
- Ver schemas de request/response

## CORS

CORS está configurado em `src/configs/cors.config.ts`:

```typescript
export const corsConfig: CorsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
```

Para produção, defina `FRONTEND_URL` no `.env` com a URL do seu frontend.

## Estrutura de Configurações

As configurações da aplicação estão centralizadas em `src/configs/`:

```
src/configs/
├── cors.config.ts              # Configuração de CORS
├── swagger.config.ts           # Configuração do Swagger/OpenAPI
├── validation.config.ts        # Configuração do ValidationPipe
└── rate-limiting/              # Configurações de rate limiting
    ├── interfaces/
    ├── global.rate-limits.ts
    ├── auth.rate-limits.ts
    └── user.rate-limits.ts
```

Cada arquivo exporta uma configuração tipada que é importada no `main.ts` ou nos módulos correspondentes.

## Stripe

A aplicação utiliza Stripe para processamento de pagamentos e gerenciamento de assinaturas.

### Configuração

1. Crie uma conta no [Stripe](https://stripe.com/) e obtenha as chaves de API
2. Configure as variáveis de ambiente no `.env`:

### Fluxo de Pagamento

1. Usuário autenticado chama `POST /payments/checkout`
2. API cria uma sessão de checkout no Stripe e retorna a URL
3. Usuário é redirecionado para página de pagamento do Stripe
4. Após pagamento, Stripe envia evento para `POST /payments/webhook`
5. Webhook processa o evento e atualiza `isPremium` do usuário

### Testar Webhooks em Desenvolvimento

Para receber eventos do Stripe localmente, use o Stripe CLI:

```bash
# Instalar Stripe CLI (Windows - via Scoop)
scoop install stripe

# Ou via Chocolatey
choco install stripe-cli

# Login no Stripe
stripe login

# Encaminhar webhooks para sua aplicação local
stripe listen --forward-to localhost:3000/payments/webhook
```

O comando `stripe listen` irá exibir um `webhook signing secret` (começa com `whsec_`). Use esse valor na variável `STRIPE_WEBHOOK_SECRET` do `.env`.

### Testar Pagamentos

Em modo teste, use os cartões de teste do Stripe:

| Cartão | Número | Resultado |
|--------|--------|-----------|
| Sucesso | `4242 4242 4242 4242` | Pagamento aprovado |
| Recusado | `4000 0000 0000 0002` | Cartão recusado |
| Autenticação | `4000 0025 0000 3155` | Requer 3D Secure |

Use qualquer data futura para validade e qualquer CVC de 3 dígitos.

### Proteger Rotas Premium

Use o decorator `@Premium()` para restringir rotas a usuários com assinatura ativa:

```typescript
import { Premium } from 'src/common/decorators/premium.decorator';

@Controller('features')
export class FeaturesController {
  @Get('advanced')
  @Premium()  // Apenas usuários com isPremium: true
  async premiumFeature() {
    return { data: 'Conteúdo exclusivo para assinantes!' };
  }
}
```

O `SubscriptionGuard` (já configurado globalmente) verifica automaticamente o campo `isPremium` no JWT do usuário. Se o usuário não for premium, retorna `403 Forbidden`.

## Health Checks

### Indicadores

| Indicador | Descrição | Limite |
|-----------|-----------|--------|
| `database` | Conexão com PostgreSQL | Ping OK |
| `memory_heap` | Memória heap do Node.js | 300 MB |
| `memory_rss` | Memória RSS do processo | 500 MB |
| `disk` | Espaço em disco disponível | 5% livre |

## Rate Limiting

A API possui proteção contra abuso com limites de requisições em múltiplas janelas de tempo.

### Limites Globais

Aplicados a todos os endpoints:

| Janela | Limite |
|--------|--------|
| 1 segundo | 3 requests |
| 10 segundos | 20 requests |
| 1 minuto | 100 requests |

### Limites em Rotas Sensíveis

Rotas com limites mais restritivos:

| Rota | 1 min | 1 hora |
|------|-------|--------|
| `POST /auth/login` | 5 | 20 |
| `POST /auth/forgot-password` | 3 | 5 |
| `POST /auth/reset-password` | 5 | 10 |
| `POST /user` (cadastro) | 5 | 10 |

> **Nota:** Quando o limite é excedido, a API retorna status `429 Too Many Requests`.

### Configuração

Os limites são configurados em `src/common/constants/rate-limiting/`:

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run start` | Iniciar aplicação |
| `npm run start:dev` | Modo watch (desenvolvimento) |
| `npm run start:debug` | Modo debug |
| `npm run start:prod` | Produção (requer build) |
| `npm run build` | Build para produção |
| `npm run lint` | Executar ESLint |
| `npm run format` | Formatar código com Prettier |
| `npm run test` | Testes unitários |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:cov` | Cobertura de testes |
| `npm run test:e2e` | Testes end-to-end |
| `npm run migration:generate` | Gerar migration |
| `npm run migration:run` | Executar migrations |
| `npm run migration:show` | Listar status das migrations |
| `npm run migration:revert` | Reverter última migration |
| `npm run migration:create` | Criar migration vazia |

## Licença

[MIT](LICENSE)
