<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1f2937,50:374151,100:4b5563&height=180&section=header&text=GitHub%20Workflows&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Unified%20Standards%20%7C%20Branching%20Strategy%20%7C%20CI%2FCD%20Templates&descAlignY=55&descSize=16" alt="GitHub Workflows Standards" />

<a href="https://github.com/thatobabusi/github-workflows">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=18&pause=1200&color=374151&center=true&vCenter=true&width=650&lines=Reusable+standards+for+all+projects;Branching+%E2%80%A2+Commits+%E2%80%A2+Releases;Documentation+%E2%80%A2+Workflows+%E2%80%A2+Structure" alt="Typing intro" />
</a>

<br/><br/>

**[📚 Branching Strategy](#branching-strategy)** · **[📝 Commit Standards](#commit-standards)** · **[🏷️ Release Standards](#release-standards)** · **[📁 File Structure](#file-structure)** · **[🔄 Workflows](#workflows)** · **[📖 Documentation](#documentation)**

</div>

<hr/>

A comprehensive, unified set of standards, templates, and best practices for all thatobabusi projects. This repository serves as the single source of truth for:

- **Branching Strategy** — main/development/feature/QA/UAT workflow
- **Commit Standards** — semantic commit messages for automated changelog
- **Release Management** — versioning, tagging, changelog automation
- **CI/CD Workflows** — reusable GitHub Actions templates
- **File Structure** — consistent project organization
- **Documentation** — professional README, guides, and templates
- **Code Quality** — testing, linting, analysis standards

## 🚀 Quick Start

### For New Projects

```bash
# Copy standards to your project
cp -r github-workflows/docs .
cp -r github-workflows/templates/.github .
cp github-workflows/QUICK_REFERENCE.md .

# Customize for your project
# - Update README.md
# - Customize workflows
# - Update CHANGELOG.md
```

### For Existing Projects

Reference the standards and templates when:
- Setting up CI/CD workflows
- Defining branch strategy
- Establishing commit conventions
- Creating documentation
- Organizing project structure

## 📋 Standards Overview

| Area | Standard | Details |
|------|----------|---------|
| **Branches** | main/development/feature/QA/UAT | Multi-tier workflow |
| **Commits** | Semantic format | `feat(scope): message` |
| **Versioning** | Semantic Versioning | MAJOR.MINOR.PATCH |
| **Releases** | Tag + GitHub Release | Auto-generated notes |
| **Testing** | Matrix testing | Multiple versions/OS |
| **Documentation** | Modern markdown | Professional styling |
| **Code Review** | PR-based workflow | Required reviews |
| **Automation** | Full CI/CD | Tests, analysis, releases |

## 🌐 Interactive Reference

The standards are also browsable as an interactive site (same architecture as laravel-13-cheat-sheet): searchable sidebar, dark/light mode, auto-generated table of contents, syntax-highlighted examples, mobile responsive.

```bash
npm install && npm run dev   # http://localhost:8090
```

Deployed via [deploy-pages.yml](.github/workflows/deploy-pages.yml) — gated behind the same lint checks this repo prescribes.

## 📚 Documentation

### Core Standards (Read First)

1. **[Branching Strategy](docs/BRANCHING_STRATEGY.md)** (15 min read)
   - Multi-tier branch model: main → development → feature/QA/UAT
   - When to create each branch type
   - Merge workflows for features and releases
   - Protection rules and best practices

2. **[Commit Standards](docs/COMMIT_STANDARDS.md)** (10 min read)
   - Semantic commit format: `<type>(<scope>): <subject>`
   - Types: feat, fix, docs, style, refactor, perf, test, chore, ci
   - Examples and common mistakes to avoid
   - Automated changelog generation

3. **[Release Standards](docs/RELEASE_STANDARDS.md)** (12 min read)
   - Semantic Versioning (MAJOR.MINOR.PATCH)
   - Release workflow from development → main
   - CHANGELOG.md format and updates
   - GitHub Release creation with auto-generated notes

4. **[Pull Request Process](docs/PULL_REQUEST_PROCESS.md)** (10 min read)
   - PR lifecycle, titles, and description requirements
   - Review standards for authors and reviewers
   - Merge strategies per target branch and size guidelines

### Quality & Gates

5. **[Code Quality](docs/CODE_QUALITY.md)** (12 min read)
   - The five-layer quality stack: lint → static analysis → unit → feature → e2e
   - Full-scope e2e coverage standard (Playwright)
   - Coverage floors and matrix testing

6. **[Linting Gates](docs/LINTING_GATES.md)** (10 min read)
   - Linting as a deployment gate — failing checks block deploys
   - Linter configs per stack with pragmatic rule guidance
   - Hard-won gotchas: BOM-free JSON, glob quoting, CDN globals

7. **[Quality Gates](docs/QUALITY_GATES.md)** (8 min read)
   - Four gates: pre-commit → PR merge → deploy → release
   - Branch protection configuration
   - Per-project adoption levels (L0–L3)

8. **[Testing](docs/TESTING.md)** (8 min read)
   - Running the 48-test Playwright suite (5 browser projects)
   - Coverage map and the all-docs sweep
   - CI gating: lint -> e2e -> deploy

### Architecture

9. **[Design Patterns](docs/DESIGN_PATTERNS.md)** (15 min read)
   - Use/don't-use decision table for each pattern
   - Repository, Service, Strategy, Events, Scopes, Value Objects, Pipeline
   - Frontend patterns from the interactive docs sites

10. **[API Standards](docs/API_STANDARDS.md)** (12 min read)
   - URL versioning, resource serialization, response envelopes
   - Pagination, filtering, rate limiting, CORS
   - Minimum API test coverage

11. **[Async Patterns](docs/ASYNC_PATTERNS.md)** (12 min read)
    - When to queue; job idempotency and failure handling
    - Scheduler and worker operations standards
    - Broadcasting channels and payload rules

12. **[Monorepo Structure](docs/MONOREPO_STRUCTURE.md)** (10 min read)
    - Workspaces, shared configs, path-filtered CI
    - Git submodule two-step workflow

### Operations

13. **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** (15 min read)
    - Gated pipelines: lint → test → deploy
    - GitHub Pages lessons, zero-downtime, expand/contract migrations
    - Health checks and rollback procedures

14. **[Security & Performance](docs/SECURITY_PERFORMANCE.md)** (12 min read)
    - Production security baseline: CSRF/XSS, auth, mass assignment, secrets
    - Performance baseline: N+1 prevention, caching, rate limiting

### Project Setup Standards

15. **[File Structure](docs/FILE_STRUCTURE.md)** (10 min read)
    - PHP/Laravel project layout
    - JavaScript/React project layout
    - TypeScript/Backend structure
    - Naming conventions and .gitignore patterns

16. **[Documentation Standards](docs/DOCUMENTATION_STANDARDS.md)** (12 min read)
    - Professional README with dynamic headers
    - CHANGELOG.md using "Keep a Changelog" format
    - Contributing guides and security policy
    - Code examples and markdown style

17. **[Implementation Checklist](docs/IMPLEMENTATION_CHECKLIST.md)** (8 min read)
    - Phase-by-phase adoption path for new projects
    - Minimum viable setup for small projects

### Tips & Tricks

18. **[Git Tips & Tricks](docs/GIT_TIPS_TRICKS.md)** (12 min read)
    - Reflog recovery, bisect, worktrees, rerere, autosquash
    - Precision staging with `add -p`, history archaeology
    - Config quality-of-life and Windows specifics

19. **[Actions Advanced](docs/ACTIONS_ADVANCED.md)** (15 min read)
    - Reusable workflows and composite actions
    - Caching, dynamic matrices, job outputs, concurrency
    - Security hardening (least-privilege tokens, OIDC, action pinning)

20. **[Nice to Know](docs/NICE_TO_KNOW.md)** (10 min read)
    - GitHub URL tricks, keyboard shortcuts, markdown extras
    - CODEOWNERS, repo templates, autolinks
    - `gh` CLI power usage and the API escape hatch

### Quick Reference

21. **[Quick Reference](QUICK_REFERENCE.md)** (5 min read)
    - Common git commands
    - Commit message examples
    - Release checklist
    - File structure checklist
    - Troubleshooting quick fixes

## 🔄 Branch Strategy

```
main (production)
  ↑
  └─ uat/* (user acceptance testing)
       ↑
       ├─ qa/* (quality assurance)
       │    ↑
       │    └─ feature/* (feature development)
       │
       └─ development (integration branch)
```

**Workflow:**
- Develop in `feature/*` branches
- Merge to `development` via PR
- Promote to `qa/*` for testing
- Promote to `uat/*` for business approval
- Merge to `main` and tag release

## 📝 Commit Format

```
<type>(<scope>): <subject>

<body explaining why>

Closes #123
```

**Example:**
```
feat(auth): add OAuth2 provider support

Implement OAuth2 authentication for Google and GitHub providers.
Includes token refresh and profile synchronization.

Closes #456
```

## 🏷️ Release Process

1. **Prepare:** Update version, CHANGELOG, commit changes
2. **QA:** Create `qa/*` branch, test and approve
3. **UAT:** Create `uat/*` branch, business approval
4. **Release:** Merge to `main`, create tag and GitHub Release
5. **Sync:** Merge back to `development`

**Release command:**
```bash
git tag -a v1.2.0 -m "Release v1.2.0"
gh release create v1.2.0 --generate-release-notes
```

## 📁 File Structure

Every project includes:

```
project/
├── .github/
│   ├── workflows/              # GitHub Actions
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── docs/
│   ├── BRANCHING_STRATEGY.md
│   ├── COMMIT_STANDARDS.md
│   ├── RELEASE_STANDARDS.md
│   ├── CHANGELOG.md
│   └── CONTRIBUTING.md
├── src/                        # Source code
├── tests/                      # Test files
├── README.md
├── LICENSE.md
└── SECURITY.md
```

## 🔄 GitHub Actions Workflows

### Provided Templates

- **lint-gate.yml** — Linting as a required, merge-blocking status check
- **tests.yml** — Multi-version testing (PHP/Node versions × Framework versions)
- **security-scan.yml** — Secret scanning (gitleaks) + dependency audits
- **deploy-pages.yml** — GitHub Pages deploy gated behind lint checks
- **deploy.yml** — App deploys: lint → test → deploy pipeline
- **release.yml** — Automated release tagging and GitHub Release creation
- **dependabot-auto-merge.yml** — Auto-merge security dependency updates
- **labeler.yml** — Auto-label PRs based on files changed
- **static-analysis.yml** — Code quality and style checks

All deploy templates share the **gating pattern**: quality checks are jobs the deploy `needs:` — failing lint or tests blocks the deploy entirely. See [Linting Gates](docs/LINTING_GATES.md) and the [templates README](templates/.github/workflows/README.md).

### Copy to Your Project

```bash
cp templates/.github/workflows/*.yml .github/workflows/
```

Then customize for your stack (PHP versions, Node versions, deploy targets, etc.)

## 📖 Documentation

All projects follow consistent documentation:

1. **README.md** — Modern header, quick start, features, installation
2. **docs/** folder — Detailed guides, architecture, troubleshooting
3. **.github/** folder — Issues, PRs, conduct, security policy
4. **CONTRIBUTING.md** — How to contribute, commit conventions, PR process
5. **CHANGELOG.md** — Keep a Changelog format, updated per release

### README Styling

- Dynamic header with capsule-render gradient animation
- Typing animations with readme-typing-svg
- Styled badges and shields
- Consistent color scheme
- Professional markdown formatting

## 🎯 Implementation Checklist

When starting a new project:

- [ ] Copy `.github/` directory with workflows and templates
- [ ] Copy `docs/` with all standards documents
- [ ] Create professional README with modern header
- [ ] Set up branch protection rules (main requires PR review)
- [ ] Configure GitHub secrets (if needed)
- [ ] Customize workflows for your stack
- [ ] Add CONTRIBUTING.md and CODE_OF_CONDUCT.md
- [ ] Create first release with version tag
- [ ] Document in repository About section with topics

## 🤝 Contributing to These Standards

These are living documents. To propose improvements:

1. Fork the repository
2. Create feature branch: `feature/improve-standards`
3. Make changes following the standards (recursive!)
4. Create PR with clear description
5. Get approval from maintainers
6. Merge and notify dependent projects

## 📞 Using These Standards

### In Your README.md

Link to standards:
```markdown
This project follows the [Thato GitHub Workflow Standards](https://github.com/thatobabusi/github-workflows).
```

### Copy to New Projects

```bash
# Clone or download this repo
git clone https://github.com/thatobabusi/github-workflows.git

# Copy standards to your project
cp -r github-workflows/docs/ your-project/
cp -r github-workflows/templates/.github/ your-project/
```

### Reference in Issues/PRs

When discussing standards, link to relevant docs:
- Branch questions → [BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md)
- Commit format → [COMMIT_STANDARDS.md](docs/COMMIT_STANDARDS.md)
- Release process → [RELEASE_STANDARDS.md](docs/RELEASE_STANDARDS.md)
- File structure → [FILE_STRUCTURE.md](docs/FILE_STRUCTURE.md)
- Documentation → [DOCUMENTATION_STANDARDS.md](docs/DOCUMENTATION_STANDARDS.md)

## 📊 Visual Workflow Diagrams

### Branching Strategy

```
main/master (Production)
     ↑
     │ PR after UAT approval
     │
  uat/* (User Acceptance Testing)
     ↑
     │ Promotion after QA
     │
  qa/* (Quality Assurance)
     ↑
     │ Integration
     │
development (Development Integration)
     ↑
     │ PR from feature
     │
feature/* (Feature Development)
     ↑
     └─ Always branch from main
```

### Release Promotion Pipeline

```
┌─────────────┐
│   Feature   │  Create from main
│  Development│
└──────┬──────┘
       │
       ↓ PR to development
┌─────────────┐
│    Dev      │  Integration testing
│ Integration │
└──────┬──────┘
       │
       ↓ Promotion to qa
┌─────────────┐
│     QA      │  Quality assurance
│   Testing   │  Bug fixes
└──────┬──────┘
       │
       ↓ Promotion to uat
┌─────────────┐
│     UAT     │  Business approval
│    Testing  │  Final validation
└──────┬──────┘
       │
       ↓ PR to main (after approval)
┌─────────────┐
│   RELEASE   │  Tag + GitHub Release
│   TO PROD   │  Deploy to production
└─────────────┘
```

### Commit Message Flow

```
feat(auth): add OAuth2 support
        │
        ↓
┌──────────────────────────────┐
│  Semantic Commit Format      │
│  <type>(<scope>): <subject>  │
│  - feat, fix, docs, test,    │
│    refactor, perf, chore, ci │
└──────────────────────────────┘
        │
        ↓
┌──────────────────────────────┐
│  Automated Changelog          │
│  - Features grouped           │
│  - Bug fixes grouped          │
│  - Breaking changes flagged   │
└──────────────────────────────┘
        │
        ↓
┌──────────────────────────────┐
│  GitHub Release Notes         │
│  Auto-generated from commits  │
└──────────────────────────────┘
```

### Testing Matrix

```
┌──────────────────────────────────────┐
│   Version Compatibility Matrix       │
├──────────────────────────────────────┤
│ Laravel  │   PHP Versions   │ Tests  │
├──────────┼──────────────────┼────────┤
│   8.*    │ 8.2, 8.3, 8.4, 8.5│  8   │
│   9.*    │ 8.2, 8.3, 8.4, 8.5│  8   │
│  10.*    │ 8.2, 8.3, 8.4, 8.5│  8   │
│  11.*    │ 8.2, 8.3, 8.4, 8.5│  8   │
└──────────────────────────────────────┘

Total: 32 test combinations (4 Laravel × 4 PHP × 2 OS)
Tested on: ubuntu-latest, windows-latest
```

### Branch Naming Convention

```
feature/YYYYMMDD-01-Feature-Name
│       │          │  │   │
│       │          │  │   └─ Descriptive name
│       │          │  └───── Counter (01, 02, 03)
│       │          └──────── Date created
│       └───────────────────── Type
└──────────────────────────── Prefix
```

### CI/CD Pipeline

```
┌─────────────┐
│   Push/PR   │
└──────┬──────┘
       │
       ├─ Tests (56+ combinations)
       ├─ Static Analysis
       ├─ Auto-labeling
       └─ Dependabot (security)
       │
       ↓
┌──────────────────┐
│ All Pass? ✅     │
└────────┬─────────┘
         │
    ┌────┴─────┐
    │           │
   YES         NO
    │           │
    ↓           ↓
  MERGE    REQUEST CHANGES
    │
    ↓
┌──────────────┐
│ Deploy Flow  │
│ (if enabled) │
└──────────────┘
```

## 📊 Key Features

✅ **Comprehensive** — Covers all aspects of GitHub workflow  
✅ **Reusable** — Templates and examples ready to copy  
✅ **Consistent** — Same standards across all projects  
✅ **Well-documented** — Detailed guides with examples and diagrams  
✅ **Modern** — Uses current best practices and tools  
✅ **Scalable** — Works for small and large projects  
✅ **Team-ready** — Facilitates collaboration  
✅ **Production-grade** — Proven in multiple projects  

## 🔗 Related Resources

- **GitHub Docs** — [Workflow best practices](https://docs.github.com/en/actions)
- **Keep a Changelog** — [Changelog format](https://keepachangelog.com/)
- **Conventional Commits** — [Commit specification](https://www.conventionalcommits.org/)
- **Semantic Versioning** — [Version specification](https://semver.org/)

## 📜 License

MIT License - Use freely in all projects

---

**Version:** 2.1.0  
**Last Updated:** 2026-07-15  
**Maintained by:** Thato Babusi

**Used in:** laravel-lastfm, laravel-installer, laravel-cloudways-deployment, and more

