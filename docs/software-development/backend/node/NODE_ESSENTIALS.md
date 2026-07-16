# Node.js Essentials

Runtime conventions, project setup, the framework landscape, and production rules for server-side JavaScript/TypeScript.

## Project Setup

```
service/
├── src/
│   ├── index.ts              # entry — wiring only
│   ├── routes/
│   ├── services/             # business logic, framework-free
│   ├── lib/                  # pure utilities
│   └── config.ts             # env parsing, validated once
├── tests/
├── dist/                     # build output (gitignored)
├── package.json
├── tsconfig.json             # strict: true, always
├── .nvmrc                    # pin the Node major (e.g. 22)
└── eslint.config.js
```

```json
// package.json — the contract
{
    "type": "module",
    "engines": { "node": ">=22" },
    "scripts": {
        "dev": "tsx watch src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js",
        "lint": "eslint src && tsc --noEmit",
        "test": "vitest run"
    }
}
```

- **TypeScript strict by default** — plain JS only for scripts under ~50 lines
- ESM (`"type": "module"`) for new projects; no new CommonJS
- Pin the runtime: `.nvmrc` + `engines` + the same version in [CI](../../../LINTING_GATES.md)
- Lockfile committed; `npm ci` (never `npm install`) in CI and deploys — the [composer install/update distinction](../../composer/COMPOSER_CHEAT_SHEET.md), same rule

## Runtime Fundamentals

The event loop in one rule: **never block it.**

```typescript
// ❌ Blocks every request in the process
const hash = crypto.pbkdf2Sync(password, salt, 600_000, 64, 'sha512');

// ✅ Async form keeps the loop free
const hash = await promisify(crypto.pbkdf2)(password, salt, 600_000, 64, 'sha512');
```

- CPU-heavy work → `worker_threads` or a [queue](../../../ASYNC_PATTERNS.md) — one blocked loop = every user waiting
- `async/await` everywhere; raw `.then()` chains and callbacks only at library boundaries
- Always handle the escape hatches in production:

```typescript
process.on('unhandledRejection', (err) => { logger.error(err); process.exit(1); });
process.on('SIGTERM', () => server.close(() => process.exit(0)));   // graceful shutdown
```

## Framework Landscape

| You're Building | Reach For |
|-----------------|-----------|
| REST API (default) | **Fastify** (or Express if team knows it) |
| Enterprise app, DI/decorators culture | NestJS |
| Full-stack React | [Next.js](../../frontend/javascript/nextjs/NEXTJS_ESSENTIALS.md) API routes / server actions |
| Type-safe internal APIs | tRPC |
| Edge/serverless functions | Hono |

```typescript
// Fastify — schema-validated route (the FastAPI instinct in JS)
app.post('/orders', {
    schema: {
        body: Type.Object({ productId: Type.Integer(), quantity: Type.Integer({ minimum: 1 }) }),
    },
}, async (request) => orderService.place(request.body));
```

**Express** is the lingua franca but unmaintained-feeling; **Fastify** is the modern default (schema validation, speed, plugins). **NestJS** brings Angular-style structure — worth it for large teams, ceremony for small ones.

## Environment & Config

```typescript
// config.ts — parse and validate ONCE at boot, export typed
import { z } from 'zod';

const env = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3000),
}).parse(process.env);

export default env;
```

Boot fails loudly on missing config instead of crashing at 3am on first use. Secrets via env only — [same rule as every stack](../../../SECURITY_PERFORMANCE.md).

## Testing

| Tool | Role |
|------|------|
| **Vitest** | Unit/integration — fast, ESM-native, Jest-compatible API |
| **Supertest** / `app.inject()` (Fastify) | HTTP endpoint tests without a port |
| **Playwright** | E2E ([Testing doctrine](../../../TESTING.md)) |
| **Testcontainers** | Real Postgres/Redis in integration tests |

## Production Rules

- Run under a supervisor: systemd, PM2, or a [container](../../docker/DOCKER_CHEAT_SHEET.md) orchestrator — never bare `node` in a tmux
- One process per core via cluster mode or (better) horizontal container replicas
- Structured JSON logs to stdout (pino); the platform ships them
- Health endpoint + graceful shutdown wired into the [deploy gate](../../../DEPLOYMENT_GUIDE.md)
- `npm audit` in the [security scan](../../../SECURITY_PERFORMANCE.md); dependencies reviewed before adding — node_modules is a supply-chain surface

## Tooling Quick Reference

| Task | Tool |
|------|------|
| Run TS directly in dev | `tsx` |
| Lint + format | ESLint flat config + Prettier |
| Version manager | `fnm` / `nvm` (reads .nvmrc) |
| Faster installs / monorepos | `pnpm` workspaces ([Monorepo Structure](../../../MONOREPO_STRUCTURE.md)) |
| Publish a library | `tsup` (bundles ESM+CJS+types) |

## See Also

- [Frontend stacks](../../frontend/README.md) — React, Vue, Angular, Next.js
- [Async Patterns](../../../ASYNC_PATTERNS.md)
- [Docker Cheat Sheet](../../docker/DOCKER_CHEAT_SHEET.md)
