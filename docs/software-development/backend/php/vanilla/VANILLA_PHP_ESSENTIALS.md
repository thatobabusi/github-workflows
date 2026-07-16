# Vanilla PHP Essentials

Framework-free PHP done properly: modern language, Composer packages for the hard parts, and the discipline frameworks would otherwise impose.

## When Vanilla Is Right

| Situation | Verdict |
|-----------|---------|
| Single endpoint / webhook / tiny tool | Yes — a framework is overhead |
| Learning how frameworks work underneath | Yes — best teacher there is |
| Constrained shared hosting | Often the only option |
| Anything with auth, forms, DB, and growth ambitions | Use [Laravel](../laravel/LARAVEL_ESSENTIALS.md) — you'll rebuild it badly otherwise |

Vanilla ≠ 2005 PHP. You still get Composer, strict types, and PSRs.

## Minimum Viable Structure

The [Slim MVC layout](../PHP_PROJECT_STRUCTURES.md), front controller and all:

```
app/
├── public/
│   └── index.php            # ONLY web-reachable file
├── src/
│   ├── Http/                # request handling
│   ├── Domain/              # business logic
│   └── Support/
├── templates/
├── config/
├── var/                     # logs, cache (gitignored)
├── vendor/
└── composer.json            # PSR-4 + lint/test scripts
```

```php
// public/index.php — the whole front controller idea
<?php

declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

$router = require dirname(__DIR__) . '/config/routes.php';
$router->dispatch(
    $_SERVER['REQUEST_METHOD'],
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);
```

Web server rewrite sends everything to it (nginx `try_files $uri /index.php$is_args$args;` — [Deployment Guide](../../../../DEPLOYMENT_GUIDE.md) has full configs).

## Routing Without a Framework

Don't hand-roll regex dispatch — `nikic/fast-route` is the standard component:

```php
$dispatcher = FastRoute\simpleDispatcher(function (RouteCollector $r) {
    $r->get('/orders/{id:\d+}', [OrderController::class, 'show']);
    $r->post('/orders', [OrderController::class, 'create']);
});
```

## Database: PDO, Properly

```php
$pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,            // real prepared statements
]);

$stmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = ? AND status = ?');
$stmt->execute([$userId, 'pending']);
$orders = $stmt->fetchAll();
```

**Prepared statements for every query with input, no exceptions** — the [SQL injection rule](../../../../SECURITY_PERFORMANCE.md) with no ORM safety net. Want more comfort without a framework: `doctrine/dbal` (query builder) or `laravel/illuminate-database` standalone.

## Templating: Escape by Default

```php
// Support/e.php — THE most important function in vanilla PHP
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}
```

```php
<h1><?= e($order->reference) ?></h1>
```

Every output escaped unless deliberately raw. Templates grow past trivial → `twig/twig` or `league/plates` (auto-escaping built in).

## The Security Checklist You Own Now

No framework means [every default](../../../../SECURITY_PERFORMANCE.md) is your job:

- [ ] CSRF: token in session, hidden field in every form, compare with `hash_equals()`
- [ ] Passwords: `password_hash()` / `password_verify()` — nothing else, ever
- [ ] Sessions: `session_regenerate_id(true)` on login; cookie flags `httponly`, `secure`, `samesite=Lax`
- [ ] Headers: `X-Content-Type-Options`, `X-Frame-Options`, CSP — set in one bootstrap spot
- [ ] Uploads: validate MIME + size, store outside `public/`, serve via readfile with authorization
- [ ] Errors: `display_errors=Off` in prod; log to `var/log/` (monolog)

## Composer Packages That Replace Framework Organs

| Organ | Package |
|-------|---------|
| Router | `nikic/fast-route` |
| DI container | `php-di/php-di` |
| Env loading | `vlucas/phpdotenv` |
| Logging | `monolog/monolog` (PSR-3) |
| HTTP client | `guzzlehttp/guzzle` |
| Validation | `respect/validation` |
| Templates | `twig/twig` |

Assembling more than three of these? You're building a framework — [go get one](../PHP_FRAMEWORKS.md).

## Quality Bar Unchanged

Vanilla projects still carry the [lint gate](../../../../LINTING_GATES.md): Pint + PHPStan + PHPUnit via composer scripts, strict types in every file, [coding styles](../PHP_CODING_STYLES.md) enforced. No framework is not a license for no standards.

## See Also

- [PHP Project Structures](../PHP_PROJECT_STRUCTURES.md)
- [PHP Coding Styles](../PHP_CODING_STYLES.md)
- [Composer Cheat Sheet](../../../composer/COMPOSER_CHEAT_SHEET.md)
