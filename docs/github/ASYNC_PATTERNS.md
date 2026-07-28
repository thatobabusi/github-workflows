# Async Patterns

Standards for queues, background jobs, scheduled tasks, and real-time features.

## When to Go Async

| Work | Sync or Async? |
|------|----------------|
| Database read for current response | Sync |
| Sending email / notification | **Queue** |
| Image/video processing | **Queue** |
| Third-party API calls (non-blocking) | **Queue** |
| Report generation / exports | **Queue** |
| Webhook delivery | **Queue** |
| Cleanup, digests, syncs | **Scheduler** |
| Live UI updates | **Broadcasting** |

Rule of thumb: if the user doesn't need the result in this response and it takes >200ms, queue it.

## Job Standards

### Structure

```php
class ProcessUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 60, 300];   // escalating retry delays
    public $timeout = 120;

    public function __construct(public Upload $upload) {}

    public function handle(): void
    {
        // Idempotent — safe to run twice
    }

    public function failed(Throwable $e): void
    {
        $this->upload->markFailed();
        Log::error('Upload processing failed', [
            'upload_id' => $this->upload->id,
            'error' => $e->getMessage(),
        ]);
    }
}
```

### Requirements

1. **Idempotent** — jobs retry; running twice must not double-charge, double-send, or duplicate rows. Use `updateOrCreate`, unique constraints, or `ShouldBeUnique`.
2. **Explicit failure handling** — every job defines `failed()`. Silent failures are bugs.
3. **Bounded retries** — set `$tries` and `$backoff`. Infinite retries mask real problems.
4. **Timeout set** — default to `$timeout = 120` unless the work genuinely needs longer.
5. **Small payloads** — pass models (auto-serialized to IDs), never large arrays or file contents.

### Uniqueness

```php
class SyncAccount implements ShouldQueue, ShouldBeUnique
{
    public function uniqueId(): string
    {
        return "account-{$this->account->id}";
    }

    public function uniqueFor(): int
    {
        return 3600;
    }
}
```

### Chaining & Batching

```php
// Sequential pipeline — stops on first failure
Bus::chain([
    new ProcessVideo($video),
    new GenerateThumbnails($video),
    new NotifyUploader($video),
])->dispatch();

// Parallel batch with completion callback
Bus::batch($videos->map(fn ($v) => new ProcessVideo($v)))
    ->then(fn (Batch $batch) => Log::info('All videos processed'))
    ->catch(fn (Batch $batch, Throwable $e) => Log::error('Batch failed'))
    ->dispatch();
```

## Scheduler Standards

```php
protected function schedule(Schedule $schedule): void
{
    $schedule->command('reports:daily')
        ->dailyAt('02:00')
        ->timezone('Africa/Johannesburg')
        ->onOneServer()          // required in multi-server setups
        ->withoutOverlapping()   // required for anything > 1 min
        ->emailOutputOnFailure(config('mail.admin'));
}
```

Requirements:

- `withoutOverlapping()` on any task that could outlive its interval
- `onOneServer()` in horizontally-scaled environments
- Failure notification path defined (email, Slack channel)
- Timezone explicit — never rely on server default

## Worker Operations

```bash
# Development
php artisan queue:work

# Production — always via supervisor, restart on deploy
php artisan queue:restart   # in deploy script

# Monitoring
php artisan queue:failed
php artisan queue:retry {id}
```

Production requirements:

- Workers run under Supervisor/systemd with auto-restart
- `queue:restart` in every deploy (workers hold old code in memory)
- Failed jobs table migrated and monitored
- Horizon for Redis queues (dashboard + metrics)

## Broadcasting Standards

### Channel Choice

| Channel | Use For | Auth |
|---------|---------|------|
| `Channel` (public) | Live scores, public feeds | None |
| `PrivateChannel` | User notifications, private data | Required |
| `PresenceChannel` | Chat rooms, "who's online" | Required + member info |

### Event Pattern

```php
class OrderShipped implements ShouldBroadcast
{
    public function __construct(public Order $order) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel("orders.{$this->order->user_id}");
    }

    public function broadcastWith(): array
    {
        // Only what the client needs — never the full model
        return ['id' => $this->order->id, 'status' => 'shipped'];
    }
}
```

```javascript
Echo.private(`orders.${userId}`)
    .listen('OrderShipped', (e) => updateOrderStatus(e.id, e.status));
```

Rules:

- Authorize every private/presence channel in `routes/channels.php`
- `broadcastWith()` returns minimal payloads — the client fetches details if needed
- Use `ShouldBroadcastNow` only for latency-critical events; default queues broadcasts

## See Also

- [Security & Performance](SECURITY_PERFORMANCE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md) — worker restart on deploy
- [Design Patterns](DESIGN_PATTERNS.md) — observer/event patterns
