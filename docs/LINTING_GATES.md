# Linting Gates

Linting as a deployment gate: code that fails quality checks never reaches production. Proven pattern from the laravel-13-cheat-sheet deployment pipeline.

## The Principle

```
Push → Lint Job (GATE) → Test Job → Deploy Job
            │
            └─ FAILS → deployment blocked, fix required
```

Deployment **depends on** linting. No manual overrides, no "we'll fix it later."

## Workflow Structure

```yaml
jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run lint:html
      - run: npm run lint:css
      - run: npm run lint:js

  deploy:
    needs: lint          # ← the gate
    if: success()        # ← only if lint passed
    runs-on: ubuntu-latest
    steps:
      # ... deployment steps
```

## Linters Per Stack

### JavaScript / TypeScript
| Tool | Purpose | Config File |
|------|---------|-------------|
| ESLint | Code quality & style | `.eslintrc.json` |
| Prettier | Formatting | `.prettierrc` |
| TypeScript | Type checking | `tsconfig.json` (`tsc --noEmit`) |

### CSS
| Tool | Purpose | Config File |
|------|---------|-------------|
| StyleLint | CSS standards | `.stylelintrc.json` |

### HTML
| Tool | Purpose | Config File |
|------|---------|-------------|
| HTMLHint | Structure & validity | `.htmlhintrc` |

### PHP / Laravel
| Tool | Purpose | Config File |
|------|---------|-------------|
| Laravel Pint | Code style (PSR-12) | `pint.json` |
| PHPStan / Larastan | Static analysis | `phpstan.neon` |
| Rector | Automated refactoring | `rector.php` |

## npm Script Convention

Every project exposes the same script names, regardless of stack:

```json
{
  "scripts": {
    "lint": "npm run lint:html && npm run lint:css && npm run lint:js",
    "lint:html": "htmlhint index.html",
    "lint:css": "stylelint assets/**/*.css",
    "lint:js": "eslint assets/scripts.js"
  }
}
```

Composer equivalent for PHP projects:

```json
{
  "scripts": {
    "lint": ["@lint:style", "@lint:static"],
    "lint:style": "pint --test",
    "lint:static": "phpstan analyse"
  }
}
```

## Lessons Learned (Hard-Won)

These came from real deployment failures — encode them so they never repeat:

1. **Run the full lint suite locally before pushing.** Never push a config change hoping CI passes — one failed run wastes minutes; five failed runs waste an hour. `npm install && npm run lint` locally first.

2. **No BOM in JSON config files.** PowerShell's default `Set-Content`/`ConvertTo-Json` writes UTF-8 with BOM, which breaks StyleLint/cosmiconfig parsers with `Unexpected token ﻿ in JSON at position 0`. Write configs with BOM-less UTF-8:
   ```powershell
   [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]$false)
   ```

3. **Quote glob patterns carefully.** `stylelint 'assets/**/*.css'` works in bash but the single quotes become part of the pattern on Windows. Use unquoted globs in package.json scripts: `stylelint assets/**/*.css`.

4. **Pragmatic rules over dogmatic rules.** `stylelint-config-standard` demands modern color notation, kebab-case keyframes, and context media queries. Relax rules that fight your codebase instead of rewriting working CSS:
   ```json
   {
     "extends": "stylelint-config-standard",
     "rules": {
       "color-function-notation": "legacy",
       "alpha-value-notation": "number",
       "media-feature-range-notation": "prefix",
       "no-descending-specificity": null
     }
   }
   ```

5. **Declare third-party globals in ESLint.** CDN-loaded libraries (`hljs`, `Alpine`, etc.) trigger `no-undef`. Declare them:
   ```json
   { "globals": { "hljs": "readonly" } }
   ```

6. **`head-script-disabled` is a real rule.** HTMLHint blocks `<script>` in `<head>`. Move scripts to end of `<body>` — it's a performance win anyway.

7. **Fix everything in one commit.** Run all linters locally, fix every finding, commit once. Serial fix-push-fail-fix cycles pollute history and burn CI minutes.

## PR Integration

Add lint status as a required check:

1. Repo Settings → Branches → Branch protection rules
2. Protect `main` and `development`
3. Require status checks: `Lint Code`, `Tests`
4. Require branches to be up to date before merging

Now PRs physically cannot merge with failing lint.

## Rollout Checklist

- [ ] Add linter configs (`.eslintrc.json`, `.stylelintrc.json`, `.htmlhintrc` / `pint.json`, `phpstan.neon`)
- [ ] Add `lint` scripts to package.json / composer.json
- [ ] Run locally, fix all findings in one commit
- [ ] Add `lint` job to deploy workflow with `needs: lint` on deploy
- [ ] Add branch protection requiring the lint check
- [ ] Document any relaxed rules and why

## See Also

- [Code Quality Standards](CODE_QUALITY.md)
- [Quality Gates](QUALITY_GATES.md)
- [lint-gate.yml workflow](../templates/.github/workflows/lint-gate.yml)
