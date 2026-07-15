# PHP Design Patterns

How the classic patterns actually look in modern PHP — idiomatic implementations, not textbook UML transcription. Language-agnostic pattern *selection* guidance lives in [Design Patterns](../../DESIGN_PATTERNS.md); this doc is the PHP-specific how.

## Dependency Injection — the Meta-Pattern

Everything else hangs off this. In PHP you rarely build patterns by hand — the container assembles them:

```php
// Bind interface → implementation (Laravel ServiceProvider)
$this->app->bind(PaymentGateway::class, StripeGateway::class);

// Contextual binding — different implementation per consumer
$this->app->when(RefundService::class)
    ->needs(PaymentGateway::class)
    ->give(PayFastGateway::class);

// Constructor injection everywhere; container resolves the graph
final class CheckoutService
{
    public function __construct(
        private readonly PaymentGateway $gateway,
        private readonly OrderRepository $orders,
    ) {}
}
```

Never `new` a service inside another service; never reach for facades inside domain code.

## Factory

**Static factory methods** for expressive construction:

```php
final class Money
{
    private function __construct(
        public readonly int $cents,
        public readonly string $currency,
    ) {}

    public static function fromRands(float $amount): self
    {
        return new self((int) round($amount * 100), 'ZAR');
    }

    public static function zero(string $currency = 'ZAR'): self
    {
        return new self(0, $currency);
    }
}
```

**Factory class** when construction needs dependencies or runtime choice:

```php
final class GatewayFactory
{
    public function for(PaymentMethod $method): PaymentGateway
    {
        return match ($method) {
            PaymentMethod::Card => new StripeGateway(config('services.stripe')),
            PaymentMethod::Eft => new PayFastGateway(config('services.payfast')),
        };
    }
}
```

`match` on an enum replaces most GoF factory hierarchies.

## Strategy

Interface + implementations + container/match selection:

```php
interface ShippingCalculator
{
    public function cost(Parcel $parcel): Money;
}

final class CourierCalculator implements ShippingCalculator { /* ... */ }
final class CollectionCalculator implements ShippingCalculator { /* ... */ }

// Selection is just the factory pattern above; consumers depend on the interface
```

## Decorator

Wrap an implementation to layer behavior — caching is the canonical PHP case:

```php
final class CachedProductRepository implements ProductRepository
{
    public function __construct(
        private readonly ProductRepository $inner,
        private readonly Cache $cache,
    ) {}

    public function find(int $id): ?Product
    {
        return $this->cache->remember(
            "product:$id",
            3600,
            fn () => $this->inner->find($id),
        );
    }
}

// Container wiring
$this->app->bind(ProductRepository::class, function ($app) {
    return new CachedProductRepository(
        $app->make(EloquentProductRepository::class),
        $app->make(Cache::class),
    );
});
```

Consumers never know the cache exists.

## Observer

In PHP practice this is **events + listeners**, not hand-rolled subject lists:

```php
final class OrderPlaced
{
    public function __construct(public readonly Order $order) {}
}

final class ReserveStock implements ShouldQueue
{
    public function handle(OrderPlaced $event): void { /* ... */ }
}

// Emit from the domain/service:
event(new OrderPlaced($order));
```

Model observers cover the lifecycle flavor (`created`, `updated`, `deleted`) — reserve them for framework concerns like cache busting.

## Adapter

Make a third-party API speak your interface:

```php
interface SmsSender
{
    public function send(PhoneNumber $to, string $message): void;
}

final class TwilioAdapter implements SmsSender
{
    public function __construct(private readonly TwilioClient $client) {}

    public function send(PhoneNumber $to, string $message): void
    {
        $this->client->messages->create($to->e164(), [
            'from' => config('services.twilio.from'),
            'body' => $message,
        ]);
    }
}
```

Vendor SDK types never leak past the adapter. Swapping vendors = one new adapter.

## Chain of Responsibility

PSR-15 middleware and Laravel pipelines *are* this pattern:

```php
Pipeline::send($order)
    ->through([
        ValidateInventory::class,   // each: handle($order, Closure $next)
        ApplyDiscounts::class,
        CalculateTax::class,
    ])
    ->then(fn (Order $order) => $order);
```

## Builder

For objects with many optional parts — fluent, immutable steps:

```php
$report = ReportBuilder::for($user)
    ->between($start, $end)
    ->withRefunds()
    ->groupBy(Period::Week)
    ->build();
```

Eloquent's query builder is the reference implementation you already use daily. Don't build Builders for objects with ≤3 constructor args — named arguments cover it.

## Null Object

Kill the `if ($logger !== null)` noise:

```php
final class NullNotifier implements Notifier
{
    public function notify(User $user, string $message): void
    {
        // intentionally nothing
    }
}

// Bind per environment
$this->app->bind(Notifier::class, fn () =>
    app()->environment('testing') ? new NullNotifier() : new SlackNotifier());
```

## Singleton — the Anti-Pattern Exception

Don't write `getInstance()` singletons — that's the container's job:

```php
// "Singleton" the PHP way: shared container binding
$this->app->singleton(RateLimiter::class);
```

Same lifetime guarantee, zero global state, fully testable.

## Pattern Smells in PHP Codebases

| Smell | Likely Fix |
|-------|-----------|
| `new SomeService()` inside a class | Constructor injection |
| Interfaces with exactly one conceivable implementation, forever | Delete the interface |
| `AbstractBaseManagerFactory` | You've transcribed Java; use closures/match |
| Repository wrapping Eloquent 1:1 | Use the model directly ([when repositories earn their keep](../../DESIGN_PATTERNS.md)) |
| Trait with state used by 20 classes | That's a dependency, make it a class |

## See Also

- [Design Patterns](../../DESIGN_PATTERNS.md) — selection guidance
- [PHP Coding Styles](PHP_CODING_STYLES.md)
- [PHP Project Structures](PHP_PROJECT_STRUCTURES.md)
