# Design Patterns Catalog

Approved patterns, when to use each, and when *not* to. Patterns solve problems — applying them without the problem is complexity for free.

## Decision Table

| You Need To... | Use | Don't Use |
|----------------|-----|-----------|
| Swap data sources / test without DB | Repository | Repository "because architecture" |
| Share multi-step business logic between controllers/commands | Service class | Fat controllers or fat models |
| Choose between interchangeable algorithms at runtime | Strategy | if/else chains everywhere |
| React to something happening | Events + Listeners | Direct calls sprinkled across layers |
| Reuse query constraints | Scopes | Duplicated where-chains |
| Attach one model to many parents | Polymorphic relations | Nullable FK per parent type |
| Share behavior across unrelated models | Trait | Deep inheritance |
| Guarantee valid, immutable data | Value Object | Loose arrays / primitive obsession |
| Process something through configurable stages | Pipeline | Nested function calls |

## Repository Pattern

**Use when:** you genuinely need to swap implementations (Eloquent ↔ API ↔ in-memory for tests), or query logic is complex enough to deserve its own home.

**Skip when:** it would just proxy Eloquent calls 1:1. `Post::find($id)` doesn't need a wrapper.

```php
interface PostRepository
{
    public function find(int $id): ?Post;
    public function published(): Collection;
    public function create(array $data): Post;
}

class EloquentPostRepository implements PostRepository
{
    public function published(): Collection
    {
        return Post::published()->with('author')->latest()->get();
    }
    // ...
}

// AppServiceProvider
$this->app->bind(PostRepository::class, EloquentPostRepository::class);
```

## Service Layer

**Use when:** an operation spans multiple models, touches external systems, or is called from more than one entry point (controller + command + job).

```php
class PublishPostService
{
    public function __construct(
        private PostRepository $posts,
        private Dispatcher $events,
    ) {}

    public function publish(Post $post, User $publisher): Post
    {
        abort_unless($publisher->can('publish', $post), 403);

        $post->update(['published_at' => now()]);
        $this->events->dispatch(new PostPublished($post));

        return $post;
    }
}
```

Controllers stay thin: validate → delegate → respond.

## Strategy Pattern

**Use when:** multiple interchangeable implementations of one behavior, selected at runtime.

```php
interface PaymentGateway
{
    public function charge(Money $amount, PaymentMethod $method): Payment;
}

class StripeGateway implements PaymentGateway { /* ... */ }
class PayFastGateway implements PaymentGateway { /* ... */ }

// Container-driven selection
$this->app->bind(PaymentGateway::class, fn () => match (config('payments.driver')) {
    'stripe' => new StripeGateway(config('services.stripe')),
    'payfast' => new PayFastGateway(config('services.payfast')),
});
```

## Events & Observers

**Use events when:** side effects are optional to the core operation (send email, update stats, clear cache). The operation succeeds even if a listener fails (queue them).

**Use observers when:** reacting to model lifecycle (created/updated/deleted) with framework-level concerns like cache busting.

```php
// Event + queued listener
class SendPublishNotifications implements ShouldQueue
{
    public function handle(PostPublished $event): void { /* ... */ }
}

// Observer for cache invalidation
class PostObserver
{
    public function saved(Post $post): void
    {
        Cache::forget("posts:{$post->user_id}");
    }
}
```

**Don't** hide critical business logic in listeners — if the operation must fail when the step fails, call it explicitly in the service.

## Query Scopes

```php
class Post extends Model
{
    public function scopePublished(Builder $q): Builder
    {
        return $q->whereNotNull('published_at')->where('published_at', '<=', now());
    }

    public function scopeByAuthor(Builder $q, User $author): Builder
    {
        return $q->where('user_id', $author->id);
    }
}

Post::published()->byAuthor($user)->latest()->paginate(15);
```

Any where-chain used twice becomes a scope.

## Polymorphic Relations

```php
class Comment extends Model
{
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }
}

class Post extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
```

Use a morph map so class names never hit the database:

```php
Relation::enforceMorphMap([
    'post' => Post::class,
    'video' => Video::class,
]);
```

## Value Objects

**Use when:** a concept has rules (money, email, coordinates, date ranges). Invalid states become unrepresentable.

```php
final class Price
{
    public function __construct(
        public readonly int $cents,
        public readonly string $currency = 'ZAR',
    ) {
        if ($cents < 0) {
            throw new InvalidArgumentException('Price cannot be negative');
        }
    }

    public function add(Price $other): self
    {
        if ($this->currency !== $other->currency) {
            throw new CurrencyMismatchException();
        }
        return new self($this->cents + $other->cents, $this->currency);
    }
}
```

Store money as integer cents. Always.

## Pipeline Pattern

**Use when:** a payload passes through configurable, ordered stages.

```php
$post = Pipeline::send($request->validated())
    ->through([
        StripDisallowedHtml::class,
        ResolveWikiLinks::class,
        GenerateExcerpt::class,
    ])
    ->then(fn (array $data) => Post::create($data));
```

Each stage: `handle($payload, Closure $next)`.

## Frontend Patterns (from laravel-13-cheat-sheet)

Patterns proven in the interactive docs sites:

- **Single app object** — one `const app = {}` with `init()`, not scattered globals
- **Data-driven rendering** — categories/files declared as data, DOM built from it; adding content = adding a data entry
- **Event delegation via `addEventListener`** — never `onclick=` properties on dynamically created elements (they silently fail to stack)
- **Graceful degradation** — syntax highlighting wrapped in try/catch with raw-code fallback; missing wiki-links render as muted text, not broken anchors
- **localStorage for preferences** — theme choice persists; read on init, write on change

## See Also

- [API Standards](API_STANDARDS.md)
- [Async Patterns](ASYNC_PATTERNS.md)
- [Code Quality](CODE_QUALITY.md)
