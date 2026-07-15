# SEO Meta Tags Reference

Copy-paste reference for every meta tag that matters — and the ones that don't anymore.

## The Head That Ranks

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Page Title — Brand</title>
    <meta name="description" content="Compelling 155-char summary with the primary keyword.">
    <link rel="canonical" href="https://example.com/page">

    <!-- Robots (omit entirely for default index,follow) -->
    <meta name="robots" content="index, follow">
</head>
```

## Robots Directives

| Value | Effect |
|-------|--------|
| `index, follow` | Default — omit the tag entirely |
| `noindex` | Keep out of search results (still crawled) |
| `nofollow` | Don't pass equity through this page's links |
| `noindex, nofollow` | Private-ish pages (thank-you, internal search results) |
| `noarchive` | No cached copy |
| `max-snippet:160` | Cap snippet length |

```html
<!-- Per-engine targeting -->
<meta name="googlebot" content="noindex">

<!-- Header equivalent for non-HTML (PDFs etc.) -->
X-Robots-Tag: noindex
```

`noindex` in robots **meta** works only if the page is crawlable — don't also block it in robots.txt or the directive is never seen.

## Open Graph (Facebook, LinkedIn, WhatsApp, Slack…)

```html
<meta property="og:type" content="article">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Share-card description — can differ from meta description.">
<meta property="og:url" content="https://example.com/page">
<meta property="og:image" content="https://example.com/og/page-card.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="SiteName">
```

- Image: **1200×630**, under 1MB, absolute URL, text-light (crops vary)
- `og:type`: `website` for pages, `article` for posts (add `article:published_time`)

## Twitter / X Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Card description.">
<meta name="twitter:image" content="https://example.com/og/page-card.png">
```

Falls back to Open Graph when absent — set OG properly and Twitter tags become optional overrides.

## Structured Data (JSON-LD)

Google's preferred format — one script tag, no markup pollution:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Page Title",
  "datePublished": "2026-07-15",
  "dateModified": "2026-07-15",
  "author": { "@type": "Person", "name": "Thato Babusi" },
  "image": "https://example.com/og/page-card.png"
}
</script>
```

High-value types: `Article`, `Product` (price/availability/reviews → rich results), `FAQPage`, `HowTo`, `BreadcrumbList`, `Organization`, `SoftwareApplication`.

Validate with Google's Rich Results Test before shipping — broken structured data is worse than none.

## Canonical Rules

```html
<link rel="canonical" href="https://example.com/page">
```

- Self-referencing canonical on every indexable page (kills parameter/protocol/www duplicates)
- Cross-domain canonical when republishing content
- One canonical per page; absolute URLs only
- Canonical + `noindex` together sends mixed signals — pick one

## Internationalization

```html
<link rel="alternate" hreflang="en-za" href="https://example.com/za/page">
<link rel="alternate" hreflang="en-us" href="https://example.com/us/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">
```

Every hreflang set must be **reciprocal** (each page lists all variants including itself) and include `x-default`.

## Dead Tags — Stop Writing These

| Tag | Status |
|-----|--------|
| `<meta name="keywords">` | Ignored by every major engine since ~2009 |
| `<meta name="revisit-after">` | Never was a real thing |
| `<meta name="rating">` | Dead |
| `<meta name="distribution">` | Dead |

## Favicon & PWA Extras

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0f172a">
```

## See Also

- [SEO Cheat Sheet](SEO_CHEAT_SHEET.md)
- [Technical SEO](SEO_TECHNICAL.md)
