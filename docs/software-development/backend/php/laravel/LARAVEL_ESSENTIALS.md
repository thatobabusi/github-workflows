# Laravel Essentials

The house framework's working conventions — what goes where, the daily commands, and the ecosystem map. Full API-level reference lives in the [Laravel 13 Cheat Sheet](https://thatobabusi.github.io/laravel-13-cheat-sheet/) site.

## Daily Artisan

```bash
php artisan serve                    # dev server (or Herd handles it)
php artisan tinker                   # REPL — try queries before writing them

php artisan make:model Order -mfsc   # model + migration + factory + seeder + controller
php artisan make:request StoreOrderRequest
php artisan make:job ProcessUpload
php artisan make:policy OrderPolicy --model=Order

php artisan migrate                  # ; migrate:fresh --seed in dev ONLY
php artisan route:list --except-vendor
php artisan queue:work
php artisan schedule:work            # run the scheduler locally

php artisan optimize                 # config+route+view cache (deploy)
php artisan optimize:clear           # nuke all caches when things are weird
```

## Where Logic Lives

The routing table for code ([full layout](../PHP_PROJECT_STRUCTURES.md)):

| Concern | Home | Never In |
|---------|------|----------|
| Validation | Form Requests | Controllers |
| Authorization | Policies (`$this->authorize()`) | Blade conditionals alone |
| Business logic spanning models | `app/Services/` | Controllers, Models |
| Query shapes used twice | Model scopes | Copy-pasted where-chains |
| API output shape | Resources | `return $model` — never |
| Side effects (mail, cache-bust) | Events + queued Listeners | Inline in the happy path |
| Slow work (>200ms, not needed now) | [Queued Jobs](../../../../ASYNC_PATTERNS.md) | The request cycle |

Controller test: if a controller method exceeds ~10 lines, something above is in the wrong home.

## Eloquent Conventions

```php
// Relationships declare return types — enables IDE + static analysis
public function lines(): HasMany
{
    return $this->hasMany(OrderLine::class);
}

// Scopes for every repeated constraint
public function scopePending(Builder $q): Builder
{
    return $q->where('status', OrderStatus::Pending);
}

// Casts do the type work
protected function casts(): array
{
    return [
        'status' => OrderStatus::class,        // backed enum
        'meta' => 'array',
        'paid_at' => 'immutable_datetime',
    ];
}
```

- `$fillable` whitelist + `create($request->validated())` — the [mass-assignment rule](../../../../SECURITY_PERFORMANCE.md)
- Eager load or be caught: `Model::preventLazyLoading(!app()->isProduction())` in AppServiceProvider makes N+1s throw in dev
- `updateOrCreate` / unique indexes for [idempotent writes](../../../../ASYNC_PATTERNS.md)

## Request Lifecycle Cheat Line

```
public/index.php → bootstrap → middleware (global → group → route)
    → Form Request (validate + authorize) → Controller → Service
    → Response/Resource → middleware (out) → kernel terminate
```

Knowing where a concern intercepts (middleware vs form request vs policy) kills most "where do I put this" debates.

## Testing Defaults

```php
use RefreshDatabase;                          // per-test DB reset

public function test_owner_can_cancel_order(): void
{
    $order = Order::factory()->for($this->user)->create();

    $this->actingAs($this->user)
        ->deleteJson("/api/v1/orders/{$order->id}")
        ->assertNoContent();

    $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'cancelled']);
}
```

Fakes over mocks: `Queue::fake()`, `Notification::fake()`, `Storage::fake()`, `Http::fake()` — then assert. Coverage floors and layers per [Code Quality](../../../../CODE_QUALITY.md).

## Ecosystem Map

| Need | First-Party Answer |
|------|-------------------|
| Local dev (Windows/Mac) | **Herd** |
| Code style | Pint (in the [lint gate](../../../../LINTING_GATES.md)) |
| Static analysis | Larastan |
| API auth | Sanctum ([API Standards](../../../../API_STANDARDS.md)) |
| Queues dashboard | Horizon (Redis) |
| Debugging | Telescope (dev) / Pulse (prod vitals) |
| Server provisioning | Forge |
| Serverless | Vapor |
| Admin panels | Filament (community, de facto standard) |

## Deploy Notes

The [Deployment Guide](../../../../DEPLOYMENT_GUIDE.md) applies; Laravel specifics:

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize                 # config/route/view/event caches
php artisan queue:restart            # workers pick up new code
```

`APP_DEBUG=false`, config cached (which means: **no `env()` outside config files** — cached config never re-reads .env).

## See Also

- [PHP Frameworks](../PHP_FRAMEWORKS.md) — Laravel vs the field
- [Symfony Essentials](../symfony/SYMFONY_ESSENTIALS.md)
- [Laravel 13 Cheat Sheet](https://thatobabusi.github.io/laravel-13-cheat-sheet/) — the full reference site
