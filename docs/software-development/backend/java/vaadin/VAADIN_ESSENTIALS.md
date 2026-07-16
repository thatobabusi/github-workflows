# Vaadin Essentials

Full-stack web UIs in pure Java — no HTML/JS layer to maintain. The niche: internal business apps built by Java-only teams.

## When Vaadin

| Situation | Verdict |
|-----------|---------|
| Internal tools/admin UIs, Java team, no frontend devs | Yes — this is the sweet spot |
| Data-dense CRUD over a [Spring Boot](../springboot/SPRINGBOOT_ESSENTIALS.md) backend | Yes (Vaadin rides on Boot) |
| Public-facing, SEO-relevant, design-heavy product | No — [React](../../../frontend/javascript/react/REACT_ESSENTIALS.md)/[Vue](../../../frontend/javascript/vuejs/VUE_ESSENTIALS.md) |
| Mobile-first consumer app | No |

Trade: you give up frontend control and per-user server memory (UI state lives server-side) and get a single-language, type-safe stack with zero API layer to design.

## The Programming Model

UI is a Java component tree; events round-trip to the server:

```java
@Route("orders")                                   // URL mapping
@PermitAll
public class OrdersView extends VerticalLayout {

    public OrdersView(OrderService service) {      // Spring DI works directly
        var grid = new Grid<>(Order.class, false);
        grid.addColumn(Order::reference).setHeader("Reference").setSortable(true);
        grid.addColumn(o -> o.total().display()).setHeader("Total");
        grid.setItems(query ->                      // lazy data provider — pages from the DB
            service.page(query.getOffset(), query.getLimit()).stream());

        var filter = new TextField("Filter");
        filter.setValueChangeMode(ValueChangeMode.LAZY);
        filter.addValueChangeListener(e -> grid.setItems(
            q -> service.search(e.getValue(), q.getOffset(), q.getLimit()).stream()));

        add(new H2("Orders"), filter, grid);
    }
}
```

No REST endpoint, no DTOs, no fetch — the service call *is* the data flow.

## Forms & Binding

```java
var binder = new BeanValidationBinder<>(Customer.class);   // JSR-380 annotations honored
binder.bindInstanceFields(this);                            // matches fields by name

save.addClickListener(e -> {
    if (binder.writeBeanIfValid(customer)) {
        service.save(customer);
        Notification.show("Saved");
    }
});
```

Validation rules live once, on the entity/bean — the same Bean Validation the [Spring layer](../springboot/SPRINGBOOT_ESSENTIALS.md) uses.

## Rules That Keep Vaadin Apps Sane

- **Views render; services work** — the thin-controller rule verbatim; views take services via constructor injection
- **Lazy data providers always** for grids — `setItems(collection)` on big tables loads everything into session memory
- Component state is per-user server memory: watch session size, prefer `@PreserveOnRefresh` deliberately, not by default
- Extract reusable component compositions into their own classes once used twice
- `@Push` (websocket) for server-initiated updates (progress bars, live dashboards)

## Flow vs Hilla

| | Flow (classic) | Hilla |
|--|---------------|-------|
| UI language | Pure Java | React + TypeScript |
| Backend link | Direct method calls | Type-safe generated TS clients |
| For | Java-only teams | Mixed teams wanting typed full-stack |

Hilla is Vaadin's answer when you *do* want a React frontend but with generated, type-safe endpoints instead of hand-rolled [API contracts](../../../../API_STANDARDS.md).

## Production Notes

- Production build required (`-Pproduction`) — dev bundle is huge and slow
- Sessions are sticky: load balancing needs session affinity or shared sessions
- Startup/footprint follows [Spring Boot](../springboot/SPRINGBOOT_ESSENTIALS.md); the [deploy pipeline](../../../../DEPLOYMENT_GUIDE.md) is unchanged

## See Also

- [Spring Boot Essentials](../springboot/SPRINGBOOT_ESSENTIALS.md)
- [Java Project Structures](../JAVA_PROJECT_STRUCTURES.md)
- [React Essentials](../../../frontend/javascript/react/REACT_ESSENTIALS.md) — the path not taken
