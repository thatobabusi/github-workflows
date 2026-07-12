# Release Standards

Semantic versioning, release workflow, tagging, and changelog management.

## Semantic Versioning

**Format:** `MAJOR.MINOR.PATCH`

- **MAJOR** (X.0.0) — Breaking changes, incompatible API changes
- **MINOR** (1.Y.0) — New features, backward compatible
- **PATCH** (1.0.Z) — Bug fixes only, no new features

**Examples:**
```
1.0.0 — Initial release
1.1.0 — Add new features
1.1.1 — Fix bugs
2.0.0 — Breaking changes
```

## Release Workflow

### 1. Prepare Release Branch
```bash
# Create release branch from development
git checkout -b release/v2.1.0 development

# Update version in files (composer.json, package.json, etc.)
# Update CHANGELOG.md with new version
# Commit changes
git commit -m "chore(release): bump version to 2.1.0"
```

### 2. QA Testing (qa/* branch)
```bash
# QA creates PR from qa/v2.1.0 ← development
# QA team tests and approves
# Merge to uat/* after approval
```

### 3. UAT Testing (uat/* branch)
```bash
# UAT creates PR from uat/v2.1.0 ← qa/v2.1.0
# Business stakeholders approve
# Ready for production merge
```

### 4. Release to Main
```bash
# Create PR: main ← uat/v2.1.0
# Merge with release commit
git checkout main
git merge --no-ff uat/v2.1.0 -m "Release v2.1.0"

# Tag release
git tag -a v2.1.0 -m "Release v2.1.0

Features:
- New user dashboard
- OAuth2 support
- Performance improvements"

# Push
git push origin main --tags
```

### 5. Create GitHub Release
```bash
gh release create v2.1.0 \
  --title "v2.1.0: New Features" \
  --notes "## Features
- User dashboard
- OAuth2 provider support

## Bug Fixes
- Fixed race condition in payments

## Performance
- Optimized queries (40% faster)"
```

### 6. Sync Back to Development
```bash
git checkout development
git pull origin main
git merge --no-ff main -m "Sync v2.1.0 to development"
git push origin development
```

### 7. Cleanup
```bash
git branch -d release/v2.1.0 qa/v2.1.0 uat/v2.1.0
git push origin --delete release/v2.1.0 qa/v2.1.0 uat/v2.1.0
```

## CHANGELOG.md Format

Keep `CHANGELOG.md` updated following "Keep a CHANGELOG" format:

```markdown
# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- New feature X
- New feature Y

### Changed
- Improved feature A
- Updated documentation

### Fixed
- Fixed bug B
- Fixed bug C

### Deprecated
- Deprecated feature D (will remove in v3.0.0)

### Security
- Fixed security vulnerability

## [2.1.0] - 2026-07-15

### Added
- User dashboard
- OAuth2 support for Google and GitHub
- API rate limiting

### Changed
- Updated Laravel to 11.x
- Refactored authentication system
- Improved error messages

### Fixed
- Fixed race condition in payment processing
- Fixed N+1 queries in user reports

### Performance
- Optimized database queries (40% faster)
- Reduced bundle size by 25%

## [2.0.0] - 2026-06-01

### Added
- Full test suite (94+ tests)
- GitHub Actions CI/CD
- Professional documentation

### Changed
- **BREAKING:** Updated API endpoint structure
- Minimum PHP version now 7.4
- Minimum Laravel version now 7.0

### Removed
- Removed deprecated features from v1.x
```

## Version Bump Checklist

Before releasing, update:

- [ ] `composer.json` — version field (if applicable)
- [ ] `package.json` — version field (if applicable)
- [ ] `CHANGELOG.md` — new version section with date
- [ ] `README.md` — if version referenced in examples
- [ ] `docs/` — if version-specific guides updated
- [ ] Git tag annotation — descriptive release notes

## GitHub Release Template

**Title:** `v2.1.0: Brief Description`

**Body:**
```markdown
## 🎯 Highlights
- User dashboard implementation
- OAuth2 provider support
- 40% performance improvement

## ✨ Features
- New feature X
- New feature Y

## 🐛 Bug Fixes
- Fixed race condition in payments
- Fixed N+1 queries

## 📈 Performance
- Optimized queries (40% faster)
- Reduced bundle size

## 🔗 Links
- [Packagist](link)
- [Changelog](link)
- [Contributing](link)

---
**Release Date:** 2026-07-15  
**Commit:** abc123def456  
**Tag:** v2.1.0
```

## Hotfix Release

For critical production fixes:

```bash
# 1. Create hotfix from main
git checkout -b hotfix/security-patch main

# 2. Fix and commit
git commit -m "fix(security): patch vulnerability"

# 3. Merge to main
git checkout main
git merge --no-ff hotfix/security-patch -m "Hotfix v2.1.1"

# 4. Tag immediately
git tag -a v2.1.1 -m "Hotfix v2.1.1"
git push origin main --tags

# 5. Sync to development
git checkout development
git merge --no-ff main -m "Sync hotfix v2.1.1"
git push origin development

# 6. Cleanup
git branch -d hotfix/security-patch
git push origin --delete hotfix/security-patch
```

## Pre-release Versions

For beta/RC versions:

```
v2.1.0-beta.1   — First beta
v2.1.0-rc.1     — Release candidate
v2.1.0-alpha.1  — Alpha version
```

GitHub Release naming:
```bash
gh release create v2.1.0-beta.1 --prerelease
```

## Release Automation

### Conventional Changelog
```bash
# Generate changelog automatically from commits
npm install -g conventional-changelog-cli
conventional-changelog -p angular -i CHANGELOG.md -s
```

### GitHub Actions Release Workflow
See `workflows/release.yml` for automated release creation.

## Versioning Strategy by Project Type

### Libraries (PHP/JavaScript)
- Strictly follow Semantic Versioning
- Announce breaking changes in advance
- Provide migration guides
- Maintain last major version for security patches

### Applications (Web/Desktop)
- Follow Semantic Versioning loosely
- Can use calendar versioning if preferred (2026.7 for July 2026)
- Focus on user-facing changes
- Internal refactors don't bump version

### Monorepos
- Each package versioned independently
- Cross-package dependencies managed explicitly
- Release notes mention all affected packages

## Release Cadence

**Recommended:**
- Features: Monthly minor releases (1.1.0 → 1.2.0)
- Hotfixes: As needed (1.2.0 → 1.2.1)
- Major: Annually or when breaking changes accumulate
- Beta/RC: 2-week cycle before major release

## Post-Release

After release:

1. ✅ Verify release on package manager (Packagist, npm, etc.)
2. ✅ Test installation in clean environment
3. ✅ Update project documentation if needed
4. ✅ Announce release on social media/newsletter
5. ✅ Close related GitHub issues
6. ✅ Monitor for critical bugs

## FAQ

**Q: How do I release v1.0.0 for the first time?**  
A: Follow standard release workflow. v1.0.0 indicates stable, feature-complete release.

**Q: Should I release a new version for documentation changes?**  
A: No. Documentation updates don't warrant version bump unless fixing critical errors.

**Q: Can I skip a version number?**  
A: Generally no. Versions should be sequential. Skip only if intentional (e.g., marketing alignment).

**Q: What if I made a mistake in v2.1.0 release?**  
A: Publish v2.1.1 hotfix immediately. Don't try to change released tag.

**Q: How long should I support previous versions?**  
A: Minimum 1 major version (security patches). Longer for libraries (2-3 major versions).
