# Testing This Repo

The interactive standards site ships with a Playwright e2e suite — 48 tests covering the full frontend scope, run as a **deploy gate** in CI. This doc covers running it, what it verifies, and how to extend it.

## Running the Suite

```bash
npm install
npx playwright install chromium     # first time only

npm run test:e2e:chromium   # fast: chromium only (what CI runs)
npm run test:e2e            # full matrix: chromium, firefox, webkit, 2 mobile
npm run test:e2e:ui         # interactive UI mode for debugging
npm run test:e2e:headed     # watch the browser while tests run
```

Playwright starts its own server (`python -m http.server 8090`) via the `webServer` block in [playwright.config.ts](../playwright.config.ts) — no manual setup.

## What's Covered

| Suite | Verifies |
|-------|----------|
| Header & Navigation | Title, sticky header, search placeholder, theme toggle presence |
| Light/Dark Mode | Dark default, toggle both ways, icon swap, localStorage persistence |
| Sidebar Navigation | 6 sections, **all collapsed by default**, expand/collapse toggling, doc loading, active-link highlighting |
| Category Cards | 6 home cards, doc counts sum to total, category → file navigation |
| Content & Markdown | Headings, code blocks with language labels, tables, lists, inline code, internal `data-doc` links, TOC generation |
| Search | Filtering, result navigation, clear-to-home, empty state |
| Navigation Controls | Back buttons per view, brand-click home |
| Responsive | Mobile/tablet/desktop viewports, TOC sidebar hidden below 1200px |
| Accessibility | Ctrl+K search focus, heading hierarchy, aria-label on scroll-to-top |
| Scroll to Top | Hidden at top, appears after 300px, scrolls back, hides again |
| Error Handling | Zero `pageerror` events during navigation, rapid-navigation stability |
| Full Workflows | Search → view → back → browse journey; **all-docs sweep**: opens every doc in every category, asserts no doc renders the error box |

The all-docs sweep is the safety net: adding a doc to `assets/scripts.js` with a wrong path or filename fails CI before it ships. (It asserts on the `.error-box` element, not error text — docs are allowed to quote error strings.)

## CI Gating

The Pages pipeline in [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml) runs:

```
Lint Code ──▶ E2E Tests ──▶ Deploy to GitHub Pages
```

`deploy` declares `needs: [lint, e2e]` — a failing test blocks the deploy entirely ([Quality Gates](QUALITY_GATES.md), Gate 3). CI runs chromium only for speed; the full browser matrix is for local runs.

## Conventions for New Tests

- **Go through the real user path.** Sidebar sections start collapsed — use the `expandSection()` / `openDoc()` helpers rather than clicking hidden links.
- **`.first()` on `#fileContent h1`.** Docs may legitimately contain multiple H1s (e.g. heading-syntax examples in Documentation Standards); bare `h1` locators trip Playwright's strict mode.
- **Sidebar names ≠ doc titles.** "Actions Advanced" renders "GitHub Actions — Advanced Usage". Assert against a name → heading map, not the link text.
- **Update the constants when content changes.** `TOTAL_DOCS` and `CATEGORIES` at the top of [standards.spec.ts](../tests/e2e/standards.spec.ts) must track `assets/scripts.js` — the count tests exist precisely to catch drift.
- **Prefer `expect(...).toHaveClass(/active/)`** over timeouts — the app switches views synchronously; Playwright's auto-waiting handles the rest.

## Origin

Ported from the laravel-13-cheat-sheet suite (17 → 50+ test expansion) and adapted: dark-default theme, collapsed sidebar, table/TOC/internal-link rendering, and the all-docs sweep are additions specific to this site. General testing standards live in [Code Quality](CODE_QUALITY.md).

## See Also

- [Code Quality](CODE_QUALITY.md)
- [Quality Gates](QUALITY_GATES.md)
- [Linting Gates](LINTING_GATES.md)
