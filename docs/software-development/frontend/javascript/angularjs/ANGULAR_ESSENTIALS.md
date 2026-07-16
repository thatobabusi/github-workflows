# Angular Essentials

Modern Angular (17+): standalone components, signals, and the framework-owns-everything philosophy.

## Where Angular Fits

The full-framework option: router, DI, forms, HTTP, testing — all first-party, all versioned together. Choose it for large teams that want the framework to make the decisions ([NestJS](../../../backend/node/NODE_ESSENTIALS.md) on the backend completes the culture). For small apps its ceremony is overhead — [Vue](../vuejs/VUE_ESSENTIALS.md) or [React](../react/REACT_ESSENTIALS.md) get there faster.

## Project Setup

```bash
npm install -g @angular/cli
ng new app --style=scss              # standalone by default since v17
ng generate component features/orders/order-list
ng serve
```

```
src/app/
├── core/                # singleton services, interceptors, guards
├── shared/              # dumb reusable components, pipes
├── features/
│   └── orders/
│       ├── order-list.component.ts
│       ├── orders.service.ts
│       └── orders.routes.ts
└── app.routes.ts        # lazy-loads feature routes
```

## Standalone Components + Signals

NgModules are legacy; signals are the new reactivity:

```typescript
@Component({
    selector: 'app-order-list',
    imports: [CurrencyPipe],
    template: `
        <input [value]="filter()" (input)="filter.set($any($event.target).value)" />

        @for (order of filtered(); track order.id) {
            <article>{{ order.reference }} — {{ order.cents / 100 | currency:'ZAR' }}</article>
        } @empty {
            <p>No orders match.</p>
        }
    `,
})
export class OrderListComponent {
    private ordersService = inject(OrdersService);

    filter = signal('');
    orders = toSignal(this.ordersService.list(), { initialValue: [] });

    filtered = computed(() =>
        this.orders().filter(o => o.reference.includes(this.filter())));
}
```

- `signal()` / `computed()` over manual subscription plumbing — same derive-don't-store rule as [everywhere](../react/REACT_ESSENTIALS.md)
- `inject()` over constructor injection in components
- Built-in control flow (`@for`, `@if`) over `*ngFor`/`*ngIf`; `track` is mandatory
- Component `changeDetection: ChangeDetectionStrategy.OnPush` as default posture

## Services & DI

```typescript
@Injectable({ providedIn: 'root' })
export class OrdersService {
    private http = inject(HttpClient);

    list(): Observable<Order[]> {
        return this.http.get<Order[]>('/api/v1/orders');
    }
}
```

Components render; services fetch and hold logic — the thin-controller rule wearing a different badge. HTTP concerns (auth headers, error mapping) live in **interceptors**, once:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) =>
    next(req.clone({ setHeaders: { Authorization: `Bearer ${inject(Auth).token()}` } }));
```

## RxJS: Use Less of It

Signals cover most component state now. RxJS remains right for **event streams over time**:

```typescript
search$ = this.term$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.api.search(term)),   // switchMap cancels stale requests
);
```

Rules: no manual `.subscribe()` in components (use `toSignal`/`async` pipe); know `switchMap` vs `mergeMap` vs `concatMap` before using any; unsubscription handled by the framework, not by you.

## Forms

Reactive forms, typed (v14+):

```typescript
form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    quantity: [1, [Validators.required, Validators.min(1)]],
});
```

Template-driven forms only for trivial cases; the typed reactive API is the default.

## Routing

```typescript
export const routes: Routes = [
    {
        path: 'orders',
        loadChildren: () => import('./features/orders/orders.routes'),  // lazy
        canActivate: [authGuard],
    },
];
```

Lazy-load every feature; functional guards (`CanActivateFn`) over class guards.

## Testing

- Unit: Jasmine/Karma default, or Vitest via analog — assert component behavior through the DOM (TestBed + Testing Library's Angular adapter)
- E2E: Playwright, per the [testing doctrine](../../../../TESTING.md)
- Services with `HttpClient`: `provideHttpClientTesting()` — never hit real endpoints in unit tests

## Upgrade Discipline

Angular majors land every 6 months with `ng update` automation — schedule the update in the release after each major ships; skipping three majors turns a chore into a project ([the upgrade-story rule](../../../backend/php/PHP_FRAMEWORKS.md#evaluation-checklist)).

## See Also

- [React Essentials](../react/REACT_ESSENTIALS.md)
- [Vue Essentials](../vuejs/VUE_ESSENTIALS.md)
- [Node Essentials](../../../backend/node/NODE_ESSENTIALS.md) — NestJS pairing
