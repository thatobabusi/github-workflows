# Bootstrap Essentials

Bootstrap 5: the utility-and-component toolkit for server-rendered apps — and honest guidance on when Tailwind is the better call.

## When Bootstrap

| Situation | Verdict |
|-----------|---------|
| Server-rendered app (Blade/Django/Rails), admin panels, internal tools | Yes — fastest path to decent UI |
| Team without a designer, needs consistent components now | Yes |
| Design-heavy product with a custom design system | Tailwind + component primitives |
| Existing AdminLTE/CoreUI codebase | You're already in Bootstrap — stay consistent |

Bootstrap 5 dropped jQuery — components are vanilla JS, data-attribute driven.

## Setup

```bash
npm i bootstrap @popperjs/core
```

```scss
// app.scss — customize via Sass variables BEFORE the import
$primary: #3b82f6;
$border-radius: .5rem;
$font-family-sans-serif: "Inter", system-ui, sans-serif;

@import "bootstrap/scss/bootstrap";
```

```js
// Only the JS you use
import { Modal, Dropdown, Toast } from 'bootstrap';
```

Customize with variables, not overrides — fighting compiled CSS with `!important` is the classic Bootstrap smell.

## The Grid

```html
<div class="container">
    <div class="row g-3">                        <!-- g-* = gutters -->
        <div class="col-12 col-md-6 col-lg-4">…</div>
        <div class="col-12 col-md-6 col-lg-8">…</div>
    </div>
</div>
```

Breakpoints: `sm` 576 · `md` 768 · `lg` 992 · `xl` 1200 · `xxl` 1400. Mobile-first: unprefixed = all sizes, prefixed = that size up. For non-grid layout, the flex utilities usually beat the grid: `d-flex justify-content-between align-items-center gap-2`.

## Utilities You'll Actually Use

```
Spacing:   m-3  p-2  px-4  py-1  mt-auto  gap-3      (0–5 scale)
Display:   d-none  d-md-block  d-flex  d-grid
Text:      fw-bold  text-muted  text-truncate  small
Color:     text-primary  bg-light  bg-danger-subtle  border
Sizing:    w-100  h-100  mw-100  min-vh-100
Position:  position-sticky  top-0  fixed-bottom
Shadow:    shadow-sm  shadow  rounded-3
```

Utilities-first, custom CSS second — if you're writing a class for margin, you've missed one.

## Components Worth Their Weight

```html
<!-- Modal — data attributes, zero JS written -->
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#confirm">
    Delete
</button>
<div class="modal fade" id="confirm" tabindex="-1">
    <div class="modal-dialog"><div class="modal-content">…</div></div>
</div>

<!-- Validation states pair with server-side errors (Blade example) -->
<input class="form-control @error('email') is-invalid @enderror" name="email">
@error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror

<!-- Toast for flash messages -->
<div class="toast align-items-center text-bg-success" role="alert">…</div>
```

The high-value set: forms + validation, modal, dropdown, toast, offcanvas, badge/alert. Skip: carousel (use a real library if you must), scrollspy (rarely worth it).

## Dark Mode (5.3+)

```html
<html data-bs-theme="dark">
```

Native theming via `data-bs-theme` — the same attribute-toggle pattern as [this site's theme system](../../../DOCUMENTATION_STANDARDS.md). Respect user choice: persist in localStorage, default from `prefers-color-scheme`.

## Accessibility Notes

Bootstrap's markup patterns are accessible **only if completed**:

- Icon-only buttons need `aria-label`
- `visually-hidden` class for screen-reader-only text (spinner states, "opens in new window")
- Modals/dropdowns manage focus for you — custom JS replacements must too
- Color utilities alone don't convey meaning — pair `text-danger` with an icon or text

## Bootstrap vs Tailwind (the honest paragraph)

Bootstrap ships decisions (components, sizes, colors) — fastest when you accept them, friction when you fight them. Tailwind ships primitives — every design is possible, every component is yours to build (or pull from shadcn/Preline). Server-rendered CRUD and admin tools: Bootstrap. Custom-designed products with a component culture: Tailwind. Don't mix them in one app.

## See Also

- [React](../javascript/react/REACT_ESSENTIALS.md) / [Vue](../javascript/vuejs/VUE_ESSENTIALS.md) — where Tailwind pairs instead
- [PHP Frameworks](../../backend/php/PHP_FRAMEWORKS.md) — Blade pairing
- [SEO Cheat Sheet](../../../seo/SEO_CHEAT_SHEET.md) — the markup this styles
