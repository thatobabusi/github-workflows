# Composer Cheat Sheet

PHP dependency management: daily commands, version constraints, autoloading, and the package-author's toolkit.

## Daily Commands

```bash
composer install              # install from composer.lock (deploys, CI)
composer update               # re-resolve ALL deps, rewrite lock (deliberate act)
composer update vendor/pkg    # re-resolve one package only
composer require vendor/pkg           # add runtime dependency
composer require --dev phpstan/phpstan # add dev dependency
composer remove vendor/pkg

composer outdated -D          # direct deps with newer versions
composer show vendor/pkg      # installed version, deps, path
composer why vendor/pkg       # what requires this?
composer why-not php 8.4      # what blocks this platform/version?
composer validate             # composer.json sanity check
composer audit                # known-CVE scan (in the security gate)
```

The golden rule: **`install` obeys the lock; `update` rewrites it.** CI and production only ever `install`. The lockfile is always committed.

## Version Constraints

| Constraint | Allows | Use |
|-----------|--------|-----|
| `^2.3` | ≥2.3.0 <3.0.0 | **Default** — SemVer-compatible |
| `~2.3` | ≥2.3 <3.0 | Similar to caret |
| `~2.3.1` | ≥2.3.1 <2.4.0 | Patch-only drift |
| `2.3.*` | Any 2.3 patch | Rare |
| `>=2.3 <3.1` | Explicit range | Cross-major transitions |
| `dev-main` | Branch head | Never in released code |

`^` everywhere unless you have a documented reason. Exact pins (`2.3.1`) belong in the lockfile's job, not composer.json.

## composer.json Anatomy

```json
{
    "name": "babusi/orders",
    "type": "library",
    "license": "MIT",
    "require": {
        "php": "^8.3",
        "guzzlehttp/guzzle": "^7.8"
    },
    "require-dev": {
        "phpunit/phpunit": "^11.0",
        "laravel/pint": "^1.15",
        "phpstan/phpstan": "^1.11"
    },
    "autoload": {
        "psr-4": { "Babusi\\Orders\\": "src/" }
    },
    "autoload-dev": {
        "psr-4": { "Babusi\\Orders\\Tests\\": "tests/" }
    },
    "scripts": {
        "lint": ["@lint:style", "@lint:static"],
        "lint:style": "pint --test",
        "lint:static": "phpstan analyse",
        "test": "phpunit"
    },
    "config": {
        "sort-packages": true,
        "optimize-autoloader": true
    }
}
```

- Same script verbs as every stack (`lint`, `test`) — the [lint gate](../../LINTING_GATES.md) contract
- `sort-packages: true` keeps diffs clean
- Platform requirement (`"php": "^8.3"`) always declared — fails fast on wrong environments

## Autoloading

```bash
composer dump-autoload            # after adding classes/namespaces
composer dump-autoload -o         # optimized classmap — ALWAYS in production
```

PSR-4 mapping is namespace ↔ directory, exactly ([PHP structures](../backend/php/PHP_PROJECT_STRUCTURES.md)). `files` autoload for helper functions, sparingly:

```json
"autoload": { "files": ["src/helpers.php"] }
```

## Deployment Flags

```bash
# The production install line (from the Deployment Guide):
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
```

| Flag | Effect |
|------|--------|
| `--no-dev` | Skips require-dev (phpunit etc. never ship) |
| `--optimize-autoloader` | Classmap instead of filesystem checks |
| `--prefer-dist` | Zips over git clones — faster, smaller |
| `--no-interaction` | CI-safe |

## Local Package Development

Work on a package inside a consuming app without publishing (the Herd packages workflow):

```json
"repositories": [
    { "type": "path", "url": "../../packages/laravel/laravel-lastfm" }
],
"require": { "thatobabusi/laravel-lastfm": "@dev" }
```

Path repositories symlink by default — edits in the package are live in the app instantly.

## Publishing a Package

- [PDS skeleton](../backend/php/PHP_PROJECT_STRUCTURES.md) layout; `composer validate --strict` clean
- Tag SemVer releases ([Release Standards](../../RELEASE_STANDARDS.md)) — Packagist reads tags
- Submit once to packagist.org; enable the GitHub webhook for auto-updates
- `"minimum-stability"` untouched (stable); use `"prefer-stable": true` if you must allow dev deps

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Your requirements could not be resolved" | `composer why-not` the conflicting package; relax the narrowest constraint |
| Class not found after adding a file | `composer dump-autoload` |
| Memory exhausted | `COMPOSER_MEMORY_LIMIT=-1 composer update` |
| Wrong PHP version used | `composer config platform.php 8.3` to pin resolution |
| Lock drift ("lock file is not up to date") | Someone edited composer.json without updating — `composer update --lock` |

## See Also

- [PHP Project Structures](../backend/php/PHP_PROJECT_STRUCTURES.md)
- [PHP Frameworks](../backend/php/PHP_FRAMEWORKS.md)
- [Security & Performance](../../SECURITY_PERFORMANCE.md) — `composer audit` in CI
