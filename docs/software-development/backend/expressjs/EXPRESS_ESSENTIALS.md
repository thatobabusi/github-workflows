# Express Essentials

The lingua franca of Node web servers — minimal, middleware-everything, and still everywhere. For new builds compare [Node Essentials](../node/NODE_ESSENTIALS.md) (Fastify is the modern default); for existing Express codebases, this is the discipline.

## The Mental Model: Everything Is Middleware

```typescript
import express from 'express';

const app = express();

app.use(express.json());                          // body parsing
app.use('/api', authenticate);                    // scoped middleware

app.get('/api/orders/:id', async (req, res, next) => {
    try {
        const order = await orderService.find(Number(req.params.id));
        if (!order) return res.status(404).json({ message: 'Not found' });
        res.json(order);
    } catch (err) {
        next(err);                                // ALWAYS forward async errors
    }
});

app.use(errorHandler);                            // 4-arg middleware, LAST
app.listen(3000);
```

Request flows through the middleware stack in registration order — order is behavior.

## The Async Error Trap (the #1 Express bug)

Express 4 does **not** catch rejected promises — an unhandled async throw hangs the request:

```typescript
// ❌ Express 4: rejection escapes, request hangs
app.get('/orders', async (req, res) => {
    res.json(await orderService.list());          // throws → nothing happens
});

// ✅ Options, best first:
// 1. Express 5: async handlers forwarded automatically — upgrade
// 2. Wrap: const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);
app.get('/orders', asyncHandler(async (req, res) => {
    res.json(await orderService.list());
}));
```

## Centralized Error Handler

```typescript
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidationError) {
        return res.status(422).json({ message: 'Validation failed', errors: err.details });
    }
    logger.error({ err, url: req.url });
    res.status(500).json({ message: 'Internal server error' });   // never leak stacks
});
```

One handler, [API Standards](../../../API_STANDARDS.md) status codes, opaque 500s in production.

## Structure & Validation

Routes thin, services do the work — the universal rule ([Node layout](../node/NODE_ESSENTIALS.md)):

```typescript
// routes/orders.ts — wiring only
router.post('/', validate(createOrderSchema), asyncHandler(ordersController.create));

// Zod at the boundary
const createOrderSchema = z.object({
    body: z.object({ productId: z.number().int(), quantity: z.number().int().min(1) }),
});
```

## Production Middleware Stack

```typescript
app.set('trust proxy', 1);                        // behind nginx/load balancer
app.use(helmet());                                // security headers
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));          // cap payloads
app.use(rateLimit({ windowMs: 60_000, max: 60 }));// per-IP throttle
app.use(pinoHttp({ logger }));                    // structured request logs
```

Plus the [Node production rules](../node/NODE_ESSENTIALS.md): graceful `SIGTERM` shutdown, health endpoint, supervisor, `npm ci`.

## Express 4 vs 5

| | 4.x | 5.x |
|--|-----|-----|
| Async error forwarding | Manual (`asyncHandler`) | Automatic |
| `req.query` | Mutable object | Getter (read-only) |
| Wildcard routes | `*` | `*splat` named |
| Status | Legacy default | Current — use for new Express work |

## See Also

- [Node Essentials](../node/NODE_ESSENTIALS.md) — runtime rules + Fastify comparison
- [NestJS Essentials](../../frontend/javascript/nestjs/NESTJS_ESSENTIALS.md) — Express with architecture included
- [API Standards](../../../API_STANDARDS.md)
