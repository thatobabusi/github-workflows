# HTML Cheat Sheet

Semantic, accessible HTML — the layer everything else stands on. Most "CSS problems" and half of all [SEO problems](../../../seo/SEO_CHEAT_SHEET.md) are HTML problems.

## Document Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title — Brand</title>
    <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
    <!-- content -->
    <script src="assets/scripts.js"></script>   <!-- end of body, always -->
</body>
</html>
```

`lang` set (screen readers + translation), charset first, viewport always, scripts at the end ([the lint rule](../../../LINTING_GATES.md) `head-script-disabled` enforces it).

## Semantic Layout — div Is the Last Resort

```html
<body>
    <header>          <!-- site banner: logo, nav -->
        <nav aria-label="Main">…</nav>
    </header>
    <main>            <!-- exactly ONE per page -->
        <article>     <!-- self-contained: post, product, card -->
            <h1>One h1 per page</h1>
            <section>            <!-- thematic grouping WITH a heading -->
                <h2>Section</h2>
            </section>
            <aside>…</aside>     <!-- tangential: related links, ads -->
            <footer>…</footer>   <!-- article footer: byline, tags -->
        </article>
    </main>
    <footer>…</footer>
</body>
```

Landmarks give screen-reader users a page map and crawlers structure for free. Heading hierarchy = document outline: never skip levels, never pick a tag for its size ([SEO heading rules](../../../seo/SEO_CHEAT_SHEET.md)).

## Text Semantics Worth Knowing

| Element | Means | Not to be confused with |
|---------|-------|------------------------|
| `<strong>` / `<em>` | Importance / stress | `<b>`/`<i>` (visual only) |
| `<time datetime="2026-07-16">` | Machine-readable date | plain text dates |
| `<abbr title="…">` | Abbreviation | — |
| `<figure>` + `<figcaption>` | Captioned media/code | bare `<img>` + `<p>` |
| `<blockquote cite="…">` | Quoted block | indent-for-style |
| `<dl>/<dt>/<dd>` | Key-value pairs | abused `<ul>` |
| `<details>/<summary>` | Native disclosure widget | JS accordions |
| `<dialog>` | Native modal (`showModal()`) | div-soup modals |

## Forms — Where Accessibility Is Won or Lost

```html
<form method="post" action="/subscribe">
    <label for="email">Email</label>
    <input type="email" id="email" name="email"
           required autocomplete="email" inputmode="email"
           aria-describedby="email-hint">
    <p id="email-hint">We never share your address.</p>

    <fieldset>
        <legend>Plan</legend>
        <label><input type="radio" name="plan" value="monthly" checked> Monthly</label>
        <label><input type="radio" name="plan" value="yearly"> Yearly</label>
    </fieldset>

    <button type="submit">Subscribe</button>
</form>
```

- **Every input gets a real `<label>`** — placeholder is not a label
- Right `type=` (email/tel/url/number/date) buys mobile keyboards and free validation
- `autocomplete` tokens = faster forms and password-manager compatibility
- `<button>` for actions, `<a>` for navigation — never a styled div for either

## Images & Media

```html
<img src="hero-800.webp"
     srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w"
     sizes="(max-width: 600px) 100vw, 800px"
     alt="Dashboard showing the deploy pipeline stages"
     width="800" height="450" loading="lazy" decoding="async">
```

`alt` describes content (empty `alt=""` for decoration), explicit dimensions prevent layout shift, `loading="lazy"` below the fold — the [Core Web Vitals rules](../../../seo/SEO_TECHNICAL.md) in attribute form.

## Accessibility Baseline (before ARIA)

1. **Use the native element** — `<button>`, `<details>`, `<dialog>` ship keyboard + focus + semantics free. *First rule of ARIA: don't use ARIA when HTML can do it*
2. Interactive targets reachable and operable by keyboard alone (tab through your page)
3. Focus visible — style `:focus-visible`, never `outline: none` bare
4. ARIA for what HTML can't say: `aria-label` on icon-only buttons, `aria-expanded` on toggles, `aria-live="polite"` for async updates
5. Color contrast ≥ 4.5:1 body text; meaning never by color alone

## Validation

`npx html-validate index.html` or W3C validator — HTMLHint runs in the [lint gate](../../../LINTING_GATES.md); Lighthouse's accessibility audit catches the rest.

## See Also

- [SEO Cheat Sheet](../../../seo/SEO_CHEAT_SHEET.md) — the same markup, ranking-side
- [Bootstrap Essentials](../bootstrap/BOOTSTRAP_ESSENTIALS.md)
- [AJAX & Fetch](../ajax/AJAX_FETCH_CHEAT_SHEET.md)
