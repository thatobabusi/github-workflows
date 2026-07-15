# API Standards

Design rules for every HTTP API across all projects. Consistency between projects means zero re-learning.

## Versioning

URL-prefix versioning, always — even for v1:

```php
// routes/api.php
Route::prefix('v1')->name('api.v1.')->group(function () {
    Route::apiResource('posts', V1\PostController::class);
});
```

- Breaking change → new version prefix, old version maintained through a deprecation window
- Additive changes (new fields, new endpoints) do **not** bump the version
- Announce deprecations via `Deprecation` and `Sunset` response headers

## Resource Serialization

Every response body goes through an API Resource — never `return $model`:

```php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => new UserResource($this->whenLoaded('author')),
            'content' => $this->when(
                $request->user()?->can('view', $this->resource),
                $this->content
            ),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
```

Rules:

- Dates are ISO 8601, always UTC
- Relations only via `whenLoaded()` — resources never trigger queries
- Sensitive fields gated with `when()` + authorization
- IDs exposed as-is or as UUIDs — pick per project, never mix

## Response Envelope

```json
// Success (single)
{ "data": { ... } }

// Success (collection)
{ "data": [ ... ], "links": { ... }, "meta": { ... } }

// Error
{
  "message": "Validation failed",
  "errors": { "title": ["The title field is required."] }
}
```

Laravel's resource + exception defaults produce this — don't fight them with custom envelopes.

## Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Reads, updates |
| 201 | Created | Successful POST creating a resource |
| 204 | No Content | Successful DELETE |
| 401 | Unauthenticated | Missing/invalid credentials |
| 403 | Forbidden | Authenticated but not allowed |
| 404 | Not Found | Missing resource (also for unauthorized reads when hiding existence) |
| 422 | Unprocessable | Validation failure |
| 429 | Too Many Requests | Rate limited — include `Retry-After` |
| 500 | Server Error | Unexpected only — never for known conditions |

## Pagination

- Default page size 15, client-configurable via `per_page` (max 100 — enforce it)
- **Cursor pagination** for feeds and large tables; offset pagination only for small, jump-to-page UIs

```php
$posts = Post::orderBy('id')->cursorPaginate(
    min((int) $request->input('per_page', 15), 100)
);
```

## Filtering & Sorting

Query parameter conventions:

```
GET /api/v1/posts?filter[status]=published&filter[author]=42&sort=-created_at&include=author,tags
```

```php
$posts = Post::query()
    ->when($request->input('filter.status'), fn ($q, $s) => $q->where('status', $s))
    ->when($request->input('sort'), function ($q, $sort) {
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $q->orderBy(ltrim($sort, '-'), $direction);
    })
    ->cursorPaginate(15);
```

Whitelist sortable/filterable columns — never pass user input straight to `orderBy`.

## Validation

Form Requests for every write endpoint:

```php
class StorePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'tags' => ['array', 'max:10'],
            'tags.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
```

Controllers receive `$request->validated()` only.

## Authentication

| Scenario | Tool |
|----------|------|
| First-party SPA | Sanctum cookie-based |
| Mobile app / CLI | Sanctum tokens with abilities |
| Third-party OAuth consumers | Passport |

Details in [Security & Performance](SECURITY_PERFORMANCE.md).

## Rate Limiting

Every API route group carries a limiter:

```php
RateLimiter::for('api', fn (Request $r) =>
    Limit::perMinute(60)->by($r->user()?->id ?: $r->ip()));
```

429 responses include `Retry-After` and the standard `X-RateLimit-*` headers.

## CORS

```php
// config/cors.php — production
'paths' => ['api/*'],
'allowed_origins' => [env('FRONTEND_URL')],   // never '*' with credentials
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
'supports_credentials' => true,
```

`allowed_origins: ['*']` is acceptable only for fully public, credential-less APIs.

## Error Handling

```php
// bootstrap/app.php (Laravel 11+) or Handler
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (Throwable $e, Request $request) {
        if ($request->is('api/*') && !config('app.debug')) {
            // Known exceptions keep their status; unknown become opaque 500s
        }
    });
})
```

Never leak stack traces, SQL, or file paths in production API responses.

## API Testing Minimum

Every endpoint has tests for:

- Happy path with correct status + JSON structure
- Validation failure (422 + error keys)
- Unauthenticated access (401)
- Unauthorized access (403 or 404)

```php
$this->getJson('/api/v1/posts')
    ->assertOk()
    ->assertJsonStructure(['data' => [['id', 'title', 'created_at']]]);
```

## See Also

- [Security & Performance](SECURITY_PERFORMANCE.md)
- [Code Quality](CODE_QUALITY.md)
- [Design Patterns](DESIGN_PATTERNS.md)
