# Technical SEO

Crawling, indexing, performance, and the infrastructure side of ranking.

## robots.txt

Lives at the domain root, controls **crawling** (not indexing):

```
User-agent: *
Disallow: /admin/
Disallow: /cart/
Allow: /

Sitemap: https://example.com/sitemap.xml
```

Gotchas:

- **robots.txt does not de-index.** Blocked pages can still appear in results (URL-only). To remove a page: allow crawling + `noindex` meta
- `Disallow: /` while launching = the classic self-inflicted invisibility; check it after every deploy of a new environment
- Case-sensitive paths; one file per subdomain

## XML Sitemaps

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/laravel-queue-jobs</loc>
    <lastmod>2026-07-15</lastmod>
  </url>
</urlset>
```

- Only canonical, indexable, 200-status URLs — no redirects, no noindexed pages
- ≤50,000 URLs / 50MB per file; use a sitemap index beyond that
- `lastmod` honest or absent — engines ignore it once they catch it lying
- Submit in Search Console + reference from robots.txt
- Laravel: generate via `spatie/laravel-sitemap` on a schedule

## Status Codes & Redirects

| Situation | Correct Response |
|-----------|------------------|
| Page moved permanently | **301** (passes equity) |
| Temporary move / A-B test | 302 |
| Page gone forever, no replacement | **410** (faster de-index than 404) |
| Page never existed | 404 with a useful error page |
| Server error | 500 — monitor these; sustained 5xx = de-indexing |

Redirect rules:

- No chains: A→B→C wastes crawl budget and equity — collapse to A→C
- Redirect to the **equivalent** page, not the homepage (that's a "soft 404")
- HTTP→HTTPS and www/non-www: one 301, site-wide, done once

## Core Web Vitals

| Metric | Measures | Good |
|--------|----------|------|
| **LCP** (Largest Contentful Paint) | Load speed | ≤2.5s |
| **INP** (Interaction to Next Paint) | Responsiveness | ≤200ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | ≤0.1 |

Highest-leverage fixes:

- LCP: compress/preload the hero image, server response <600ms, CDN
- INP: break up long JS tasks, defer non-critical scripts
- CLS: explicit `width`/`height` on images and embeds, no content injected above existing content, `font-display: swap`

```html
<link rel="preload" as="image" href="/hero.webp">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<script src="/analytics.js" defer></script>
```

Measure: PageSpeed Insights (field + lab), Search Console CWV report for real-user data.

## JavaScript Rendering

- Google renders JS, but late and with a budget — critical content and links should be in the **initial HTML**
- SPA? Use SSR/SSG (Nuxt, Next, Inertia SSR) for public pages; client-only rendering is fine behind login
- Never hide indexable content behind interaction (tabs are OK — display:none content is indexed; content *fetched* on click is not)
- Test: Search Console URL Inspection → "View crawled page" shows what Googlebot actually saw

## Crawl Budget Hygiene

Mostly a large-site concern (>100k URLs), but good hygiene everywhere:

- Kill infinite URL spaces: faceted filters, calendars, session IDs in URLs
- Canonicalize or block parameter variants
- Keep internal 404s/redirect-chains near zero
- Paginate with real links (`<a href="?page=2">`), not JS-only buttons

## HTTPS & Domains

- One canonical origin: `https://example.com` — 301 everything else (http, www) to it
- HSTS after HTTPS is stable
- Don't churn domains; age and history compound

## AI Crawlers

robots.txt now also gates AI visibility — decide deliberately, per bot:

```
User-agent: GPTBot
Allow: /

User-agent: CCBot
Disallow: /
```

Blocking everything by reflex also removes you from AI answers that cite sources; blocking nothing donates all content to training. Audit which AI user-agents you allow the same way you audit anything else in robots.txt.

## Monitoring Checklist

- [ ] Search Console: coverage errors, CWV, manual actions — check weekly
- [ ] Impressions + CTR per page: high impressions with weak CTR → rewrite that title/description
- [ ] `site:example.com` sanity check — is what's indexed what you expect?
- [ ] Uptime + 5xx alerting ([Deployment Guide](../DEPLOYMENT_GUIDE.md) health checks)
- [ ] Log 404s server-side; 301 the ones with inbound links
- [ ] Lighthouse CI in the pipeline for CWV regressions
- [ ] Expectation-setting: new content takes **4–6 months** to show impression growth — measure trends, not days ([the optimization loop](SEO_CONTENT_WRITING.md))

## See Also

- [SEO Cheat Sheet](SEO_CHEAT_SHEET.md)
- [Meta Tags Reference](SEO_META_TAGS.md)
- [Security & Performance](../SECURITY_PERFORMANCE.md)
