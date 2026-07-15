# SEO Cheat Sheet

On-page SEO essentials — the checklist for every public page. Companions: [Content Writing](SEO_CONTENT_WRITING.md) (keyword strategy, writing rules), [Meta Tags](SEO_META_TAGS.md), and [Technical SEO](SEO_TECHNICAL.md).

## The Non-Negotiables Per Page

| Element | Rule | Limit |
|---------|------|-------|
| `<title>` | Unique per page; pattern: `Primary Keyword — Secondary | Brand`, keyword near the front, no jargon or slogans | 55–60 chars |
| Meta description | Unique, keyword near the front, action verb ("learn", "build"), reads as ad copy for the SERP | 150–160 chars |
| `<h1>` | Exactly one, contains the target phrase, matches search intent | — |
| URL | Short, lowercase, hyphens, keyword slug — drop articles ("the", "a") and dates | 3–5 words |
| Canonical | Present on every page, self-referencing by default | — |

One more rule from the [content doc](SEO_CONTENT_WRITING.md) that governs everything here: **one target keyword phrase per page** — different phrases get different pages.

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
- **Phrase some h2s as the questions people actually search** ("How do queue retries work?") and answer in the first sentence below — that's the featured-snippet formula

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
- Descriptive anchor text using the *destination's* keywords: "see the [queue configuration guide]" — never "click here"
- Link related content both directions (hub ↔ spokes); see [pillar & cluster](SEO_CONTENT_WRITING.md)
- **New pages get links from established pages** — that's what gets them crawled and indexed fast
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

## Documents (PDFs & Downloads)

Files rank too, and compete with your own pages if you let them:

- Unique document title (in file metadata) that doesn't collide with an existing page's target
- Keywords in the filename: `solar-rebate-guide-2026.pdf`, not `final_v3.pdf`
- Only publish a document when it adds value a webpage doesn't already provide — otherwise it cannibalizes
- Prefer HTML over PDF for anything users should find via search

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

- [SEO Content Writing](SEO_CONTENT_WRITING.md) — keyword strategy, writing rules, measurement
- [Meta Tags Reference](SEO_META_TAGS.md)
- [Technical SEO](SEO_TECHNICAL.md)
- [Documentation Standards](../DOCUMENTATION_STANDARDS.md)
