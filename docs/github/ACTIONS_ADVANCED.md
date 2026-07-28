# GitHub Actions — Advanced Usage

Beyond the basic templates: reuse, speed, and control for CI/CD pipelines.

## Reusable Workflows

Define once in this repo, call from every project — changes propagate centrally:

```yaml
# In github-workflows: .github/workflows/reusable-lint.yml
name: Reusable Lint
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '22'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci && npm run lint
```

```yaml
# In any project:
jobs:
  lint:
    uses: thatobabusi/github-workflows/.github/workflows/reusable-lint.yml@main
    with:
      node-version: '22'
```

Reusable workflows vs copied templates: templates drift per-project; `workflow_call` gives one source of truth. Pin to a tag (`@v2.1.1`) for stability instead of `@main`.

## Composite Actions

Bundle repeated *steps* (vs whole jobs) into one action:

```yaml
# .github/actions/setup-project/action.yml
name: Setup Project
runs:
  using: composite
  steps:
    - uses: actions/setup-node@v7
      with:
        node-version: '22'
        cache: npm
    - run: npm ci
      shell: bash
```

```yaml
# Usage in any workflow of the same repo:
- uses: actions/checkout@v7
- uses: ./.github/actions/setup-project
```

## Caching Strategies

### Dependency caches (built into setup actions)

```yaml
- uses: actions/setup-node@v7
  with:
    cache: npm            # caches ~/.npm keyed on package-lock.json
```

### Custom caches

```yaml
- uses: actions/cache@v6
  with:
    path: vendor
    key: composer-${{ runner.os }}-${{ hashFiles('composer.lock') }}
    restore-keys: composer-${{ runner.os }}-    # partial-match fallback
```

Rules of thumb:

- Key on the **lockfile hash**, never the manifest
- Always provide `restore-keys` — a stale cache + incremental install beats a cold start
- Caches are branch-scoped with fallback to the default branch: seed caches from `main`

## Matrix Mastery

```yaml
strategy:
  fail-fast: false                 # let all combos finish; see every failure
  matrix:
    php: ['8.2', '8.3', '8.4']
    laravel: ['11.*', '12.*']
    include:                       # add one-off combos with extra vars
      - php: '8.4'
        laravel: '12.*'
        coverage: true
    exclude:
      - php: '8.2'
        laravel: '12.*'
```

### Dynamic matrices

Generate the matrix at runtime (e.g. changed packages in a monorepo):

```yaml
jobs:
  plan:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set.outputs.matrix }}
    steps:
      - id: set
        run: echo "matrix=$(node scripts/changed-packages.js)" >> "$GITHUB_OUTPUT"

  test:
    needs: plan
    strategy:
      matrix: ${{ fromJson(needs.plan.outputs.matrix) }}
```

## Job Orchestration

### Outputs between jobs

```yaml
jobs:
  build:
    outputs:
      version: ${{ steps.meta.outputs.version }}
    steps:
      - id: meta
        run: echo "version=$(node -p "require('./package.json').version")" >> "$GITHUB_OUTPUT"

  deploy:
    needs: build
    steps:
      - run: echo "Deploying v${{ needs.build.outputs.version }}"
```

### Artifacts between jobs

```yaml
- uses: actions/upload-artifact@v7
  with: { name: dist, path: dist/ }

# later job:
- uses: actions/download-artifact@v7
  with: { name: dist, path: dist/ }
```

### Concurrency control

```yaml
# Cancel superseded PR runs (saves minutes):
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

# Serialize deploys (never cancel a mid-flight deploy):
concurrency:
  group: deploy-production
  cancel-in-progress: false
```

## Conditions Worth Knowing

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
if: startsWith(github.ref, 'refs/tags/v')
if: contains(github.event.head_commit.message, '[deploy]')
if: github.actor != 'dependabot[bot]'
if: always()      # run even after failures (cleanup, reports)
if: failure()     # run only after a failure (notifications)
```

Skip a whole run from the commit message: `[skip ci]` in the subject.

## Environments & Protection

```yaml
jobs:
  deploy:
    environment:
      name: production
      url: https://example.com
```

Environments give you: required reviewers before the job runs, environment-scoped secrets, wait timers, and a deployment history per environment — configure under Settings → Environments.

## Security Hardening

- **Least-privilege token per workflow:**

```yaml
permissions:
  contents: read        # default everything else to none
```

- **Never `pull_request_target` with checkout of PR code** — that combination hands your secrets to fork PRs
- **Pin third-party actions** to a major (`@v3`) minimum; pin to a full SHA for anything security-critical
- **OIDC over long-lived cloud keys:** `id-token: write` + the cloud provider's official auth action mints short-lived credentials — no stored AWS/GCP secrets

## Debugging Workflows

```yaml
# Step-level debug: re-run with "Enable debug logging" checked, or set secrets:
# ACTIONS_STEP_DEBUG=true, ACTIONS_RUNNER_DEBUG=true

- name: Dump context
  run: echo '${{ toJSON(github) }}'
```

```bash
# From the CLI:
gh run view <id> --log-failed        # only the failing steps' logs
gh run rerun <id> --failed           # re-run just failed jobs
gh run watch <id> --exit-status      # block until done, exit non-zero on failure
```

## See Also

- [Linting Gates](LINTING_GATES.md)
- [Quality Gates](QUALITY_GATES.md)
- [Nice to Know](NICE_TO_KNOW.md)
- [Workflow templates](../templates/.github/workflows/README.md)
