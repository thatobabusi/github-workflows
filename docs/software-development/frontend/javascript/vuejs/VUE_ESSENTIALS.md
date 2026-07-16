# Vue Essentials

Vue 3, Composition API, `<script setup>` — the assumed baseline. Options API only in legacy code.

## Project Setup

```bash
npm create vue@latest        # official scaffold: TS, Router, Pinia, Vitest checkboxes
```

```
src/
├── components/          # shared components
├── features/            # feature folders (components + composables + api)
├── composables/         # shared useX() functions
├── stores/              # Pinia stores
├── router/
└── App.vue
```

## Single-File Component Baseline

```vue
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    order: Order;
}>();

const emit = defineEmits<{
    cancel: [id: number];
}>();

const isPending = computed(() => props.order.status === 'pending');
</script>

<template>
    <article class="order-card">
        <h3>{{ order.reference }}</h3>
        <button v-if="isPending" @click="emit('cancel', order.id)">
            Cancel
        </button>
    </article>
</template>
```

- `<script setup lang="ts">` always; typed `defineProps`/`defineEmits`
- Props down, events up — no mutating props, no reaching into children
- `computed` for anything derivable — the Vue reactivity system's whole point

## Reactivity Rules

| API | Use For |
|-----|---------|
| `ref()` | Primitives, reassignable values |
| `reactive()` | Object you'll never reassign (prefer `ref` anyway for consistency) |
| `computed()` | ALL derived values |
| `watch()` | Side effects on specific changes (async triggers) |
| `watchEffect()` | Side effects with auto-tracked deps |

The traps:

- Destructuring `reactive()` kills reactivity — `toRefs()` if you must
- `ref` in templates auto-unwraps; in script it's `.value` — always
- `watch` for effects only; deriving state in a watcher instead of `computed` is the Vue smell equivalent of [React's useEffect misuse](../react/REACT_ESSENTIALS.md)

## Composables

The reuse unit — extract once logic is used twice:

```typescript
// composables/useOrders.ts
export function useOrders(status: Ref<OrderStatus>) {
    const orders = ref<Order[]>([]);
    const loading = ref(false);

    watchEffect(async () => {
        loading.value = true;
        try {
            orders.value = await api.get(`/orders?status=${status.value}`);
        } finally {
            loading.value = false;
        }
    });

    return { orders, loading };
}
```

For serious server state, TanStack Query has a Vue adapter — same [server-state rule](../react/REACT_ESSENTIALS.md) as React: don't hand-roll caching.

## State: Pinia

```typescript
export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([]);

    const total = computed(() =>
        items.value.reduce((sum, i) => sum + i.cents * i.quantity, 0));

    function add(product: Product, quantity = 1) {
        // ...
    }

    return { items, total, add };
});
```

- Setup-style stores (functions, not options objects) — same mental model as components
- Same ladder as React: local `ref` → props/events → provide/inject (rare) → Pinia for genuinely global client state → query library for server data

## Ecosystem Defaults

| Need | Default |
|------|---------|
| Build | Vite (native) |
| Routing | Vue Router |
| Global state | Pinia |
| Server state | TanStack Query (Vue) |
| Forms | VeeValidate + Zod |
| Full-stack / SSR | **Nuxt** (the [Next.js](../nextjs/NEXTJS_ESSENTIALS.md) equivalent) |
| Components | PrimeVue / Radix Vue + Tailwind |

## Testing

```typescript
import { render, screen } from '@testing-library/vue';

test('emits cancel with the order id', async () => {
    const { emitted } = render(OrderCard, { props: { order: makeOrder() } });

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(emitted().cancel[0]).toEqual([42]);
});
```

Same doctrine as [React testing](../react/REACT_ESSENTIALS.md): assert rendered behavior, not internals; Playwright for [E2E](../../../../TESTING.md).

## Vue vs React (honest one-paragraph version)

Vue's reactivity is more ergonomic (no dependency arrays, no memo ceremony) and SFCs keep concerns co-located; React has the larger ecosystem, hiring pool, and React Native. Teams productive in either ship equally good software — pick per team history, and pair with Laravel via [Inertia](../../../backend/php/PHP_FRAMEWORKS.md) where it fits.

## See Also

- [React Essentials](../react/REACT_ESSENTIALS.md)
- [Next.js Essentials](../nextjs/NEXTJS_ESSENTIALS.md) — Nuxt's sibling
- [PHP Frameworks](../../../backend/php/PHP_FRAMEWORKS.md) — Inertia pairing
