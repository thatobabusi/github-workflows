# NestJS Essentials

The structured Node framework: Angular's architecture (modules, DI, decorators) applied to the backend. [When](../../../backend/node/NODE_ESSENTIALS.md): large teams, enterprise culture, or when Express-style freedom has already produced a mess.

## The Building Blocks

```typescript
// orders.module.ts — the feature boundary
@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],                 // explicit public surface
})
export class OrdersModule {}
```

```typescript
// orders.controller.ts — thin, decorated, validated
@Controller('api/v1/orders')
export class OrdersController {
    constructor(private readonly orders: OrdersService) {}   // constructor DI

    @Post()
    @HttpCode(201)
    create(@Body() dto: CreateOrderDto, @CurrentUser() user: User) {
        return this.orders.place(user, dto);
    }
}
```

```typescript
// create-order.dto.ts — class-validator does the boundary work
export class CreateOrderDto {
    @IsInt() productId: number;
    @IsInt() @Min(1) quantity: number = 1;
}
```

```typescript
// main.ts — global validation ON, always
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

`whitelist: true` strips unknown fields — the [mass-assignment rule](../../../../SECURITY_PERFORMANCE.md) for Node.

## The Request Pipeline

```
Middleware → Guards → Interceptors (pre) → Pipes → Handler → Interceptors (post) → Filters
```

| Piece | Job | Example |
|-------|-----|---------|
| Guard | Can this request proceed? | `JwtAuthGuard`, `RolesGuard` |
| Pipe | Transform + validate input | `ValidationPipe`, `ParseIntPipe` |
| Interceptor | Wrap handler (logging, caching, mapping) | timing, response shaping |
| Exception filter | Errors → HTTP responses | domain-exception mapping |

Knowing which slot a concern belongs to is 80% of NestJS competence — the same "where does this live" discipline as [Laravel's lifecycle](../../../backend/php/laravel/LARAVEL_ESSENTIALS.md).

## Module Discipline

- One module per domain feature; `exports` only what others may use — package-by-feature with enforced boundaries
- Circular module dependencies (`forwardRef`) are a design smell: extract the shared piece
- `@Injectable()` services hold logic; controllers never touch the ORM directly

## Config & Data

```typescript
// Typed, validated config at boot (the Zod-at-boot rule, Nest-style)
ConfigModule.forRoot({ validate: (env) => envSchema.parse(env), isGlobal: true });
```

ORM: TypeORM or Prisma both first-class; repositories injected, entities never returned raw from controllers ([API Standards](../../../../API_STANDARDS.md) — map to response DTOs).

## Testing

```typescript
const module = await Test.createTestingModule({
    providers: [OrdersService, { provide: OrderRepository, useValue: mockRepo }],
}).compile();
```

DI makes unit tests cheap; `@nestjs/testing` + Supertest for e2e (`app.getHttpServer()`); Testcontainers for real databases.

## Honest Positioning

| vs | Verdict |
|----|---------|
| [Express](../../../backend/expressjs/EXPRESS_ESSENTIALS.md) | Nest = Express (default adapter) + architecture; swap to Fastify adapter for speed |
| Fastify raw | Less ceremony, fewer decorators; Nest wins on large-team consistency |
| [Spring Boot](../../../backend/java/springboot/SPRINGBOOT_ESSENTIALS.md) | Nest is its JS twin — same DI/annotation culture, deliberate |

Cost: decorator/DI ceremony on small services; learning curve. Payoff begins around the third module or third developer.

## See Also

- [Node Essentials](../../../backend/node/NODE_ESSENTIALS.md)
- [Angular Essentials](../angularjs/ANGULAR_ESSENTIALS.md) — the architectural sibling
- [API Standards](../../../../API_STANDARDS.md)
