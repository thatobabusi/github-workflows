# Branching Strategy

A clean, linear branching model where features branch from main and promote through integration layers.

## Overview

```
main/master (production, stable)
     ↑
     ├─ UAT (user acceptance) → PR to main after approval
     ↑
     ├─ QA (quality assurance) → promote to UAT
     ↑
     ├─ development (integration) → promote to QA
     ↑
     └─ feature/* (feature development) → PR to development
```

**Key Principle:** Features always branch from main (latest stable), promote through development → QA → UAT, then PR back to main.

## Branch Types

### `main` or `master` (Production)
- **Purpose:** Production-ready code only, single source of truth
- **Protection:** Requires PR review, all checks pass, status checks required
- **Merge from:** `uat/*` via PR (after all testing passed)
- **Policy:** 
  - Only stable, tested code
  - All releases tagged (v1.2.3)
  - All features have gone through full pipeline
  - Hotfixes for critical issues only
- **Lifetime:** Permanent, never delete
- **Deploy to:** Production

**When to create:** At project initialization (never delete)

### `development`
- **Purpose:** Integration branch where features first merge
- **Branch from:** main (weekly sync)
- **Merge from:** feature/* (via PR with 1 review)
- **Merge to:** qa/* (promotion)
- **Policy:** 
  - Contains accepted features from multiple branches
  - Serves as integration point before QA
  - Continuously tested
  - Synced back from main after releases
- **Lifetime:** Permanent, never delete
- **Deploy to:** Development/staging environment

**When to create:** At project initialization (never delete)

### `feature/*` (Feature Development)
- **Naming:** `feature/descriptive-name`
- **Created from:** `main` (always branch from latest stable)
- **Purpose:** Develop individual features
- **Merge to:** `development` (via PR)
- **Policy:** 
  - One feature per branch
  - Keep short-lived (< 2 weeks)
  - Frequent atomic commits
  - Include tests with feature code
  - PR title: `feat(scope): description`
- **Lifetime:** Delete after merge to development
- **Deploy to:** Feature environment (optional)

**Examples:**
```bash
feature/20260712-01-User-Authentication
feature/20260712-02-Payment-Integration
feature/20260713-01-Admin-Dashboard
feature/20260713-02-API-Rate-Limiting
```

**Process:**
```bash
git checkout main
git pull origin main
git checkout -b feature/20260712-01-User-Authentication
# ... work and commit ...
git push -u origin feature/20260712-01-User-Authentication
# Create PR: development ← feature/20260712-01-User-Authentication
```

### `qa/*` (Quality Assurance Testing)
- **Naming:** `qa/v1.2.0` or `qa/release-2026-07`
- **Created from:** `development` (promotion after feature merges)
- **Purpose:** QA testing and bug fixes
- **Merge to:** `uat/*` (promotion)
- **Policy:**
  - Bug fixes only (no new features)
  - QA lead approval required
  - Test coverage for all fixes
  - All tests passing
  - Integration testing complete
- **Lifetime:** Delete after merge to UAT
- **Deploy to:** QA environment

**When to create:** When development is ready for testing phase

**Process:**
```bash
git checkout -b qa/v1.2.0 development
git push -u origin qa/v1.2.0
# QA tests and approves
# Create PR: uat/v1.2.0 ← qa/v1.2.0
```

### `uat/*` (User Acceptance Testing)
- **Naming:** `uat/v1.2.0` or `uat/release-2026-07`
- **Created from:** `qa/*` (promotion after QA approval)
- **Purpose:** Business/stakeholder validation
- **Merge to:** `main` (via PR after UAT sign-off)
- **Policy:**
  - No code changes (config/docs only)
  - Business owner sign-off required
  - Client/stakeholder testing
  - Final verification before production
  - All checks must pass
- **Lifetime:** Delete after merge to main
- **Deploy to:** UAT environment

**When to create:** When QA testing complete and approved

**Process:**
```bash
git checkout -b uat/v1.2.0 qa/v1.2.0
git push -u origin uat/v1.2.0
# UAT tests and approves
# Create PR: main ← uat/v1.2.0 (with release notes)
# After approval, merge to main
git checkout main
git merge --no-ff uat/v1.2.0 -m "Release v1.2.0"
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags
```

### `hotfix/*` (Critical Production Fixes)
- **Naming:** `hotfix/bug-description`
- **Created from:** `main` (for production issues)
- **Purpose:** Emergency fixes for production
- **Merge to:** main (immediate), then sync to development
- **Policy:**
  - Critical/security issues only
  - 2+ approvals required
  - Immediate merge after approval
  - Tag release immediately (v1.2.1)
  - Sync back to development to prevent regression
- **Lifetime:** Delete after merge and sync complete

**Example:**
```bash
hotfix/security-vulnerability-cve-2024-1234
hotfix/critical-payment-bug
```

**Process:**
```bash
git checkout -b hotfix/critical-bug main
git commit -m "fix: resolve production issue"
git push -u origin hotfix/critical-bug
# Fast-track review and merge to main
git checkout main
git merge --no-ff hotfix/critical-bug -m "Hotfix v1.2.1"
git tag -a v1.2.1 -m "Hotfix v1.2.1"
git push origin main --tags

# Sync back to development
git checkout development
git merge --no-ff main -m "Sync hotfix to development"
git push origin development
```

## Workflow Examples

### Feature Development (1-2 weeks)

```bash
# 1. Always start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/user-auth

# 3. Make changes with atomic commits
git add .
git commit -m "feat(auth): add login form component"
git commit -m "feat(auth): implement JWT validation"

# 4. Push and create PR
git push -u origin feature/user-auth
# Create PR on GitHub: development ← feature/user-auth
# Request 1 review

# 5. After approval, merge on GitHub
# Delete branch: git branch -d feature/user-auth
```

### Release Workflow (monthly)

**Development ready for QA:**
```bash
git checkout -b qa/v1.2.0 development
git push -u origin qa/v1.2.0
# Create PR: uat/v1.2.0 ← qa/v1.2.0 (no code changes, QA fixes only)
```

**QA approved, move to UAT:**
```bash
git checkout -b uat/v1.2.0 qa/v1.2.0
git push -u origin uat/v1.2.0
# Create PR: main ← uat/v1.2.0
# Wait for business/stakeholder approval
```

**UAT approved, release to main:**
```bash
git checkout main
git pull origin main
git merge --no-ff uat/v1.2.0 -m "Release v1.2.0"
git tag -a v1.2.0 -m "Release v1.2.0

Features:
- User authentication
- Payment integration

Bug Fixes:
- Fixed performance issues"

git push origin main --tags

# Sync release back to development
git checkout development
git pull origin development
git merge --no-ff main -m "Sync v1.2.0 to development"
git push origin development

# Cleanup
git branch -d qa/v1.2.0 uat/v1.2.0
git push origin --delete qa/v1.2.0 uat/v1.2.0
```

### Hotfix for Production Issue

```bash
# 1. Branch from main (production issue)
git checkout -b hotfix/security-patch main

# 2. Fix and test thoroughly
git commit -m "fix(security): patch authentication bypass"

# 3. Create PR to main (fast-track)
git push -u origin hotfix/security-patch
# Create PR: main ← hotfix/security-patch
# Get 2 approvals (expedited)

# 4. Merge and tag immediately
git checkout main
git merge --no-ff hotfix/security-patch -m "Hotfix v1.2.1: security patch"
git tag -a v1.2.1 -m "Hotfix v1.2.1"
git push origin main --tags

# 5. Sync to development to prevent regression
git checkout development
git merge --no-ff main -m "Sync hotfix v1.2.1 to development"
git push origin development

# 6. Cleanup
git branch -d hotfix/security-patch
git push origin --delete hotfix/security-patch
```

## Branch Protection Rules

### Protect `main` branch
```yaml
Branch: main
- Require pull request reviews: 2 approvals
- Require status checks to pass
- Require branches to be up to date: Yes
- Require code reviews before merge: Yes
- Dismiss stale PR approvals on push: Yes
- Restrict who can push: Admins/Maintainers only
- Allow force pushes: No
- Allow deletions: No
```

### Protect `development` branch
```yaml
Branch: development
- Require pull request reviews: 1 approval
- Require status checks to pass: Yes
- Require branches to be up to date: Yes
- Dismiss stale PR approvals on push: Yes
- Allow force pushes: No
- Allow deletions: No
```

## Naming Conventions

All branches include date/time for tracking and organization.

**Format:** `<type>/<YYYYMMDD>-<counter>-<Description>`

- **type** — branch type (feature, hotfix, qa, uat)
- **YYYYMMDD** — date branch created (ISO 8601)
- **counter** — sequential number for that day (01, 02, 03, ...)
- **Description** — clear, PascalCase or kebab-case

### Feature Branches
```
feature/20260712-01-User-Authentication
feature/20260712-02-Payment-Integration
feature/20260713-01-Mobile-Responsive-Design
feature/20260715-01-API-Rate-Limiting
feature/20260716-01-Dark-Mode-Support
```

**Today's feature count:**
```
feature/20260712-01-First-Feature      ← 1st feature on July 12
feature/20260712-02-Second-Feature     ← 2nd feature on July 12
feature/20260712-03-Third-Feature      ← 3rd feature on July 12
feature/20260713-01-New-Day-Feature    ← 1st feature on July 13 (counter resets)
```

### QA Branches
```
qa/20260715-01-v1.2.0-Testing
qa/20260715-02-Sprint-Hotfixes
qa/20260720-01-Release-Candidate
```

### UAT Branches
```
uat/20260715-01-v1.2.0-Approval
uat/20260715-02-Client-Testing
uat/20260720-01-Final-Acceptance
```

### Hotfix Branches
```
hotfix/20260712-01-Security-Vulnerability-CVE-2024-1234
hotfix/20260713-01-Critical-Data-Loss-Issue
hotfix/20260714-01-Payment-Processing-Bug
hotfix/20260714-02-Production-Crash-Fix
```

### Branch Naming Benefits

- **Chronological Order** — Easy to see when branch was created
- **Unique Identifiers** — No name collisions across dates
- **Sequential Tracking** — Counter shows how many branches that day
- **Clear Organization** — Date-based organization in git branch list
- **Easy Archival** — Old branches grouped by date
- **Audit Trail** — When work was started is immediately visible

### Examples in Git History

```
feature/20260701-01-Initial-Setup
feature/20260701-02-Database-Schema
feature/20260701-03-Auth-Middleware
feature/20260702-01-User-Controller
feature/20260702-02-API-Endpoints
feature/20260703-01-Frontend-Components
feature/20260704-01-Testing-Suite
```

## Key Principles

1. **Main is Stable** — Only production-ready code on main
2. **Feature Branch from Main** — Always get latest stable code
3. **Linear Promotion** — feature → development → QA → UAT → main
4. **No Cherry-picking** — Full pipeline ensures quality
5. **PR-based Workflow** — Traceability and review trail
6. **Tag All Releases** — Never trust branches for production
7. **Sync After Release** — Merge main back to development
8. **Atomic Commits** — Each commit should be independently valid
9. **Short Branches** — Max 2 weeks to minimize merge conflicts
10. **Clear Communication** — PR descriptions explain why

## Deployment Strategy

```
feature/* → Feature Env (optional, developer-triggered)
development → Dev/Staging Env (auto-deploy)
qa/* → QA Env (auto-deploy)
uat/* → UAT Env (auto-deploy)
main → Production (manual trigger or auto after UAT approval)
```

## Best Practices

1. **Keep feature branches short-lived** — Merge within 1-2 weeks
2. **Frequent commits** — Commit after each logical change
3. **Sync with main regularly** — Pull latest main into feature branch
4. **Write clear PR descriptions** — Explain what and why
5. **Test before pushing** — Run full test suite locally
6. **One feature per branch** — Don't combine unrelated work
7. **Use semantic commits** — Enables automated changelog
8. **Review thoroughly** — Don't approve without understanding
9. **Resolve conflicts early** — Don't let branches drift too far
10. **Clean up branches** — Delete after merge

## Troubleshooting

### Feature branch is behind main
```bash
git checkout feature/my-feature
git pull origin main
git push origin feature/my-feature
```

### Accidentally branched from development instead of main
```bash
git rebase main feature/my-feature
git push -f origin feature/my-feature
```

### Need to sync development from main after release
```bash
git checkout development
git pull origin main
git push origin development
```

### Hotfix got merged to development by accident
No problem! Development is meant to receive all code eventually. Ensure development syncs from main after hotfix release.

## FAQ

**Q: Can I branch feature from development instead of main?**  
A: No. Always branch from main to ensure you have the latest stable code.

**Q: What if my feature takes longer than 2 weeks?**  
A: Keep syncing with main to avoid large merge conflicts. Consider splitting into smaller features.

**Q: Do I need to create qa/* and uat/* branches for every release?**  
A: Yes. This ensures proper testing and approval workflow.

**Q: Can features be developed in parallel?**  
A: Yes! Multiple features can branch from main simultaneously. They integrate in development.

**Q: What if QA finds bugs?**  
A: Fix directly in qa/* branch and push. Retesting happens in same branch.

**Q: Can hotfixes be released without UAT?**  
A: For critical issues only. All testing must still pass and approvals required.

**Q: How do I merge main back to development?**  
A: After releasing to main, create PR: development ← main with `Sync` commit message.

