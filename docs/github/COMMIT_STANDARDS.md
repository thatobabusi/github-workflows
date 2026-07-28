# Commit Standards

Semantic commit messages that enable automated changelog generation, clear history, and effective communication.

## Semantic Commit Diagram

```
┌─────────────────────────────────────────────────────┐
│          SEMANTIC COMMIT WORKFLOW                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Developer writes semantic commits:                │
│  ├─ feat(auth): add OAuth2 support                 │
│  ├─ fix(payment): resolve race condition           │
│  ├─ test(api): add endpoint tests                  │
│  └─ docs(readme): update installation guide        │
│                                                     │
│  ↓                                                   │
│                                                     │
│  GitHub Actions Parse Commits                      │
│  ├─ Identify commit type                           │
│  ├─ Group by category                              │
│  └─ Generate release notes                         │
│                                                     │
│  ↓                                                   │
│                                                     │
│  Automated Changelog Generated                     │
│  ├─ Features (from feat commits)                   │
│  ├─ Bug Fixes (from fix commits)                   │
│  ├─ Performance (from perf commits)                │
│  └─ Breaking Changes (from BREAKING footer)        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Format

```
<type>(<scope>): <subject>
↓     ↓              ↓
│     │              └─ Lowercase, no period, <50 chars
│     └─ Feature area (auth, payment, api, etc)
└─ Commit type (feat, fix, test, docs, etc)

<blank line>

<body explaining WHY not WHAT>

<blank line>

<footer with issue references>
Closes #123
```

## Types

- **feat** — New feature
- **fix** — Bug fix  
- **docs** — Documentation only
- **style** — Formatting, no logic change
- **refactor** — Code restructure, no behavior change
- **perf** — Performance improvement
- **test** — Tests addition/update
- **chore** — Dependencies, build, tooling
- **ci** — CI/CD configuration
- **revert** — Revert previous commit

## Examples

### Feature
```
feat(auth): add OAuth2 provider support

Implement OAuth2 for Google and GitHub. Includes token refresh
and profile sync.

Closes #456
```

### Bug Fix
```
fix(payment): resolve race condition in transaction processing

Fixed concurrent payment attempts creating duplicates. Added
Redis locking for atomic processing.

Closes #789
```

### Documentation
```
docs(readme): add quickstart section

Added installation and basic usage examples.
```

### Refactor
```
refactor(user-model): extract permission logic to trait

No behavioral changes. Improves code reusability.
```

### Performance
```
perf(query): optimize user lookup by 40%

Replaced N+1 query with eager loading. Added index on user_id.
```

### Test
```
test(auth): add OAuth error handling tests

Added tests for network timeout, invalid response, rate limiting.
```

### Dependency Update
```
chore(deps): update Laravel 10.x to 11.x

Updated framework and resolved package compatibility.
All tests passing.
```

### CI/CD
```
ci(github): add PHP 8.3 to test matrix

Workflow now tests against PHP 8.1, 8.2, 8.3 and Laravel 10, 11.
```

## Guidelines

✅ **Do:**
- Use imperative mood ("add" not "adds")
- Lowercase first letter
- No period at end
- Keep subject under 50 characters
- Explain why in body, not what
- Reference issues: `Closes #123`
- Sign commits with GPG (recommended)
- Atomic commits (one concern per commit)

❌ **Don't:**
- Mix concerns in one commit
- Use vague messages ("fixed stuff")
- Add period at end of subject
- Write body without blank line separator
- Forget to reference related issues
- Commit before tests pass
- Make commits too large to review

## Automated Changelog

Semantic commits enable automated changelog generation:

**Generated sections:**
- Features (feat commits)
- Bug Fixes (fix commits)
- Performance (perf commits)
- Breaking Changes (BREAKING CHANGE footer)

## Breaking Changes

For breaking changes, include footer:

```
feat(api): change endpoint structure

BREAKING CHANGE: /api/users/<id> changed to /api/v2/user/<id>

See MIGRATION_GUIDE.md for migration steps.
```

## Git Configuration

### Use commit template
```bash
git config commit.template .gitmessage
```

### Sign commits
```bash
git config user.signingkey <key_id>
git config commit.gpgsign true
```

### Commitizen (interactive commits)
```bash
npm install -g commitizen cz-conventional-changelog
cz commit
```
