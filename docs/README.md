# Standards Documentation

The complete standards library. Also browsable as an [interactive reference site](https://thatobabusi.github.io/github-workflows/) with search, dark mode, and per-page tables of contents.

**New here?** Read in this order: Branching Strategy → Commit Standards → Quality Gates → Implementation Checklist. Everything else is reference material you pull in when the topic comes up.

## 📌 Core Standards

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Branching Strategy](BRANCHING_STRATEGY.md) | Multi-tier branch model (main/development/feature/QA/UAT), merge workflows, protection rules | 15 min |
| [Commit Standards](COMMIT_STANDARDS.md) | Semantic commit format, types, scopes, changelog automation | 10 min |
| [Release Standards](RELEASE_STANDARDS.md) | SemVer, tagging, CHANGELOG format, GitHub Releases, hotfixes | 12 min |
| [Pull Request Process](PULL_REQUEST_PROCESS.md) | PR lifecycle, review standards, merge strategies, size guidelines | 10 min |

## ✅ Quality & Gates

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Code Quality](CODE_QUALITY.md) | Five-layer quality stack, full-scope e2e standard, coverage floors, static analysis | 12 min |
| [Linting Gates](LINTING_GATES.md) | Linting as a deployment gate, per-stack configs, hard-won gotchas | 10 min |
| [Quality Gates](QUALITY_GATES.md) | Four gates from pre-commit to release, adoption levels L0–L3 | 8 min |
| [Testing](TESTING.md) | This repo's 48-test Playwright suite: running it, coverage map, CI gating, conventions | 8 min |

## 🏗️ Architecture

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Design Patterns](DESIGN_PATTERNS.md) | Use/don't-use decision table; Repository, Service, Strategy, Events, Value Objects, Pipeline | 15 min |
| [API Standards](API_STANDARDS.md) | Versioning, resources, envelopes, pagination, rate limiting, CORS | 12 min |
| [Async Patterns](ASYNC_PATTERNS.md) | Queues, job idempotency, scheduling, broadcasting | 12 min |
| [Monorepo Structure](MONOREPO_STRUCTURE.md) | Workspaces, shared configs, path-filtered CI, submodules | 10 min |

## 🚀 Operations

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Deployment Guide](DEPLOYMENT_GUIDE.md) | Gated pipelines, GitHub Pages lessons, expand/contract migrations, rollback | 15 min |
| [Security & Performance](SECURITY_PERFORMANCE.md) | Production baselines: CSRF/XSS, auth, N+1 prevention, caching, rate limiting | 12 min |

## 🛠️ Project Setup

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [File Structure](FILE_STRUCTURE.md) | Standard layouts per project type, naming conventions | 10 min |
| [Documentation Standards](DOCUMENTATION_STANDARDS.md) | README structure, writing style, interactive docs site pattern | 12 min |
| [Implementation Checklist](IMPLEMENTATION_CHECKLIST.md) | Phase-by-phase adoption for new projects, minimum viable setup | 8 min |

## 💡 Tips & Tricks

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Git Tips & Tricks](GIT_TIPS_TRICKS.md) | Reflog recovery, bisect, worktrees, rerere, autosquash, precision staging | 12 min |
| [Actions Advanced](ACTIONS_ADVANCED.md) | Reusable workflows, composite actions, caching, dynamic matrices, OIDC hardening | 15 min |
| [Nice to Know](NICE_TO_KNOW.md) | GitHub URL tricks, shortcuts, CODEOWNERS, `gh` CLI power usage, markdown extras | 10 min |

## 🔍 SEO

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [SEO Cheat Sheet](seo/SEO_CHEAT_SHEET.md) | Per-page on-page checklist: titles, headings, URLs, links, images, E-E-A-T, 60-second audit | 10 min |
| [Content Writing](seo/SEO_CONTENT_WRITING.md) | Keyword research & intent, placement map, writing rules, pillar-cluster, link earning, measurement loop | 12 min |
| [Meta Tags Reference](seo/SEO_META_TAGS.md) | Copy-paste head: robots, Open Graph, Twitter cards, JSON-LD, canonicals, hreflang | 10 min |
| [Technical SEO](seo/SEO_TECHNICAL.md) | robots.txt, sitemaps, redirects, Core Web Vitals, JS rendering, crawl budget | 12 min |

## 🐘 PHP

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Project Structures](software-development/backend/php/PHP_PROJECT_STRUCTURES.md) | Six layouts from flat scripts to DDD, with a decision table | 12 min |
| [Coding Styles](software-development/backend/php/PHP_CODING_STYLES.md) | PSR-1/4/12, naming, modern PHP 8.2+ defaults, Pint/PHPStan enforcement | 10 min |
| [Design Patterns (PHP)](software-development/backend/php/PHP_DESIGN_PATTERNS.md) | Idiomatic PHP implementations: DI, factories, decorators, adapters, pattern smells | 15 min |
| [Frameworks](software-development/backend/php/PHP_FRAMEWORKS.md) | Laravel/Symfony/Slim trade-offs, full-stack pairings, evaluation checklist | 12 min |
| [Laravel Essentials](software-development/backend/php/laravel/LARAVEL_ESSENTIALS.md) | Artisan workflow, where logic lives, Eloquent conventions, ecosystem map, deploy notes | 12 min |
| [Symfony Essentials](software-development/backend/php/symfony/SYMFONY_ESSENTIALS.md) | Attributes routing, autowiring, Doctrine Data Mapper, Messenger, LTS discipline | 12 min |
| [Vanilla PHP Essentials](software-development/backend/php/vanilla/VANILLA_PHP_ESSENTIALS.md) | Front controller, FastRoute, PDO done right, the security checklist you own | 10 min |
| [WordPress Essentials](software-development/backend/php/wordpress/WORDPRESS_ESSENTIALS.md) | Hooks mental model, plugin structure, security non-negotiables, WP-CLI, Bedrock | 12 min |
| [Composer Cheat Sheet](software-development/composer/COMPOSER_CHEAT_SHEET.md) | Commands, version constraints, autoloading, deploy flags, path repos, publishing | 10 min |

## 🐍 Python

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Project Structures](software-development/backend/python/PYTHON_PROJECT_STRUCTURES.md) | src layout, FastAPI/Django/data layouts, pyproject rules | 10 min |
| [Coding Styles](software-development/backend/python/PYTHON_CODING_STYLES.md) | PEP 8, typing, modern 3.11+ idioms, ruff/mypy/uv toolchain | 10 min |
| [Frameworks](software-development/backend/python/PYTHON_FRAMEWORKS.md) | FastAPI/Django/Flask trade-offs, background work, pairings | 10 min |
| [Django Essentials](software-development/backend/python/django/DJANGO_ESSENTIALS.md) | Where logic lives, ORM performance, the admin, DRF, settings discipline | 12 min |
| [Flask Essentials](software-development/backend/python/flask/FLASK_ESSENTIALS.md) | App factory + blueprints, error handlers, context gotchas, gunicorn | 10 min |

## ☕ Java

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Project Structures](software-development/backend/java/JAVA_PROJECT_STRUCTURES.md) | Maven/Gradle layout, package-by-feature, multi-module, hexagonal, modern Java | 12 min |
| [Coding Styles](software-development/backend/java/JAVA_CODING_STYLES.md) | Google style baseline, records/sealed idioms, null discipline, Spotless/ArchUnit | 10 min |
| [Spring Boot Essentials](software-development/backend/java/springboot/SPRINGBOOT_ESSENTIALS.md) | Starters, core pattern, config, slice testing, the traps | 12 min |
| [Quarkus Essentials](software-development/backend/java/quarkus/QUARKUS_ESSENTIALS.md) | Build-time wiring, dev mode, Panache, native images, vs Spring | 12 min |
| [Vaadin Essentials](software-development/backend/java/vaadin/VAADIN_ESSENTIALS.md) | Pure-Java UIs, grids/binders, lazy data providers, Flow vs Hilla | 10 min |

## ⚙️ Dev Environment

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Database Design](software-development/db/DATABASE_DESIGN.md) | Schema rules, normalization judgment, indexing, migration discipline | 12 min |
| [SQL Cheat Sheet](software-development/db/sql/SQL_CHEAT_SHEET.md) | Joins, window functions, CTEs, upserts, EXPLAIN reading | 12 min |
| [MySQL Essentials](software-development/db/mysql/MYSQL_ESSENTIALS.md) | InnoDB config, utf8mb4, upserts, EXPLAIN types, locking gotchas | 10 min |
| [MariaDB Essentials](software-development/db/mariadb/MARIADB_ESSENTIALS.md) | Compatibility reality, the collation trap, system-versioned tables | 10 min |
| [MongoDB Essentials](software-development/db/mongodb/MONGODB_ESSENTIALS.md) | Embed vs reference, aggregation, indexing, schema discipline | 12 min |
| [SQL Server Essentials](software-development/db/sqlserver/SQLSERVER_ESSENTIALS.md) | T-SQL dialect, clustered indexes, RCSI locking, ops kit | 12 min |
| [Docker Cheat Sheet](software-development/docker/DOCKER_CHEAT_SHEET.md) | Daily commands, Dockerfile rules, Compose, image scanning in CI | 10 min |
| [CLI Cheat Sheet](software-development/cli/CLI_CHEAT_SHEET.md) | Modern tool replacements, text surgery, safe scripting, one-liners | 10 min |
| [Azure Essentials](software-development/azure/AZURE_ESSENTIALS.md) | Service map, az CLI, App Service/Container Apps, OIDC deploys, cost sanity | 12 min |

## 🟩 Node

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [Node Essentials](software-development/backend/node/NODE_ESSENTIALS.md) | Project setup, event-loop rules, Fastify/Nest landscape, config validation, production rules | 12 min |
| [Express Essentials](software-development/backend/expressjs/EXPRESS_ESSENTIALS.md) | Middleware model, async error trap, production stack, 4 vs 5 | 10 min |
| [NestJS Essentials](software-development/frontend/javascript/nestjs/NESTJS_ESSENTIALS.md) | Modules/DI, request pipeline, validation, honest positioning | 12 min |

## 🎨 Frontend

| Doc | What It Covers | Read Time |
|-----|----------------|-----------|
| [React Essentials](software-development/frontend/javascript/react/REACT_ESSENTIALS.md) | Component rules, the state ladder, hooks discipline, forms, performance | 12 min |
| [Vue Essentials](software-development/frontend/javascript/vuejs/VUE_ESSENTIALS.md) | Composition API, reactivity rules, composables, Pinia | 10 min |
| [Angular Essentials](software-development/frontend/javascript/angularjs/ANGULAR_ESSENTIALS.md) | Standalone components, signals, DI, RxJS restraint, typed forms | 12 min |
| [Next.js Essentials](software-development/frontend/javascript/nextjs/NEXTJS_ESSENTIALS.md) | App Router, server/client split, caching, Server Actions, SEO wiring | 12 min |
| [Bootstrap Essentials](software-development/frontend/bootstrap/BOOTSTRAP_ESSENTIALS.md) | Grid, utilities, components, dark mode, vs Tailwind | 10 min |
| [Nuxt Essentials](software-development/frontend/javascript/nuxt/NUXT_ESSENTIALS.md) | useFetch rule, Nitro routes, routeRules rendering, SEO wiring | 12 min |
| [HTML Cheat Sheet](software-development/frontend/html/HTML_CHEAT_SHEET.md) | Semantic layout, forms, images, accessibility baseline | 12 min |
| [AJAX & Fetch Cheat Sheet](software-development/frontend/ajax/AJAX_FETCH_CHEAT_SHEET.md) | fetch patterns, response.ok trap, aborts, uploads, SSE map | 10 min |
| [jQuery Essentials](software-development/frontend/jquery/JQUERY_ESSENTIALS.md) | Legacy maintenance, delegation, the vanilla migration table | 10 min |

## Related

- [Workflow templates](../templates/.github/workflows/README.md) — copyable GitHub Actions with the gating pattern
- [Quick Reference](../QUICK_REFERENCE.md) — commands and checklists at a glance
- [CHANGELOG](../CHANGELOG.md) — what changed, when
