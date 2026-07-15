# Monorepo Structure

Standards for repos containing multiple packages, apps, or sites.

## When a Monorepo

**Yes:** tightly-coupled packages released together, shared tooling/configs, one team, atomic cross-package changes needed.

**No:** independent release cycles, different access controls, unrelated products. Separate repos with this standards repo as the shared base beat a forced monorepo.

## Layout

```
monorepo/
├── .github/
│   └── workflows/              # path-filtered pipelines per package
├── apps/
│   ├── web/                    # deployable applications
│   └── admin/
├── packages/
│   ├── ui/                     # shared internal packages
│   └── utils/
├── docs/
├── package.json                # workspace root — tooling only, no app deps
├── tsconfig.base.json          # shared config, packages extend it
├── .eslintrc.json              # root config, packages may extend
└── README.md                   # maps the territory
```

## Workspace Configuration

```json
// root package.json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "lint": "npm run lint --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "build": "npm run build --workspaces --if-present"
  }
}
```

Every workspace exposes the same script names (`lint`, `test`, `build`) so root commands fan out uniformly — same convention as [Linting Gates](LINTING_GATES.md).

## Shared Configs

- One source of truth at the root: `tsconfig.base.json`, `.eslintrc.json`, `.prettierrc`
- Packages **extend**, never copy:

```json
// packages/ui/tsconfig.json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "outDir": "dist" } }
```

- A rule change at the root applies everywhere in one PR — that's the point

## CI With Path Filters

Run only what changed:

```yaml
on:
  push:
    paths:
      - 'apps/web/**'
      - 'packages/**'          # shared code affects apps
      - 'package.json'
      - '.github/workflows/web.yml'
```

Rules:

- Each app gets its own deploy workflow, path-filtered
- Changes to `packages/**` trigger every dependent app's pipeline
- The lint gate still fronts every deploy job (`needs: lint`)

## Git Submodules (Alternative for Shared Content)

When content must live in its own repo but embed in another (win12 + win12-locales pattern):

```bash
# The two-step dance — ALWAYS in this order:
# 1. Commit & push inside the submodule
cd public/lang && git add . && git commit -m "..." && git push

# 2. Bump the pointer in the parent
cd ../.. && git add public/lang && git commit -m "chore: bump locales pointer"
```

CI must check out recursively or the submodule content is missing from builds:

```yaml
- uses: actions/checkout@v4
  with:
    submodules: recursive
```

Lessons learned:

- Forgetting `submodules: recursive` produces silent empty-directory builds
- Pointer bumps are real commits — a pushed submodule with an unbumped pointer deploys stale content
- Keep submodules rare: one per repo maximum; workspaces are almost always simpler

## Versioning Strategies

| Strategy | How | Use When |
|----------|-----|----------|
| **Fixed** | One version for everything, tag at root | Packages always ship together |
| **Independent** | Per-package versions via changesets | Packages consumed separately |

Default: fixed versioning until an external consumer forces independence.

## Dependency Rules

- Internal deps via workspace protocol: `"@repo/ui": "workspace:*"`
- No app imports from another app — shared code gets promoted to `packages/`
- Circular package dependencies are a build error, fix immediately
- Root `package.json` holds devDependencies for tooling only

## See Also

- [File Structure](FILE_STRUCTURE.md)
- [Linting Gates](LINTING_GATES.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
