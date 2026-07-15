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

## Related

- [Workflow templates](../templates/.github/workflows/README.md) — copyable GitHub Actions with the gating pattern
- [Quick Reference](../QUICK_REFERENCE.md) — commands and checklists at a glance
- [CHANGELOG](../CHANGELOG.md) — what changed, when
