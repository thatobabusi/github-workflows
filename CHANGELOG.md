# Changelog

All notable changes to this project are documented here. Format follows [Keep a Changelog](https://keepachangelog.com); versioning follows [SemVer](https://semver.org).

## [Unreleased]

### Added
- **SEO section** (docs/seo/, new sidebar category): [SEO Cheat Sheet](docs/seo/SEO_CHEAT_SHEET.md), [Meta Tags Reference](docs/seo/SEO_META_TAGS.md), [Technical SEO](docs/seo/SEO_TECHNICAL.md)
- **PHP Architecture section** (docs/architecture/php/, new sidebar category): [Project Structures](docs/architecture/php/PHP_PROJECT_STRUCTURES.md), [Coding Styles](docs/architecture/php/PHP_CODING_STYLES.md), [Design Patterns (PHP)](docs/architecture/php/PHP_DESIGN_PATTERNS.md), [Frameworks](docs/architecture/php/PHP_FRAMEWORKS.md)
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
