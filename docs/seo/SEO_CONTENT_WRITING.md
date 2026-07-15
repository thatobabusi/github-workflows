# SEO Content Writing

Keyword strategy, writing rules, and the optimization loop — synthesized from Siteimprove, Orbit Media, Semrush, Bynder, energy.gov, and Michigan Tech's published best practices.

## Keyword Research & Intent

1. **One keyword phrase per page.** Different target phrases get separate pages — a page chasing two intents ranks for neither
2. Classify intent before writing and match the format:

| Intent | Searcher Wants | Page Type |
|--------|----------------|-----------|
| Informational | An answer | Guide, tutorial, reference |
| Commercial | To compare | Comparison, review, "best X" |
| Transactional | To act/buy | Product, pricing, signup |
| Navigational | A specific place | Clear brand/landing page |

3. **Pick winnable keywords:** target difficulty at or below your site's authority; long-tail phrases (3–5 words) convert better and rank sooner than head terms
4. Mine the SERP itself: manually review what ranks, harvest *People Also Ask* questions, note the format Google rewards
5. Competitor gap analysis: what do they rank for that you don't cover at all?

Tools: Google Keyword Planner, Search Console (what you *almost* rank for), Semrush/Ahrefs, AnswerThePublic.

## Keyword Placement Map

Once per element unless noted — natural phrasing always beats exact-match density:

| Location | Guideline |
|----------|-----------|
| `<title>` | Once, near the front |
| URL slug | The phrase, hyphenated |
| `<h1>` | Once |
| First paragraph | Once — front-load the answer |
| H2/H3 subheadings | Where natural; phrase some as questions |
| Body | 2–4 more times across the page (varies with length) |
| Closing paragraph | Once |
| Image alt/filename/caption | Where the image genuinely relates |
| Meta description | Once, near the front, with an action verb |

Density and exact matches matter far less than comprehensive, credible coverage — the placement map is a floor, not a formula. Stuffing reads robotic and gets filtered.

## Writing Rules

- **Humans first, optimization second.** Write the useful thing, then check the placement map
- **Answer immediately after each heading** — the question a heading raises gets its answer in the next sentence (this is also how you win featured snippets)
- Paragraphs ≤3 sentences; each paragraph readable standalone
- Reading level: 7th–9th grade (Flesch-Kincaid) for general audiences — plain language is a ranking asset, not dumbing down
- Bullets, tables, and bolding for scannability — moderately, not decoratively
- Conversational rhythm: contractions, natural phrasing, read it aloud — this is what voice/conversational search matches
- Descriptive link text with the destination's keywords — never "click here"
- Every claim cited; every guide actionable

## Comprehensive Beats Long

Cover the topic from every angle a searcher might arrive from: the question, its follow-ups, objections, edge cases, and next steps. Include:

- Original insight, first-hand experience, or your own data (E-E-A-T's first E)
- Visuals that carry information (diagrams > decoration) — they earn backlinks too
- Video? Include a transcript — engines can't watch
- Keyword *variations* and related terms — semantic breadth signals topical authority

## Topical Authority (Pillar & Cluster)

```
        Pillar: /guide/seo (broad overview)
        ├── /guide/seo/keyword-research
        ├── /guide/seo/on-page
        ├── /guide/seo/link-building
        └── /guide/seo/technical
```

- One **pillar page** owns the broad term; **cluster pages** each own one subtopic long-tail
- Dense internal links: pillar ↔ every cluster, clusters ↔ related clusters
- New page? Link to it from established pages — it gets crawled and indexed faster
- News/blog posts link back to evergreen pages, feeding them authority

## Earning Links

Priority order (quality over quantity, always):

1. **Linkable assets** — original research, data, tools, definitive guides: things worth citing
2. **Skyscraper** — find widely-linked content, publish the clearly better version, tell its linkers
3. **Broken link building** — find dead resources others link to; offer yours as the replacement
4. **Unlinked mentions** — monitor brand mentions, ask for the link
5. Guest posts on genuinely reputable industry sites

Avoid: reciprocal link schemes, paid links without `rel="sponsored"`, anything at scale that feels automatable.

## Measurement

| Signal | Tool | Watch For |
|--------|------|-----------|
| Impressions & CTR | Search Console | Pages with impressions but weak CTR → rewrite title/description |
| Rankings | GSC / rank tracker | Page-two keywords → highest-leverage optimization targets |
| Engagement | GA4 | Time on page, scroll depth, pages/session |
| Conversions | GA4 events | Macro (signup, purchase) and micro (newsletter, download) |

Set expectations honestly: **4–6 months** before new content shows meaningful impression growth. SEO is compounding, not instant.

## The Optimization Loop

Quarterly (or per release cycle):

1. **Audit** — outdated facts, broken links, redundant pages competing for one term
2. **Refresh** — update stats/examples on high-value pages, bump `dateModified` (honestly)
3. **Promote page-two content** — pages ranking 11–20 are one improvement from traffic; prioritize them over new content
4. **Consolidate** — two weak pages on one topic → one strong page + 301
5. Feed in real questions from support, sales, and comments — that's free keyword research

## AI & Zero-Click Reality

- Answer-shaped content (question heading → immediate answer → depth) wins featured snippets, voice answers, and AI citations alike
- Most AI-engine mentions come from third-party coverage — the link-earning work above now feeds AI visibility too
- Check robots.txt isn't unintentionally blocking AI crawlers you *want* citing you (and deliberately block the ones you don't)

## See Also

- [SEO Cheat Sheet](SEO_CHEAT_SHEET.md) — the per-page checklist
- [Meta Tags Reference](SEO_META_TAGS.md)
- [Technical SEO](SEO_TECHNICAL.md)
