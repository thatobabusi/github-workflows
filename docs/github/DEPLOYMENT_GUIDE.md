# Deployment Guide

Runbook for shipping to production safely. Every deploy path runs the same gates: lint → test → deploy.

## The Pipeline

```
Push to main
    │
    ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│  Lint    │──▶│  Tests   │──▶│  Deploy  │
│  (gate)  │   │  (gate)  │   │          │
└──────────┘   └──────────┘   └──────────┘
     │              │
     └─ fail ───────┴─ fail → deployment blocked
```

See [Linting Gates](LINTING_GATES.md) for the gate pattern and [deploy.yml](../templates/.github/workflows/deploy.yml) for the template.

## Environment Configuration

### .env Rules

- `.env` is never committed; `.env.example` always is, kept current
- Production: `APP_ENV=production`, `APP_DEBUG=false` — non-negotiable
- Every `env()` call lives in a config file; application code uses `config()` only (required for config caching)

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://example.com

LOG_CHANNEL=stack
LOG_LEVEL=warning

CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

### Config Caching

Every production deploy runs:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

## Static Site Deploys (GitHub Pages)

Lessons from laravel-13-cheat-sheet and win12:

1. **Serve from root, not a subfolder copy.** Duplicate `public/index.html` clones drift from the root copy and cause 404 confusion. One entry point.
2. **Paths relative to the serving root.** `docs/...` not `../docs/...` when Pages serves from root.
3. **Hybrid Pages config causes `deployment_failed`.** If Pages was ever configured for branch-deploy and you switch to Actions, force workflow mode:
   ```bash
   gh api -X PUT repos/{owner}/{repo}/pages -f build_type=workflow
   ```
4. **Trigger paths must cover everything that ships.** Include `index.html`, `assets/**`, `docs/**`, lint configs, and the workflow file itself in `on.push.paths`.
5. **Lint job gates the deploy job** — `needs: lint` + `if: success()`.

## Application Deploys

### Standard Deploy Script

```bash
cd /var/www/app

php artisan down --retry=60          # maintenance mode (skip for zero-downtime)

git pull origin main
composer install --no-dev --optimize-autoloader
npm ci && npm run build

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan queue:restart            # workers reload new code
php artisan up
```

### Zero-Downtime (Symlink Strategy)

```
/var/www/app/
├── releases/
│   ├── 20260715100000/
│   └── 20260715110000/
├── shared/            # .env, storage/
└── current → releases/20260715110000
```

Build the new release fully, run migrations, then atomically switch the `current` symlink. Roll back = point symlink at previous release.

## Database Migrations in Production

### Safe Migration Rules

- `php artisan migrate --force` only after tests pass in CI
- **Expand → migrate → contract** for breaking schema changes:

```
Deploy 1: add nullable column, write to both old + new
Deploy 2: backfill, switch reads to new column
Deploy 3: drop old column
```

- Never `migrate:fresh` or `migrate:refresh` against production. Ever.
- Destructive migrations (drops, renames) require a tested rollback plan and a recent backup

## SSL / HTTPS

```php
// AppServiceProvider
public function boot(): void
{
    if ($this->app->environment('production')) {
        URL::forceScheme('https');
    }
}
```

- Certbot auto-renewal cron verified after setup
- HSTS header once HTTPS is stable: `Strict-Transport-Security: max-age=31536000`

## Health Checks & Monitoring

```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'database' => rescue(fn () => DB::connection()->getPdo() ? 'up' : 'down', 'down'),
        'cache' => rescue(fn () => Cache::set('hc', 1) ? 'up' : 'down', 'down'),
        'queue' => rescue(fn () => Queue::size() !== null ? 'up' : 'down', 'down'),
    ]);
});
```

- Uptime monitor pointed at `/health` (UptimeRobot, Pingdom)
- Error tracking wired before launch (Sentry/Flare) — `LOG_LEVEL=warning` in prod
- Critical alerts to a channel someone actually reads

## Rollback Procedure

1. **Static sites:** revert the commit, push — Pages redeploys the previous state
2. **Symlink deploys:** repoint `current` to the previous release, `queue:restart`
3. **Migrations:** only roll back schema if the expand/contract plan allows; otherwise fix forward
4. Document what broke in the incident log before moving on

## Deploy Checklist

- [ ] CI green (lint + tests) on the exact SHA being deployed
- [ ] `.env.example` updated if new vars introduced
- [ ] New env vars set in production **before** deploy
- [ ] Migration plan reviewed (expand/contract if breaking)
- [ ] Backup/snapshot recent
- [ ] `queue:restart` included
- [ ] Health check green after deploy
- [ ] Release tagged ([Release Standards](RELEASE_STANDARDS.md))

## See Also

- [Linting Gates](LINTING_GATES.md)
- [Release Standards](RELEASE_STANDARDS.md)
- [Security & Performance](SECURITY_PERFORMANCE.md)
