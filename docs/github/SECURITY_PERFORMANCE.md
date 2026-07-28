# Security & Performance Standards

Baseline security and performance requirements every project must meet before production.

## Security Checklist

### Input & Output

- [ ] All user input validated server-side (form requests / validation rules)
- [ ] Output escaped by default (`{{ }}` in Blade, JSX auto-escape); raw output (`{!! !!}`, `dangerouslySetInnerHTML`) requires review
- [ ] SQL only via query builder / ORM parameter binding — never string interpolation
- [ ] File uploads validated by type, size, and stored outside webroot

### CSRF & XSS

- [ ] CSRF tokens on all state-changing forms (`@csrf`)
- [ ] `X-CSRF-TOKEN` header on AJAX requests
- [ ] Security headers set:

```php
'X-Content-Type-Options' => 'nosniff',
'X-Frame-Options' => 'DENY',
'Referrer-Policy' => 'strict-origin-when-cross-origin',
'Content-Security-Policy' => "default-src 'self'",
```

### Authentication

- [ ] Passwords hashed with bcrypt/argon2 (`Hash::make`) — never custom crypto
- [ ] API auth via Sanctum (first-party SPA/mobile) or Passport (OAuth2 third-party)
- [ ] Tokens scoped to minimum abilities: `createToken('app', ['read'])`
- [ ] Short-lived access tokens; revoke on logout
- [ ] Rate limiting on auth endpoints: `throttle:5,1` on login

### Mass Assignment

```php
// Whitelist explicitly
protected $fillable = ['name', 'email'];

// Only create from validated data
Post::create($request->validated());
```

Never `$guarded = []` in production code.

### Secrets

- [ ] Secrets only in `.env`, never committed
- [ ] `.env` in `.gitignore` from first commit
- [ ] No credentials in commit history (scan with `security-scan.yml`)
- [ ] Rotate any secret that ever touched a commit

## Performance Checklist

### Database

- [ ] No N+1 queries — eager load relations (`with()`), verify with Debugbar/Telescope
- [ ] Indexes on all foreign keys and frequently-filtered columns
- [ ] `select()` only needed columns on hot paths
- [ ] `exists()` instead of `count() > 0`
- [ ] `chunk()` / `cursor()` for large datasets, never `all()`

```php
// N+1 killer pattern
$posts = Post::with('author:id,name', 'tags')
    ->select('id', 'title', 'user_id')
    ->paginate(15);
```

### Caching

| What | Strategy | TTL |
|------|----------|-----|
| Config, routes, views | `artisan config:cache` etc. at deploy | Until next deploy |
| Expensive queries | `Cache::remember()` keyed by inputs | 5–60 min |
| Rarely-changing reference data | `Cache::rememberForever()` + event-based bust | Forever |
| HTTP responses (public pages) | `Cache-Control` headers + CDN | 1–24 h |

Invalidate on write:

```php
static::saved(fn ($model) => Cache::forget("posts:{$model->user_id}"));
```

### Frontend

- [ ] Scripts at end of `<body>` (also required by HTMLHint `head-script-disabled`)
- [ ] Assets versioned for cache busting (`?v=` or Vite manifest)
- [ ] Images sized and lazy-loaded
- [ ] Pagination — cursor pagination (`cursorPaginate`) for large/infinite lists

### Queues

Anything slower than ~200ms that the user doesn't need synchronously goes to a queue: emails, exports, image processing, webhooks, third-party API calls. See [Async Patterns](ASYNC_PATTERNS.md).

## Rate Limiting

```php
// Named limiters in AppServiceProvider / RouteServiceProvider
RateLimiter::for('api', fn (Request $r) =>
    Limit::perMinute(60)->by($r->user()?->id ?: $r->ip()));

// Route middleware
Route::middleware('throttle:api')->group(...);
Route::post('/login', ...)->middleware('throttle:5,1');
```

Return `429` with `Retry-After` — never silently drop requests.

## Security Review Triggers

Require a focused security review when a PR touches:

- Authentication or session handling
- Authorization / policies / gates
- File uploads or downloads
- Raw SQL or `DB::raw`/`whereRaw`
- `{!! !!}` or HTML sanitization
- Payment or webhook handling
- CORS or CSP configuration

## CI Enforcement

The [security-scan.yml](../templates/.github/workflows/security-scan.yml) workflow runs on every PR:

- Dependency audit (`composer audit` / `npm audit`)
- Secret scanning (gitleaks)
- Static analysis security rules

## See Also

- [Async Patterns](ASYNC_PATTERNS.md)
- [API Standards](API_STANDARDS.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
