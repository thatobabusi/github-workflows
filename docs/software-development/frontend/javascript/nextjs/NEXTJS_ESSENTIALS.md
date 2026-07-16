# Next.js Essentials

Full-stack React: App Router, Server Components, and the rendering decisions that define the framework.

## When Next.js

| Situation | Verdict |
|-----------|---------|
| Public site where SEO matters ([Technical SEO](../../../../seo/SEO_TECHNICAL.md)) | Yes — SSR/SSG built in |
| Full-stack React with one deployable | Yes |
| Pure SPA behind login | Vite + [React](../react/REACT_ESSENTIALS.md) is simpler |
| API consumed by mobile too | Separate [Node API](../../../backend/node/NODE_ESSENTIALS.md); Next as one client |

## App Router Layout

```
app/
├── layout.tsx               # root layout (html/body, providers)
├── page.tsx                 # /
├── orders/
│   ├── layout.tsx           # nested layout
│   ├── page.tsx             # /orders — server component
│   ├── loading.tsx          # streaming fallback
│   ├── error.tsx            # error boundary
│   └── [id]/
│       └── page.tsx         # /orders/42
├── api/
│   └── webhooks/route.ts    # route handlers (GET/POST exports)
└── globals.css
```

File conventions do the routing; layouts nest and persist across navigation.

## The Server/Client Component Split

**Everything is a Server Component until it needs interactivity.**

```tsx
// app/orders/page.tsx — SERVER component: async, touches the DB directly
export default async function OrdersPage() {
    const orders = await db.orders.findMany({ where: { status: 'pending' } });
    return <OrderTable orders={orders} />;
}
```

```tsx
// components/CancelButton.tsx — CLIENT island: interactivity only
'use client';

export function CancelButton({ id }: { id: number }) {
    const [pending, setPending] = useState(false);
    // onClick handlers, hooks — client-only capabilities
}
```

Rules:

- `'use client'` marks the **boundary** — everything it imports becomes client bundle. Push the directive to the leaves
- Server Components: data access, secrets, heavy deps (zero JS shipped)
- Client Components: `useState`/`useEffect`, event handlers, browser APIs
- Never import server-only code into client files (`import 'server-only'` guard catches it)

## Data: Fetch, Cache, Mutate

```tsx
// Fetching with explicit cache posture
const res = await fetch(api('/rates'), { next: { revalidate: 3600 } }); // ISR: 1h
const res = await fetch(api('/profile'), { cache: 'no-store' });        // dynamic

// Mutations: Server Actions — no API route needed
'use server';
export async function cancelOrder(id: number) {
    await assertCurrentUserOwns(id);          // authorize INSIDE the action
    await db.orders.update({ where: { id }, data: { status: 'cancelled' } });
    revalidatePath('/orders');                // bust the cache
}
```

- Every fetch declares its caching intent — the defaults have shifted across versions; explicit beats surprised
- Server Actions are public endpoints in disguise: **validate and authorize inside every action** ([Security](../../../../SECURITY_PERFORMANCE.md))
- After mutation: `revalidatePath`/`revalidateTag` — stale cache is the classic Next bug

## Rendering Modes

| Mode | How | For |
|------|-----|-----|
| Static (SSG) | Default when no dynamic data | Marketing, docs |
| ISR | `revalidate: n` | Content that changes hourly/daily |
| Dynamic (SSR) | `no-store` / cookies()/headers() usage | Per-user pages |
| Client | `'use client'` islands | Interactive widgets |

One page mixes modes: static shell, streamed dynamic sections (`<Suspense>`), client islands.

## SEO Wiring

The [meta tags reference](../../../../seo/SEO_META_TAGS.md), Next-style:

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
    const post = await getPost(params.slug);
    return {
        title: `${post.title} — Site`,
        description: post.excerpt,
        alternates: { canonical: `https://example.com/blog/${post.slug}` },
        openGraph: { images: [post.ogImage] },
    };
}
```

Plus first-party: `next/image` (sizing/lazy/format), `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`.

## Deployment

- **Vercel**: zero-config, the intended home
- **Self-host**: `output: 'standalone'` → slim [Docker](../../../docker/DOCKER_CHEAT_SHEET.md) image → [Azure Container Apps](../../../azure/AZURE_ESSENTIALS.md)
- Environment: `NEXT_PUBLIC_*` vars ship to the browser — secrets never get that prefix

## The Traps

| Trap | Fix |
|------|-----|
| `'use client'` at the top of every file | Boundary at the leaves; server by default |
| Fetching in client components with useEffect | Fetch on the server; pass down |
| Stale pages after mutations | `revalidatePath`/`revalidateTag` in every action |
| Unvalidated Server Actions | Zod-parse args + authorize, inside the action |
| Secrets in `NEXT_PUBLIC_*` | They're in the JS bundle. Rotate and rename |

## See Also

- [React Essentials](../react/REACT_ESSENTIALS.md) — the component layer
- [SEO docs](../../../../seo/SEO_CHEAT_SHEET.md) — what the rendering serves
- [Node Essentials](../../../backend/node/NODE_ESSENTIALS.md)
