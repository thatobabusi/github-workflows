# Symfony Essentials

The component framework: explicit wiring, Doctrine's Data Mapper, and long-term-support discipline. Chosen [when](../PHP_FRAMEWORKS.md): enterprise lifespan, DDD builds, teams that want architecture enforced.

## Setup & Daily CLI

```bash
symfony new app --webapp             # full-stack skeleton (or composer create-project)
symfony serve -d                     # local TLS dev server
symfony console                      # = bin/console

bin/console make:controller OrderController      # MakerBundle scaffolding
bin/console make:entity Order
bin/console make:migration && bin/console doctrine:migrations:migrate
bin/console debug:router             # what's actually registered
bin/console debug:autowiring mailer  # what can I typehint?
bin/console cache:clear
```

`debug:*` commands are the framework's superpower — when confused, ask the container, don't grep.

## Controllers & Routing

Attributes co-locate the route with the code:

```php
#[Route('/api/v1/orders', name: 'api_orders_')]
final class OrderController extends AbstractController
{
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] CreateOrderRequest $dto,   // deserialize + validate
        OrderService $orders,                            // autowired
    ): JsonResponse {
        $order = $orders->place($this->getUser(), $dto);
        return $this->json($order, 201, context: ['groups' => 'order:read']);
    }
}
```

- `#[MapRequestPayload]` + a validated DTO = Laravel's Form Request equivalent
- Controllers stay thin; services do the work — the universal rule

## The Container: Autowiring

```yaml
# config/services.yaml — this block IS the DI story for most apps
services:
    _defaults:
        autowire: true          # typehint = injection
        autoconfigure: true     # interfaces auto-tag (commands, listeners...)

    App\:
        resource: '../src/'
```

Constructor-typehint anything under `src/` and it arrives. Interface with multiple implementations → named autowiring or a `when@` environment override. Everything is explicit and inspectable (`debug:container`) — the philosophical opposite of facades.

## Doctrine (Data Mapper)

Entities are plain objects; the EntityManager tracks and flushes:

```php
#[ORM\Entity(repositoryClass: OrderRepository::class)]
class Order
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[ORM\Column(enumType: OrderStatus::class)]
    private OrderStatus $status = OrderStatus::Pending;

    // behavior lives ON the entity — this is the DDD payoff
    public function cancel(): void
    {
        if ($this->status === OrderStatus::Shipped) {
            throw new DomainException('Shipped orders cannot be cancelled');
        }
        $this->status = OrderStatus::Cancelled;
    }
}
```

```php
// Unit of work: mutate objects, flush once
$order->cancel();
$em->flush();                        // computes and runs the UPDATEs
```

vs Eloquent: entities never touch the DB themselves — pure domain objects, [DDD layers](../PHP_PROJECT_STRUCTURES.md) come naturally. Cost: more ceremony for simple CRUD. Custom queries live in repository classes (QueryBuilder/DQL); the [N+1 rules](../../../../SECURITY_PERFORMANCE.md) apply — `->addSelect()` joins are your eager loading.

## Messenger (Queues)

```php
// Message = dumb DTO; Handler = the work
final readonly class SendOrderConfirmation
{
    public function __construct(public int $orderId) {}
}

#[AsMessageHandler]
final class SendOrderConfirmationHandler
{
    public function __invoke(SendOrderConfirmation $message): void { /* ... */ }
}

$bus->dispatch(new SendOrderConfirmation($order->getId()));
```

```yaml
framework:
    messenger:
        transports:
            async: '%env(MESSENGER_TRANSPORT_DSN)%'   # doctrine://, redis://, amqp://
        routing:
            App\Message\SendOrderConfirmation: async
```

`messenger:consume async` under supervisor; retries + failure transport configured, per the [async rules](../../../../ASYNC_PATTERNS.md).

## Forms, Validation, Serializer

- Validation as attributes on DTOs/entities: `#[Assert\NotBlank]`, `#[Assert\Positive]`
- Serialization groups control API shape (`order:read`, `order:write`) — the [Resource-layer rule](../../../../API_STANDARDS.md) via config
- The Form component earns its complexity in admin-heavy apps; for JSON APIs, MapRequestPayload DTOs are lighter

## Environments & Config

```
.env → .env.local (gitignored) → real env vars (prod wins)
config/packages/*.yaml + when@prod overrides
```

Secrets: `bin/console secrets:set MAILER_DSN --env=prod` — encrypted vault, committable, decrypt key deployed separately.

## Release Discipline

- Two minors per year; **LTS every two years (6.4, 7.4...) with 3 years support** — pin enterprise work to LTS
- Deprecation-driven upgrades: fix deprecation logs on current version until clean, then bump — the smoothest major-upgrade story in PHP
- `composer recipes` (Flex) manages config boilerplate on package install

## See Also

- [PHP Frameworks](../PHP_FRAMEWORKS.md) — Symfony vs Laravel honestly
- [Laravel Essentials](../laravel/LARAVEL_ESSENTIALS.md)
- [PHP Design Patterns](../PHP_DESIGN_PATTERNS.md) — DI, the meta-pattern
