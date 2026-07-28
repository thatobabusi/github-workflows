# Quality Gates

The non-negotiable checkpoints between "code written" and "code in production." Each gate is automated; humans review, machines enforce.

## Gate Map

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Gate 1     │    │  Gate 2     │    │  Gate 3     │    │  Gate 4     │
│  Pre-commit │ ─▶ │  PR Merge   │ ─▶ │  Deploy     │ ─▶ │  Release    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
  local, fast        CI + review        CI gates          versioned
```

## Gate 1 — Pre-Commit (Local)

Run before every commit. Fast checks only (< 30 seconds):

- [ ] `npm run lint` / `composer lint` passes
- [ ] Affected tests pass
- [ ] No debug artifacts (`dd()`, `console.log`, `dump()`, commented-out blocks)
- [ ] No secrets in the diff

Lesson learned: **run the full lint suite locally before pushing.** Five sequential fix-commit-push-fail cycles on CI cost an hour; one local run costs a minute.

## Gate 2 — PR Merge

Enforced by branch protection. A PR cannot merge unless:

- [ ] **Lint check green** (required status check)
- [ ] **All tests green** — unit, feature, e2e (required status check)
- [ ] **Static analysis green** (PHPStan / tsc)
- [ ] **Coverage floor held** (80% apps, 90% packages)
- [ ] **Security scan clean** — no new vulnerable dependencies, no leaked secrets
- [ ] **Review approved** (1+ reviewer)
- [ ] **Branch up to date** with target
- [ ] Conversations resolved

Configure once per repo:

> Settings → Branches → Add rule for `main` and `development` → Require status checks: `Lint Code`, `Tests`, `Static Analysis`, `Security Scan` → Require pull request reviews → Require branches up to date

## Gate 3 — Deploy

The deploy workflow itself re-verifies (never trust that the branch state equals the PR state):

- [ ] Lint job passes (`needs: lint`)
- [ ] Test job passes (`needs: [lint, test]` on deploy job)
- [ ] Deploy job runs `if: success()` only
- [ ] Post-deploy health check returns 200

See [Linting Gates](LINTING_GATES.md) and [deploy.yml](../templates/.github/workflows/deploy.yml).

## Gate 4 — Release

Before tagging a version:

- [ ] All Gate 3 checks green on the release SHA
- [ ] CHANGELOG.md updated
- [ ] Version bumped in manifest (package.json / composer.json) — **check existing tags first**: `git tag -l`
- [ ] Tag matches manifest version exactly
- [ ] GitHub Release created with notes

Lesson learned: **verify the current version before bumping.** Bumping to an already-released version creates tag conflicts and merge noise. `git tag -l` takes two seconds.

## Failure Protocol

When a gate fails:

1. **Fix forward locally** — reproduce the failure with the same command CI runs
2. **Fix everything at once** — run the *entire* suite locally, fix all findings, single commit
3. **Never bypass** — no `--no-verify`, no admin-merge past red checks, no disabling the rule "temporarily"
4. If the rule itself is wrong (over-strict linter), change the config deliberately in its own commit with justification

## Per-Project Adoption Levels

| Level | Gates Active | Suitable For |
|-------|-------------|--------------|
| L0 | None | Throwaway spikes only |
| L1 | Gate 1 + lint in CI | Prototypes |
| L2 | + Gate 2 full | Active projects (default) |
| L3 | + Gate 3 + 4 | Anything deployed |

Every repo declares its level in the README. Default for new projects: **L2**, moving to **L3** at first deploy.

## See Also

- [Linting Gates](LINTING_GATES.md)
- [Code Quality](CODE_QUALITY.md)
- [Pull Request Process](PULL_REQUEST_PROCESS.md)
- [Release Standards](RELEASE_STANDARDS.md)
