# Implementation Checklist

Complete setup checklist for a new project adopting these standards. Work top to bottom; each phase builds on the last.

## Phase 1 — Repository Foundation

- [ ] Create repo with `main` branch; add `development` branch immediately
- [ ] `.gitignore` appropriate to stack **before first commit** (no `.env`, `node_modules/`, build output ever committed)
- [ ] `LICENSE.md` (MIT default)
- [ ] `README.md` with modern header ([Documentation Standards](DOCUMENTATION_STANDARDS.md))
- [ ] `CHANGELOG.md` with `[Unreleased]` section
- [ ] Configure git identity — commits authored by you only

## Phase 2 — Standards Files

- [ ] Copy `docs/BRANCHING_STRATEGY.md` and `docs/COMMIT_STANDARDS.md` from this repo
- [ ] Copy `templates/.github/` → `.github/` (issue templates, PR template)
- [ ] Declare quality gate level in README (default **L2**, see [Quality Gates](QUALITY_GATES.md))
- [ ] Project structure follows [File Structure](FILE_STRUCTURE.md) for the stack

## Phase 3 — Linting (before writing much code)

- [ ] Linter configs added:
  - JS/TS: `.eslintrc.json` (+ globals for CDN libs)
  - CSS: `.stylelintrc.json` (pragmatic ruleset — see [Linting Gates](LINTING_GATES.md))
  - HTML: `.htmlhintrc`
  - PHP: `pint.json` + `phpstan.neon`
- [ ] Config JSON files saved **without BOM**
- [ ] `lint` script in package.json / composer.json running all linters
- [ ] Full suite passes locally: `npm run lint`

## Phase 4 — Testing

- [ ] Test directories scaffolded (`tests/Unit`, `tests/Feature`, `tests/e2e`)
- [ ] First test written and passing (proves the harness works)
- [ ] Playwright configured for UI projects; e2e suite covers the [full frontend scope](CODE_QUALITY.md) as features land
- [ ] Coverage floor set (80% app / 90% package)

## Phase 5 — CI/CD

- [ ] Copy workflows from `workflows/`:
  - [ ] `lint-gate.yml` — always
  - [ ] `tests.yml` — always
  - [ ] `security-scan.yml` — always
  - [ ] `static-analysis.yml` — PHP/TS projects
  - [ ] `deploy.yml` or `deploy-pages.yml` — when deployable
  - [ ] `release.yml`, `labeler.yml`, `dependabot-auto-merge.yml` — as needed
- [ ] Workflow trigger `paths:` cover everything that ships (source, assets, configs, the workflow file itself)
- [ ] Deploy job has `needs: lint` (and `needs: test`) with `if: success()`
- [ ] For GitHub Pages: build_type set to workflow (`gh api -X PUT repos/{owner}/{repo}/pages -f build_type=workflow`)
- [ ] Dependabot config (`.github/dependabot.yml`)

## Phase 6 — Branch Protection

On `main` and `development`:

- [ ] Require pull request before merging (1+ approval)
- [ ] Require status checks: `Lint Code`, `Tests` (+ `Static Analysis`, `Security Scan`)
- [ ] Require branches up to date before merge
- [ ] Block force pushes

## Phase 7 — First Release

- [ ] Verify no tag collisions: `git tag -l`
- [ ] Version in manifest matches intended tag
- [ ] CHANGELOG updated
- [ ] Tag + push + GitHub Release ([Release Standards](RELEASE_STANDARDS.md))
- [ ] Repo About section: description, topics, website link

## Phase 8 — Deployment (when applicable)

- [ ] `.env.example` complete and current
- [ ] Production env: `APP_DEBUG=false`, config cached
- [ ] Health check endpoint live and monitored
- [ ] Error tracking wired (Sentry/Flare)
- [ ] Rollback procedure tested once ([Deployment Guide](DEPLOYMENT_GUIDE.md))
- [ ] Queue workers under supervisor + `queue:restart` in deploy script (if queues used)

## Quick Reference — Minimum Viable Setup

For a small project, the 20% that gives 80%:

1. `.gitignore` + README + branches (`main`, `development`)
2. Linter configs + `lint` script, passing locally
3. `lint-gate.yml` + `tests.yml` workflows
4. Branch protection requiring both checks
5. Semantic commits from day one

Everything else can be layered in as the project grows.

## See Also

- [Quality Gates](QUALITY_GATES.md)
- [Linting Gates](LINTING_GATES.md)
- [File Structure](FILE_STRUCTURE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
