# Changelog

All notable changes to this project are documented here. Format follows [Keep a Changelog](https://keepachangelog.com); versioning follows [SemVer](https://semver.org).

## [Unreleased]

### Added
- **Stack batch 2 — 13 docs, every remaining empty folder filled:** [Express](docs/software-development/backend/expressjs/EXPRESS_ESSENTIALS.md), [Vaadin](docs/software-development/backend/java/vaadin/VAADIN_ESSENTIALS.md), [Django](docs/software-development/backend/python/django/DJANGO_ESSENTIALS.md), [Flask](docs/software-development/backend/python/flask/FLASK_ESSENTIALS.md), [NestJS](docs/software-development/frontend/javascript/nestjs/NESTJS_ESSENTIALS.md), [Nuxt](docs/software-development/frontend/javascript/nuxt/NUXT_ESSENTIALS.md), [HTML](docs/software-development/frontend/html/HTML_CHEAT_SHEET.md), [AJAX & Fetch](docs/software-development/frontend/ajax/AJAX_FETCH_CHEAT_SHEET.md), [jQuery](docs/software-development/frontend/jquery/JQUERY_ESSENTIALS.md), [MySQL](docs/software-development/db/mysql/MYSQL_ESSENTIALS.md), [MariaDB](docs/software-development/db/mariadb/MARIADB_ESSENTIALS.md), [MongoDB](docs/software-development/db/mongodb/MONGODB_ESSENTIALS.md), [SQL Server](docs/software-development/db/sqlserver/SQLSERVER_ESSENTIALS.md) — site now 64 docs in 13 categories
- **PHP framework deep-dives** (🐘 PHP category): [Laravel](docs/software-development/backend/php/laravel/LARAVEL_ESSENTIALS.md), [Symfony](docs/software-development/backend/php/symfony/SYMFONY_ESSENTIALS.md), [Vanilla PHP](docs/software-development/backend/php/vanilla/VANILLA_PHP_ESSENTIALS.md), [WordPress](docs/software-development/backend/php/wordpress/WORDPRESS_ESSENTIALS.md)
- [Java Coding Styles](docs/software-development/backend/java/JAVA_CODING_STYLES.md) — fills the gap the java README already referenced
- **Link checker gate** (scripts/check-links.mjs, `npm run lint:links`, wired into `lint`) — every relative .md link in docs/ must resolve; caught and fixed 70+ links broken by the tree reorganization

### Changed
- Tree reorganized (user-led): java/python/node/php now under backend/; JS frameworks under frontend/javascript/; all site paths, indexes, and cross-links updated (php folder typo symphony -> symfony)
- **Composer, Node & Frontend expansion** — 7 more stack docs + folder READMEs:
  - [Composer Cheat Sheet](docs/software-development/composer/COMPOSER_CHEAT_SHEET.md) (added to the 🐘 PHP category)
  - [Node Essentials](docs/software-development/backend/node/NODE_ESSENTIALS.md) (new 🟩 Node category)
  - 🎨 Frontend category: [React](docs/software-development/frontend/javascript/react/REACT_ESSENTIALS.md), [Vue](docs/software-development/frontend/javascript/vuejs/VUE_ESSENTIALS.md), [Angular](docs/software-development/frontend/javascript/angularjs/ANGULAR_ESSENTIALS.md), [Next.js](docs/software-development/frontend/javascript/nextjs/NEXTJS_ESSENTIALS.md), [Bootstrap](docs/software-development/frontend/bootstrap/BOOTSTRAP_ESSENTIALS.md)
  - Site now serves 46 docs in 13 categories

### Changed
- SQL Cheat Sheet moved into docs/software-development/db/sql/ (links updated site-wide)
- frontend/reactjs (duplicate of react) and frontend/nextsjs (typo) folders consolidated to react/ and nextjs/
- **Software-development stack expansion** — 11 new docs filling the reorganized docs/software-development/ tree, plus a folder README index:
  - Python: [Project Structures](docs/software-development/backend/python/PYTHON_PROJECT_STRUCTURES.md), [Coding Styles](docs/software-development/backend/python/PYTHON_CODING_STYLES.md), [Frameworks](docs/software-development/backend/python/PYTHON_FRAMEWORKS.md)
  - Java: [Project Structures](docs/software-development/backend/java/JAVA_PROJECT_STRUCTURES.md), [Spring Boot Essentials](docs/software-development/backend/java/springboot/SPRINGBOOT_ESSENTIALS.md), [Quarkus Essentials](docs/software-development/backend/java/quarkus/QUARKUS_ESSENTIALS.md)
  - Dev Environment: [Database Design](docs/software-development/db/DATABASE_DESIGN.md), [SQL Cheat Sheet](docs/software-development/db/SQL_CHEAT_SHEET.md), [Docker Cheat Sheet](docs/software-development/docker/DOCKER_CHEAT_SHEET.md), [CLI Cheat Sheet](docs/software-development/cli/CLI_CHEAT_SHEET.md), [Azure Essentials](docs/software-development/azure/AZURE_ESSENTIALS.md)
  - Three new sidebar categories (🐍 Python, ☕ Java, ⚙️ Dev Environment); PHP category renamed 🐘 PHP; site now serves 39 docs in 11 categories
- [Content Writing](docs/seo/SEO_CONTENT_WRITING.md) — keyword research & intent, one-phrase-per-page, placement map, writing/readability rules, pillar-cluster topical authority, link earning, measurement loop; synthesized from Siteimprove, Orbit Media, Semrush, Bynder, energy.gov, and Michigan Tech best-practice guides
- **SEO section** (docs/seo/, new sidebar category): [SEO Cheat Sheet](docs/seo/SEO_CHEAT_SHEET.md), [Meta Tags Reference](docs/seo/SEO_META_TAGS.md), [Technical SEO](docs/seo/SEO_TECHNICAL.md)
- **PHP Architecture section** (docs/software-development/backend/php/, new sidebar category): [Project Structures](docs/software-development/backend/php/PHP_PROJECT_STRUCTURES.md), [Coding Styles](docs/software-development/backend/php/PHP_CODING_STYLES.md), [Design Patterns (PHP)](docs/software-development/backend/php/PHP_DESIGN_PATTERNS.md), [Frameworks](docs/software-development/backend/php/PHP_FRAMEWORKS.md)
- Site internal-link resolution now handles subdirectory docs (basename matching in bindInternalLinks)
- [docs/TESTING.md](docs/TESTING.md) — how to run the e2e suite, coverage map, CI gating, and conventions for new tests; registered in the interactive site (Quality & Gates), docs index, and README
- Playwright e2e suite (48 tests, ported from laravel-13-cheat-sheet and adapted): header/theming, collapsed-sidebar behavior, navigation, markdown rendering (tables, code labels, TOC, internal links), search, responsive breakpoints, accessibility, scroll-to-top, error handling, full-journey workflows including an all-19-docs sweep. E2E job added to the Pages pipeline as a deploy gate (lint -> e2e -> deploy).
- [docs/README.md](docs/README.md) — central index of all standards docs, grouped by category with read times and a suggested reading order
- **Tips & Tricks** section (new sidebar category): [Git Tips & Tricks](docs/GIT_TIPS_TRICKS.md) (reflog, bisect, worktrees, rerere, autosquash, precision staging), [Actions Advanced](docs/ACTIONS_ADVANCED.md) (reusable workflows, composite actions, caching, dynamic matrices, OIDC hardening, debugging), [Nice to Know](docs/NICE_TO_KNOW.md) (GitHub URL tricks, shortcuts, CODEOWNERS, gh CLI power usage, markdown extras)

## [2.1.1] - 2026-07-15

### Changed
- All GitHub Actions bumped to Node 24 majors (cache v6, checkout v7, setup-node v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5, gitleaks v3, gh-release v3); pinned Node 20 -> 22. Applied to repo workflows and copyable templates.

## [2.1.0] - 2026-07-15

Standards expansion based on lessons from the laravel-13-cheat-sheet build: linting gates, interactive docs site, and eleven new standards documents.

### Added
- Interactive standards reference site (`index.html` + `assets/`) — searchable sidebar, dark/light mode, auto-TOC from headings, syntax-highlighted examples, table rendering, mobile responsive; deployed via GitHub Pages with a lint gate
- **[Linting Gates](docs/LINTING_GATES.md)** — linting as a deployment gate, with hard-won lessons (BOM-free JSON configs, glob quoting on Windows, pragmatic StyleLint relaxation, CDN globals in ESLint, `head-script-disabled`)
- **[Quality Gates](docs/QUALITY_GATES.md)** — four-gate model: pre-commit → PR merge → deploy → release, with per-project adoption levels
- **[Code Quality](docs/CODE_QUALITY.md)** — testing layers, full-scope e2e coverage standard (from the 17→50+ Playwright expansion), coverage floors, static analysis levels
- **[Security & Performance](docs/SECURITY_PERFORMANCE.md)** — production baseline checklists: CSRF/XSS, auth, mass assignment, N+1 prevention, caching, rate limiting
- **[Async Patterns](docs/ASYNC_PATTERNS.md)** — queue/job/scheduler/broadcasting standards with idempotency and failure-handling requirements
- **[Design Patterns](docs/DESIGN_PATTERNS.md)** — pattern catalog with use/don't-use decision table, plus frontend patterns proven in the docs sites
- **[API Standards](docs/API_STANDARDS.md)** — versioning, resources, pagination, status codes, CORS, minimum API test coverage
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** — gated pipelines, GitHub Pages lessons (hybrid-config fix, root serving), expand/contract migrations, rollback procedures
- **[Monorepo Structure](docs/MONOREPO_STRUCTURE.md)** — workspaces, shared configs, path-filtered CI, submodule two-step workflow (from win12-locales)
- **[Pull Request Process](docs/PULL_REQUEST_PROCESS.md)** — PR lifecycle, review standards, merge strategies, size guidelines
- **[Implementation Checklist](docs/IMPLEMENTATION_CHECKLIST.md)** — phase-by-phase adoption path for new projects
- Workflow templates: `lint-gate.yml`, `security-scan.yml`, `deploy.yml`, `deploy-pages.yml` (all using the gating pattern), plus a workflows README
- Lint tooling for this repo itself (ESLint, StyleLint, HTMLHint) — the repo now passes its own gates
- `CHANGELOG.md`, `package.json`

### Changed
- SEO Cheat Sheet upgraded from the same sources: title pattern `Primary — Secondary | Brand`, question-phrased H2s (featured-snippet formula), link-new-from-established rule, PDF/document SEO; Technical SEO gains AI-crawler robots.txt guidance and CTR/timeline monitoring items
- docs/architecture/ renamed to docs/software-development/
- README restructured: docs grouped by Core / Quality / Architecture / Operations / Setup; workflow catalog expanded; interactive site documented
- `.gitignore` expanded (node_modules, env files, OS noise)

## [2.0.0] - 2026-07-13

### Changed
- Static analysis workflow trimmed to essentials
- Tests workflow removed from repo's own CI (standards repo has no test matrix)

## [1.0.0] - 2026-07-12

### Added
- Initial standards: Branching Strategy, Commit Standards, Release Standards, File Structure, Documentation Standards
- Workflow templates: tests.yml, release.yml
- Issue and PR templates, dependabot config, labeler
- QUICK_REFERENCE.md
