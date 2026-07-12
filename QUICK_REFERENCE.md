# Quick Reference

Fast lookup guide for common workflows and standards.

## Branching Quick Commands

```bash
# Start feature (ALWAYS from main)
git checkout main
git pull origin main
git checkout -b feature/my-feature

# Push and create PR to development
git push -u origin feature/my-feature
# Create PR: development ← feature/my-feature

# Create release branch (from development)
git checkout -b qa/v1.2.0 development
git push -u origin qa/v1.2.0
# Create PR: uat/v1.2.0 ← qa/v1.2.0

# Promote to UAT (from qa)
git checkout -b uat/v1.2.0 qa/v1.2.0
git push -u origin uat/v1.2.0
# Create PR: main ← uat/v1.2.0

# Release to main
git checkout main
git pull origin main
git merge --no-ff uat/v1.2.0 -m "Release v1.2.0"
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags

# Sync main back to development
git checkout development
git pull origin development
git merge --no-ff main -m "Sync v1.2.0 to development"
git push origin development

# Hotfix
git checkout -b hotfix/critical-bug main
git commit -m "fix: critical production issue"
git push -u origin hotfix/critical-bug
# Fast-track PR and merge to main
git checkout main
git merge --no-ff hotfix/critical-bug -m "Hotfix v1.2.1"
git tag -a v1.2.1 -m "Hotfix v1.2.1"
git push origin main --tags
```

## Commit Message Quick Format

```
<type>(<scope>): <subject>

<body explaining why>

Closes #123
```

**Types:** `feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `ci`

**Examples:**
```
feat(auth): add OAuth2 support
fix(payment): resolve race condition
docs(readme): add quickstart
test(auth): add OAuth tests
chore(deps): update Laravel
```

## Release Checklist

- [ ] Update version in composer.json/package.json
- [ ] Update CHANGELOG.md with new version
- [ ] Commit: `chore(release): bump to v1.2.0`
- [ ] Create release branch: `release/v1.2.0`
- [ ] Go through QA → UAT → Main workflow
- [ ] Merge to main with release commit
- [ ] Tag: `git tag -a v1.2.0 -m "Release v1.2.0"`
- [ ] Push: `git push origin main --tags`
- [ ] Create GitHub Release
- [ ] Sync back to development
- [ ] Announce release

## Semantic Versioning Quick Guide

| Change | Version |
|--------|---------|
| Breaking API change | v1.0.0 → v2.0.0 |
| New feature | v1.0.0 → v1.1.0 |
| Bug fix | v1.1.0 → v1.1.1 |
| Security fix | v1.1.0 → v1.1.1 |
| Documentation | No version bump |

## File Structure Quick Checklist

- [ ] `.github/workflows/` — GitHub Actions
- [ ] `.github/ISSUE_TEMPLATE/` — Issue templates
- [ ] `.github/pull_request_template.md` — PR template
- [ ] `docs/` — All documentation
- [ ] `src/` or `packages/` — Source code
- [ ] `tests/` — Test files
- [ ] `config/` — Configuration
- [ ] `art/` — Logos, graphics
- [ ] `README.md` — Professional header
- [ ] `CHANGELOG.md` — Version history
- [ ] `LICENSE.md` — MIT license
- [ ] `.gitignore` — Standard patterns
- [ ] `.editorconfig` — Code formatting

## Documentation Checklist

- [ ] Professional README with header
- [ ] CHANGELOG.md in "Keep a Changelog" format
- [ ] docs/BRANCHING_STRATEGY.md
- [ ] docs/COMMIT_STANDARDS.md
- [ ] docs/RELEASE_STANDARDS.md
- [ ] docs/CONTRIBUTING.md
- [ ] docs/guides/ with setup/configuration
- [ ] .github/CODE_OF_CONDUCT.md
- [ ] .github/ISSUE_TEMPLATE/
- [ ] .github/pull_request_template.md
- [ ] SECURITY.md with vulnerability policy

## GitHub Workflow Checklist

- [ ] tests.yml — Multi-version testing
- [ ] static-analysis.yml — Code quality
- [ ] release.yml — Release automation
- [ ] dependabot-auto-merge.yml — Security updates
- [ ] labeler.yml — PR auto-labeling
- [ ] dependabot.yml configuration

## New Project Setup (5 minutes)

```bash
# 1. Clone/create repo
git clone/init your-project
cd your-project

# 2. Copy standards
cp -r github-workflows/templates/.github .
cp -r github-workflows/docs .

# 3. Customize
# - Update README.md with project info
# - Update workflows for your stack
# - Update CHANGELOG.md

# 4. Configure branch protection (GitHub)
# - require PR review
# - require status checks
# - restrict who can push

# 5. First commit
git add .
git commit -m "chore: init project structure and standards"
git push -u origin development
```

## Common Patterns

### Feature Development (1-2 weeks)
```
main → feature/my-feature → PR to development
```
(Always branch from main, merge to development first)

### Monthly Release Promotion
```
development → qa/v1.2.0 → uat/v1.2.0 → PR to main (tag release)
```
(Linear promotion through testing gates)

### Critical Bug (same day)
```
main → hotfix/bug-fix → main (tag + sync to development)
```
(Direct to production for critical issues)

### Security Patch (immediate)
```
main → hotfix/security → main (tag v1.1.1)
```
(Fast-track hotfix to production)

## Troubleshooting Quick Fixes

**Branch behind development:**
```bash
git pull origin development
git push origin feature/my-feature
```

**Accidentally committed to wrong branch:**
```bash
git reset --soft HEAD~1
git checkout -b feature/new-branch
git commit
```

**Need to sync main changes to development:**
```bash
git checkout development
git pull origin main
git push origin development
```

**Oops, pushed sensitive data:**
```bash
git reset --soft HEAD~1
git remove sensitive-file
git commit
```

## Standards Documentation Map

| Topic | File | Purpose |
|-------|------|---------|
| Git Workflow | BRANCHING_STRATEGY.md | Multi-tier branches, workflows |
| Commits | COMMIT_STANDARDS.md | Semantic messages, changelog |
| Releases | RELEASE_STANDARDS.md | Versioning, tagging, GitHub |
| File Layout | FILE_STRUCTURE.md | Directory organization |
| Docs | DOCUMENTATION_STANDARDS.md | README, guides, API docs |
| This File | QUICK_REFERENCE.md | Quick lookup guide |

## Key URLs

- **Raw files:** `https://raw.githubusercontent.com/thatobabusi/github-workflows/main/...`
- **Workflows template:** `templates/.github/workflows/`
- **Full docs:** See README.md in main repo

## Need Help?

1. Check QUICK_REFERENCE.md (this file)
2. Read relevant docs (BRANCHING_STRATEGY, COMMIT_STANDARDS, etc.)
3. Look at examples in docs/
4. Open issue in github-workflows repo

---

**Last Updated:** 2026-07-12  
**Version:** 1.0.0
