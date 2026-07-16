# React Essentials

Component patterns, state rules, and the ecosystem decisions — React 18+/19 with TypeScript assumed.

## Project Setup

```bash
npm create vite@latest app -- --template react-ts   # SPA
# Full-stack React → Next.js (see ../nextjs/NEXTJS_ESSENTIALS.md)
```

```
src/
├── components/          # shared, dumb-first components
│   └── ui/              # design-system primitives (Button, Card)
├── features/            # feature folders: components + hooks + api together
│   └── orders/
│       ├── OrderList.tsx
│       ├── useOrders.ts
│       └── api.ts
├── hooks/               # shared hooks
├── lib/                 # pure TS utilities
└── App.tsx
```

Feature folders over type folders — the [package-by-feature](../../../backend/java/JAVA_PROJECT_STRUCTURES.md) instinct in JSX.

## Component Rules

```tsx
type OrderCardProps = {
    order: Order;
    onCancel?: (id: number) => void;
};

export function OrderCard({ order, onCancel }: OrderCardProps) {
    return (
        <article className="order-card">
            <h3>{order.reference}</h3>
            {onCancel && (
                <button onClick={() => onCancel(order.id)}>Cancel</button>
            )}
        </article>
    );
}
```

- Function components only; props typed with a named `type`
- Small and single-purpose — a component doing data-fetching AND layout AND formatting is three components
- Derive, don't store: anything computable from props/state is a plain `const`, not more state
- Keys are stable IDs, never array indexes on dynamic lists

## State: The Decision Ladder

Work down; stop at the first rung that fits:

| Rung | Tool | For |
|------|------|-----|
| 1 | `useState` | Local component state |
| 2 | Lift state up | Two siblings share it |
| 3 | `useContext` | Truly global, rarely-changing (theme, auth user) |
| 4 | **TanStack Query** | ANY server data — caching, refetch, invalidation |
| 5 | Zustand/Jotai | Complex client-only global state (rare) |

The most common React mistake: putting **server data** in `useState`/Redux. Server state belongs to a query library:

```tsx
function useOrders(status: OrderStatus) {
    return useQuery({
        queryKey: ['orders', status],
        queryFn: () => api.get(`/orders?status=${status}`),
        staleTime: 30_000,
    });
}
```

## Hooks Discipline

- `useEffect` is for **synchronizing with external systems** (DOM APIs, subscriptions) — not for computing state from other state, not for data fetching (that's the query library)
- Every effect: complete dependency array + cleanup function; lint rule `react-hooks/exhaustive-deps` stays ON
- Extract reusable logic into custom hooks (`useDebounce`, `useLocalStorage`) once used twice
- `useMemo`/`useCallback` only for measured problems or referential-equality requirements — not decoration

## Forms

React Hook Form + Zod — validation schema shared with the API where possible:

```tsx
const schema = z.object({
    email: z.string().email(),
    quantity: z.number().min(1),
});

const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
});
```

Uncontrolled + validated beats hand-rolled controlled-input state for anything past two fields.

## Performance

1. Fix the architecture before reaching for memo: co-locate state (state high in the tree re-renders everything under it)
2. `React.memo` for expensive leaf components with stable props
3. Virtualize long lists (TanStack Virtual) past ~100 rows
4. `React.lazy` + `Suspense` for route-level code splitting
5. Measure with React DevTools Profiler — never optimize blind ([the profiling rule](../../../../CODE_QUALITY.md))

## Testing

```tsx
// Testing Library: assert what users see, not implementation
test('cancels an order', async () => {
    const onCancel = vi.fn();
    render(<OrderCard order={makeOrder()} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledWith(42);
});
```

Query priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId` (last resort). E2E flows in Playwright per the [testing doctrine](../../../../TESTING.md).

## Ecosystem Defaults

| Need | Default |
|------|---------|
| Build | Vite |
| Routing (SPA) | TanStack Router / React Router |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod |
| Styling | Tailwind (+ shadcn/ui primitives) |
| Full-stack | [Next.js](../nextjs/NEXTJS_ESSENTIALS.md) |

## See Also

- [Next.js Essentials](../nextjs/NEXTJS_ESSENTIALS.md)
- [Vue Essentials](../vuejs/VUE_ESSENTIALS.md) — the comparison
- [Node Essentials](../../../backend/node/NODE_ESSENTIALS.md)
