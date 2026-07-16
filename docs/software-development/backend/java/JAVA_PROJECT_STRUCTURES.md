# Java Project Structures

Layouts, build tools, and package conventions for Java projects.

## Build Tool First

| Tool | Character | Choose When |
|------|-----------|-------------|
| **Maven** | Declarative, rigid lifecycle, XML | Default — convention beats configuration |
| **Gradle** | Programmable (Kotlin DSL), faster incremental builds | Multi-module builds, Android, custom pipelines |

Either way, the directory contract is identical (Maven Standard Directory Layout):

```
project/
├── src/
│   ├── main/
│   │   ├── java/com/babusi/orders/     # code
│   │   └── resources/                  # config, templates
│   └── test/
│       ├── java/com/babusi/orders/     # mirrors main
│       └── resources/
├── pom.xml            # or build.gradle.kts + settings.gradle.kts
└── README.md
```

## Package Structure: By Feature, Not Layer

```java
// ❌ Package-by-layer — every feature smeared across the tree
com.babusi.app.controllers.*
com.babusi.app.services.*
com.babusi.app.repositories.*

// ✅ Package-by-feature — each package is a capability
com.babusi.app.orders/
    OrderController.java
    OrderService.java
    OrderRepository.java
    Order.java
com.babusi.app.billing/
    ...
com.babusi.app.shared/       # cross-cutting only
```

Package-by-feature gives you: package-private visibility as a real module boundary, deletable features, and the same modular-monolith pressure as the [PHP module rules](../php/PHP_PROJECT_STRUCTURES.md).

## Multi-Module Build (larger systems)

```
platform/
├── settings.gradle.kts        # includes all modules
├── build.gradle.kts           # shared config/versions
├── app/                       # thin bootable module
│   └── src/main/java/...      # main() + wiring only
├── orders/
│   ├── build.gradle.kts
│   └── src/main/java/...
├── billing/
└── shared-kernel/             # contracts crossed between modules
```

Rules:

- `app` depends on feature modules; feature modules depend only on `shared-kernel`
- No module reaches into another's internals — enforce with ArchUnit tests:

```java
@Test
void billing_does_not_depend_on_orders() {
    noClasses().that().resideInAPackage("..billing..")
        .should().dependOnClassesThat().resideInAPackage("..orders.internal..")
        .check(importedClasses);
}
```

## Hexagonal / Ports & Adapters (complex domains)

The Java ecosystem's DDD default — same inward-pointing arrows as the [PHP DDD layout](../php/PHP_PROJECT_STRUCTURES.md):

```
orders/
├── domain/                    # entities, value objects — zero framework
│   ├── Order.java
│   ├── Price.java
│   └── OrderRepository.java   # port (interface)
├── application/               # use cases
│   └── PlaceOrderUseCase.java
└── infrastructure/            # adapters
    ├── web/OrderController.java
    ├── persistence/JpaOrderRepository.java
    └── messaging/KafkaOrderEvents.java
```

## Modern Java Defaults (17+ / 21+)

```java
// Records for value objects & DTOs
public record Price(long cents, String currency) {
    public Price {
        if (cents < 0) throw new IllegalArgumentException("negative price");
    }
}

// Sealed hierarchies + pattern matching
public sealed interface PaymentResult permits Approved, Declined {}

var message = switch (result) {
    case Approved a -> "Paid " + a.amount();
    case Declined d -> "Declined: " + d.reason();
};

// Virtual threads (21+) — thread-per-request without the pool anxiety
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) { ... }
```

- Records over Lombok for immutable data; `Optional` as return type only (never fields/params)
- Constructor injection only — no field `@Autowired`/`@Inject` ([Spring Boot](springboot/SPRINGBOOT_ESSENTIALS.md))
- Prefer LTS releases (17, 21, 25); pin the toolchain in the build file

## Naming & Conventions

| Thing | Style | Example |
|-------|-------|---------|
| Packages | lowercase, reverse-domain | `com.babusi.orders` |
| Classes/records | PascalCase, role-suffixed | `OrderController`, `PlaceOrderUseCase` |
| Methods/fields | camelCase | `calculateTotal()` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| Tests | behavior names | `rejectsMixedCurrencyAddition()` |

Enforcement: Spotless (formatting) + Checkstyle/Error Prone (rules) + ArchUnit (architecture) in the [lint gate](../../../LINTING_GATES.md).

## See Also

- [Spring Boot Essentials](springboot/SPRINGBOOT_ESSENTIALS.md)
- [Quarkus Essentials](quarkus/QUARKUS_ESSENTIALS.md)
- [PHP Project Structures](../php/PHP_PROJECT_STRUCTURES.md) — the same shapes elsewhere
