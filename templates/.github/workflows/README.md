# Workflow Templates

Reusable GitHub Actions templates. Copy into your project's `.github/workflows/` and customize the marked sections.

## Catalog

| Workflow | Purpose | Required For |
|----------|---------|--------------|
| [lint-gate.yml](lint-gate.yml) | Lint as required status check | Every project (Gate L1+) |
| [tests.yml](tests.yml) | Unit/feature matrix testing | Every project (Gate L2+) |
| [security-scan.yml](security-scan.yml) | Secret scan + dependency audit | Every project (Gate L2+) |
| [deploy-pages.yml](deploy-pages.yml) | GitHub Pages with lint gate | Static/docs sites |
| [deploy.yml](deploy.yml) | App deploy: lint → test → deploy | Deployed apps (Gate L3) |
| [release.yml](release.yml) | Tag push → GitHub Release | Versioned projects |

The repo's own `.github/workflows/` also carries copyable examples: `static-analysis.yml`, `dependabot-auto-merge.yml`, `labeler.yml`.

## The Gating Pattern

Every deploy workflow uses the same shape — quality checks are **jobs the deploy depends on**, not optional steps:

```yaml
jobs:
  lint:
    # ...
  test:
    needs: lint
    # ...
  deploy:
    needs: [lint, test]
    if: success()
    # ...
```

If lint or tests fail, the deploy job never starts. See [Linting Gates](../../../docs/LINTING_GATES.md) for the full doctrine and the gotchas (BOM-free JSON configs, glob quoting, pragmatic rule relaxation).

## Customization Checklist

When copying a template:

- [ ] Adjust `on.push.paths` to cover everything your build actually ships
- [ ] Pin runtime versions to what you support (Node 20/22, PHP 8.2–8.4)
- [ ] Replace placeholder deploy steps with your real mechanism
- [ ] Add required secrets in repo Settings → Secrets and variables
- [ ] Make the job names (`Lint Code`, `Tests`) required checks in branch protection

## Conventions

- Job names are stable identifiers — branch protection references them; renaming a job silently drops the protection
- `concurrency` groups on deploys prevent overlapping runs; `cancel-in-progress: false` for deploys, `true` is fine for PR checks
- Conditional jobs use `hashFiles()` guards so one template serves mixed-stack repos
