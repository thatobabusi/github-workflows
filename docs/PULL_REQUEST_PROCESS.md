# Pull Request Process

How code moves from a feature branch into `development` and onward. PRs are the unit of review, discussion, and history.

## PR Lifecycle

```
Draft → Ready for Review → Changes Requested ⇄ Re-review → Approved → Merged
```

## Opening a PR

### Before Opening

- [ ] Branch rebased on latest target (`development`)
- [ ] Full lint + test suite passes **locally**
- [ ] Self-review done — read your own diff first
- [ ] Commits follow [Commit Standards](COMMIT_STANDARDS.md)

### PR Title

Same semantic format as commits:

```
feat(auth): add OAuth2 provider support
fix(deploy): move CDN script out of head to satisfy lint gate
docs(api): document cursor pagination convention
```

The title becomes the squash-merge commit message — write it accordingly.

### PR Description

Use the [template](../.github/pull_request_template.md). Minimum contents:

- **What** changed and **why** (link the issue)
- **How to verify** — exact steps or commands
- Screenshots/recordings for any UI change
- Breaking changes and migration notes, if any

## Review Standards

### Reviewer Responsibilities

- Respond within one working day
- Review the *behavior*, not just the style (linters own style)
- Check: correctness, security implications, test coverage, naming, docs
- Approve only what you'd be comfortable maintaining

### Review Comments

- Prefix nitpicks: `nit: prefer early return here`
- Blocking concerns are explicit: `blocking: this exposes unhashed tokens in logs`
- Suggest, don't command — include a proposed alternative where possible

### Author Responsibilities

- Respond to every comment (fix, discuss, or explain)
- Push fixes as new commits during review (easier re-review); history is squashed at merge
- Re-request review after addressing feedback

## Merge Rules

| Target | Strategy | Rationale |
|--------|----------|-----------|
| `development` ← feature | **Squash merge** | One clean commit per feature |
| `qa/uat` ← development | Merge commit | Preserve feature boundaries |
| `main` ← uat/release | Merge commit | Auditable release history |

Enforced by branch protection ([Quality Gates — Gate 2](QUALITY_GATES.md)):

- Required checks green: `Lint Code`, `Tests`, `Static Analysis`, `Security Scan`
- 1+ approving review
- Branch up to date with target
- No force-pushes to protected branches, ever

## PR Size Guidelines

| Size | Lines Changed | Guidance |
|------|--------------|----------|
| S | < 100 | Ideal — fast review |
| M | 100–400 | Fine |
| L | 400–1000 | Split if possible; add a review guide in the description |
| XL | > 1000 | Split unless mechanical (renames, generated files, vendored docs) |

Bulk content additions (docs, fixtures, generated assets) are exempt but must be labeled and separated from logic changes.

## Draft PRs

Open as draft when:

- You want early architectural feedback
- CI validation is needed before review
- Work is blocked but visible progress helps coordination

Convert to ready only when the checklist in the template is complete.

## Special Cases

**Hotfixes:** PR into `main`, expedited review (any available reviewer), then back-merge to `development` immediately after merge.

**Dependabot PRs:** [dependabot-auto-merge.yml](../templates/.github/workflows/dependabot-auto-merge.yml) auto-merges patch/minor security updates once checks pass; major bumps require human review.

**Docs-only PRs:** Lint + link checks still required; test suite may be skipped via path filters.

## See Also

- [Branching Strategy](BRANCHING_STRATEGY.md)
- [Commit Standards](COMMIT_STANDARDS.md)
- [Quality Gates](QUALITY_GATES.md)
- [PR Template](../.github/pull_request_template.md)
