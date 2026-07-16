# Nuxt Essentials

Full-stack Vue: the [Next.js](../nextjs/NEXTJS_ESSENTIALS.md) role in the Vue ecosystem — file routing, SSR/SSG, server routes, and auto-imports.

## When Nuxt

Same table as Next: public site where [SEO matters](../../../../seo/SEO_TECHNICAL.md) → yes; full-stack Vue in one deployable → yes; SPA behind login → plain Vite + [Vue](../vuejs/VUE_ESSENTIALS.md) is simpler.

## Project Anatomy

```
app/
├── pages/                 # file routing: pages/orders/[id].vue → /orders/42
├── layouts/default.vue
├── components/            # auto-imported by name
├── composables/           # auto-imported (useCart → composables/useCart.ts)
├── server/
│   ├── api/orders.get.ts  # server routes: method in the filename
│   └── middleware/
├── middleware/auth.ts     # route middleware (client+server navigation guard)
├── plugins/
└── nuxt.config.ts
```

Auto-imports (components, composables, Vue APIs) are the signature convenience — no import blocks, at the cost of explicitness. `nuxt.config.ts` can disable if the team prefers imports visible.

## Data Fetching — the One Rule

```vue
<script setup lang="ts">
// ✅ SSR-safe, deduped, hydrated once — THE way
const { data: orders, status, refresh } = await useFetch('/api/orders');

// ✅ Custom logic wrapper
const { data } = await useAsyncData('top-orders', () => $fetch('/api/orders?top=5'));

// ❌ onMounted + $fetch for page data = double-fetch or hydration mismatch
</script>
```

`useFetch` runs on the server during SSR, serializes into the payload, and does **not** re-run on the client. Plain `$fetch` inside event handlers (mutations) is correct; for page data it's the classic Nuxt mistake.

## Server Routes (Nitro)

```typescript
// server/api/orders.post.ts — the built-in backend
export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, createOrderSchema.parse);   // Zod at boundary
    const user = await requireUser(event);                                  // authorize inside
    return orderService.place(user, body);
});
```

Same rules as [Next Server Actions](../nextjs/NEXTJS_ESSENTIALS.md): validate + authorize inside every handler — these are public endpoints. Nitro deploys anywhere (Node, [containers](../../../docker/DOCKER_CHEAT_SHEET.md), edge) via build presets.

## Rendering Modes

```typescript
// nuxt.config.ts — per-route rendering rules
export default defineNuxtConfig({
    routeRules: {
        '/':          { prerender: true },              // SSG
        '/blog/**':   { isr: 3600 },                    // ISR, 1h
        '/dashboard/**': { ssr: false },                // SPA island
        '/api/**':    { cors: true },
    },
});
```

`routeRules` is Nuxt's cleanest win — one config block instead of per-page cache annotations.

## SEO Wiring

```vue
<script setup>
useSeoMeta({
    title: () => post.value.title,
    description: () => post.value.excerpt,
    ogImage: () => post.value.ogImage,
});
</script>
```

Plus `@nuxt/image` (the `next/image` equivalent), `nuxt/sitemap` and robots modules — the [meta tags reference](../../../../seo/SEO_META_TAGS.md) served framework-natively.

## State & Ecosystem

| Need | Answer |
|------|--------|
| Global client state | Pinia (`@pinia/nuxt`) — [Vue rules](../vuejs/VUE_ESSENTIALS.md) apply |
| Server state | `useFetch` covers most; TanStack Query for complex client caching |
| Auth | `nuxt-auth-utils` / sidebase-auth |
| Content sites | `@nuxt/content` — markdown with querying (this repo's docs-site pattern, productized) |
| UI | Nuxt UI / Tailwind |

## The Traps

| Trap | Fix |
|------|-----|
| Page data via `onMounted` | `useFetch`/`useAsyncData` |
| Hydration mismatch warnings | No `Date.now()`/random in SSR-rendered markup; `<ClientOnly>` for browser-only widgets |
| Secrets in `runtimeConfig.public` | Public config ships to the browser — server-only keys outside `public` |
| Unvalidated server routes | Zod-parse + authorize inside every handler |

## See Also

- [Vue Essentials](../vuejs/VUE_ESSENTIALS.md) — the component layer
- [Next.js Essentials](../nextjs/NEXTJS_ESSENTIALS.md) — the React twin
- [SEO docs](../../../../seo/SEO_CHEAT_SHEET.md)
