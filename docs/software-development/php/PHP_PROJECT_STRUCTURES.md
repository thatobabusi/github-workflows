# PHP Project Structures

The possible directory layouts for PHP projects, from a single script to DDD — and when each one is right.

## Decision Table

| Project | Structure |
|---------|-----------|
| Script / single tool | Flat + Composer |
| Library / package | PDS Skeleton |
| Small site / API | Slim MVC |
| Standard application | Framework default (Laravel/Symfony) |
| Large app, several domains | Modular monolith |
| Complex domain logic, long-lived | DDD layers |

Bias: **start one level simpler than you think you need.** Restructuring up is mechanical; unwinding ceremony is not.

## 1. Flat + Composer (scripts, tools)

```
tool/
├── src/
│   └── Runner.php
├── bin/tool            # executable entry
├── composer.json       # autoload psr-4: {"Tool\\": "src/"}
└── README.md
```

## 2. PDS Skeleton (libraries/packages)

The community standard ([pds/skeleton](https://github.com/php-pds/skeleton)) — what every Composer package expects:

```
package/
├── bin/                # executables
├── config/             # configuration
├── docs/               # documentation
├── public/             # web-exposed files (if any)
├── resources/          # other resource files
├── src/                # PSR-4 source
├── tests/              # mirrors src/ namespaces
├── composer.json
├── CHANGELOG.md
├── LICENSE.md
└── README.md
```

Rules: nothing executable above `bin/`+`public/`, `src/` maps 1:1 to the root namespace, `tests/` mirrors `src/`.

## 3. Generic Default (framework-agnostic apps)

The community-consensus default when no framework dictates the layout ([reference](https://roman-huliak.medium.com/how-to-structure-a-php-project-best-practices-and-real-examples-a934b44ac90d)):

```
my-php-app/
├── bin/                 # CLI tools and scripts
├── config/              # configuration files
├── public/              # web root (index.php, assets)
├── src/                 # application source (PSR-4)
├── templates/           # templates or views
├── tests/               # automated tests
├── translations/        # localization files
├── var/                 # cache, logs (gitignored)
├── vendor/              # Composer dependencies
├── .env                 # environment variables (gitignored)
├── composer.json
└── README.md
```

## 4. Slim MVC (no-framework or micro-framework apps)

```
app/
├── public/
│   └── index.php       # ONLY web-reachable file (front controller)
├── src/
│   ├── Controller/
│   ├── Model/
│   ├── View/           # templates
│   └── Support/
├── config/
├── var/                # cache, logs (writable, gitignored)
├── vendor/
└── composer.json
```

The one absolute rule at every size: **only `public/` is in the webroot.** Config, src, and vendor sit above it, unreachable by URL.

## 5. Laravel Default (the standard app)

```
app/
├── app/
│   ├── Http/{Controllers,Requests,Resources,Middleware}
│   ├── Models/
│   ├── Services/           # add: multi-model business logic
│   ├── Jobs/ Events/ Listeners/ Policies/
│   └── Providers/
├── bootstrap/
├── config/
├── database/{migrations,factories,seeders}
├── public/
├── resources/{views,js,css}
├── routes/{web,api,console,channels}.php
├── storage/
└── tests/{Unit,Feature}
```

Convention over invention — full layout and role rules in [File Structure](../../FILE_STRUCTURE.md). Don't fight the skeleton; extend it (`Services/`, `Actions/`, `Support/`) rather than relocating it.

## 6. Modular Monolith (large app, clear domains)

One deployable, hard module boundaries:

```
app/
├── app/Modules/
│   ├── Billing/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Events/
│   │   ├── Providers/BillingServiceProvider.php
│   │   └── routes.php
│   ├── Catalog/
│   │   └── (same shape)
│   └── Shared/             # cross-module contracts only
└── (framework skeleton unchanged)
```

Rules that make it real (otherwise it's just folders):

- Modules talk through **events or shared contracts** — never reach into another module's models
- Each module registers itself via its own ServiceProvider
- A module could become a service later; that pressure keeps boundaries honest

## 7. DDD Layers (complex domains)

```
src/
├── Domain/                 # pure business — zero framework imports
│   ├── Order/
│   │   ├── Order.php               # aggregate root
│   │   ├── OrderLine.php           # entity
│   │   ├── Price.php               # value object
│   │   ├── OrderRepository.php     # interface
│   │   └── Events/OrderPlaced.php
├── Application/            # use cases orchestrating the domain
│   └── PlaceOrder/
│       ├── PlaceOrderCommand.php
│       └── PlaceOrderHandler.php
├── Infrastructure/         # framework, DB, external services
│   ├── Persistence/EloquentOrderRepository.php
│   └── Http/Controllers/
└── ...
```

Dependency rule: arrows point **inward** — Infrastructure → Application → Domain, never outward. The Domain layer compiles without Laravel installed.

Use when the business rules are the hard part. For CRUD-heavy apps, this is ceremony without payoff — Laravel default + Services wins.

## Universal Rules (any structure)

- `public/` is the only webroot, `index.php` the only entry
- PSR-4: namespace path = directory path, one class per file
- `tests/` mirrors the source structure
- Writable dirs (`storage/`, `var/`) are gitignored and outside the webroot
- Composer scripts expose the same verbs everywhere: `lint`, `test` ([Linting Gates](../../LINTING_GATES.md))

## See Also

- [PHP Coding Styles](PHP_CODING_STYLES.md)
- [PHP Frameworks](PHP_FRAMEWORKS.md)
- [File Structure](../../FILE_STRUCTURE.md)
- [Monorepo Structure](../../MONOREPO_STRUCTURE.md)
