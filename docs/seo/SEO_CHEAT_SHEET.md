# SEO Cheat Sheet

On-page SEO essentials — the checklist for every public page. Companion references: [Meta Tags](SEO_META_TAGS.md) and [Technical SEO](SEO_TECHNICAL.md).

## The Non-Negotiables Per Page

| Element | Rule | Limit |
|---------|------|-------|
| `<title>` | Unique per page, primary keyword near the front | ~60 chars |
| Meta description | Unique, compelling, includes keyword — it's ad copy for the SERP | ~155 chars |
| `<h1>` | Exactly one, matches search intent | — |
| URL | Short, lowercase, hyphens, keyword included | 3–5 words |
| Canonical | Present on every page, self-referencing by default | — |

```html
<title>Laravel Queue Jobs — Complete Guide | SiteName</title>
<meta name="description" content="Learn Laravel queue jobs: drivers, retries, batching, and production worker setup with copy-paste examples.">
<link rel="canonical" href="https://example.com/laravel-queue-jobs">
```

## Heading Hierarchy

```html
<h1>One per page — the topic</h1>
  <h2>Major sections</h2>
    <h3>Subsections</h3>
```

- Never skip levels (h1 → h3) or pick tags for their font size — that's CSS's job
- Headings should read as an outline of the page: a scanner should get the story from headings alone
- Include secondary keywords in h2s naturally — never stuff

## URL Structure

```
✅ example.com/laravel-queue-jobs
✅ example.com/blog/seo-checklist
❌ example.com/index.php?p=482&cat=7
❌ example.com/Laravel_Queue_Jobs_COMPLETE_Guide_2026_FINAL
```

- Lowercase, hyphens (never underscores), no dates unless content is date-bound
- Keep hierarchy shallow: ≤3 path segments
- Changing a URL requires a **301 redirect** from the old one — always

## Links

### Internal
- Every page reachable within 3 clicks of home
- Descriptive anchor text: "see the [queue configuration guide]" — never "click here"
- Link related content both directions (hub ↔ spokes)
- Fix broken internal links — crawl budget and users both suffer

### External
- Link out to authoritative sources — it builds topical trust
- `rel="nofollow"` for paid/untrusted links, `rel="sponsored"` for sponsorships, `rel="ugc"` for user content
- External links open same-tab by default; `target="_blank"` requires `rel="noopener"`

## Images

```html
<img src="queue-flow-diagram.webp"
     alt="Laravel queue job lifecycle from dispatch to completion"
     width="800" height="450" loading="lazy">
```

- **`alt` describes the image content** — for screen readers first, crawlers second; empty `alt=""` for pure decoration
- Descriptive filenames: `queue-flow-diagram.webp`, not `IMG_4823.png`
- Modern formats (WebP/AVIF), explicit dimensions (prevents layout shift), `loading="lazy"` below the fold

## Content Rules

- **One page, one intent.** A page targeting "install laravel" and "laravel deployment" ranks for neither — split it
- **Match the intent type:** informational → guide, transactional → product/landing, navigational → clear brand page
- Front-load the answer: the first paragraph answers the query, the rest earns depth
- Freshness matters where recency matters: update and re-date content that claims currency
- Duplicate content: one canonical version, 301 or `rel=canonical` everything else

## E-E-A-T Signals

- Author byline with a real bio for expertise-sensitive topics
- Cite sources; show dates (published + updated)
- About and contact pages that actually identify who's behind the site
- HTTPS everywhere — non-negotiable since forever

## Quick Audit — Any Page in 60 Seconds

1. View source: exactly one `<title>`, one meta description, one `<h1>`, a canonical
2. Heading outline sensible? (browser devtools or an outliner extension)
3. All images have `alt`?
4. URL clean and readable?
5. `curl -I` the page: 200 status, no redirect chains?
6. Mobile viewport meta present? Page usable at 375px?
7. Lighthouse SEO score ≥ 90?

## See Also

- [Meta Tags Reference](SEO_META_TAGS.md)
- [Technical SEO](SEO_TECHNICAL.md)
- [Documentation Standards](../DOCUMENTATION_STANDARDS.md)
