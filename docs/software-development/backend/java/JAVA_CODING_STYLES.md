# Java Coding Styles

Style baseline, modern idioms, and the enforcement toolchain — Java 17+ assumed, 21+ preferred.

## Style Baseline

Google Java Style is the reference (2-space indent camp) unless the project inherits another; what matters is that **the formatter decides, not the reviewer**:

| Rule | Convention |
|------|-----------|
| Indent | Formatter-owned (Google: 2; many teams: 4) — pick once, enforce |
| Line length | 100–120, formatter-enforced |
| Braces | Always, even single statements |
| Imports | No wildcards; ordered; unused = build failure |
| One top-level class per file | Always |

## Naming

| Thing | Style | Example |
|-------|-------|---------|
| Packages | lowercase, reverse-domain | `com.babusi.orders` |
| Classes/records/enums | PascalCase | `InvoiceGenerator` |
| Methods/fields/locals | camelCase | `calculateTotal()` |
| Constants (`static final`) | SCREAMING_SNAKE | `MAX_RETRIES` |
| Type parameters | Single capital or descriptive | `T`, `ID`, `RESPONSE` |
| Tests | Behavior sentences | `rejectsMixedCurrencyAddition()` |

Role suffixes consistently: `*Controller`, `*Service`, `*Repository`, `*UseCase`, `*Config` — [same registry as PHP](../php/PHP_CODING_STYLES.md).

## Modern Defaults (17+ / 21+)

```java
// Records for values & DTOs — kills the getter/equals/hashCode boilerplate era
public record Price(long cents, String currency) {
    public Price {                               // compact constructor validates
        if (cents < 0) throw new IllegalArgumentException("negative price");
    }
    public Price add(Price other) {
        if (!currency.equals(other.currency)) throw new CurrencyMismatchException();
        return new Price(cents + other.cents, currency);
    }
}

// Sealed + switch pattern matching = exhaustive domain results
public sealed interface PaymentResult permits Approved, Declined, Pending {}

var message = switch (result) {
    case Approved(var amount) -> "Paid " + amount;
    case Declined(var reason) -> "Declined: " + reason;
    case Pending p -> "Awaiting confirmation";
};   // compiler enforces exhaustiveness — no default needed

// Text blocks for SQL/JSON
var sql = """
    SELECT id, total_cents FROM orders
    WHERE user_id = ? AND status = ?
    """;
```

Reach-for-first list:

- **Records over Lombok** for immutable data — no annotation processor magic
- `Optional<T>` as **return type only** — never fields, never parameters
- `var` for obvious local types; explicit types on fields and signatures
- `List.of()` / `Map.of()` immutable collections by default
- Streams for transformation pipelines; a plain loop when it reads better — no stream golf
- Virtual threads (21+) for blocking-IO concurrency before reactive complexity

## Null Discipline

The billion-dollar bug gets a policy, not vibes:

```java
// Boundaries validate; internals trust
public Order place(CreateOrderRequest request) {
    Objects.requireNonNull(request, "request");
    ...
}
```

- `@Nullable`/`@NonNull` annotations (JSpecify) at API boundaries; NullAway/Error Prone enforces
- Return empty collections, never null collections
- `Optional` for "legitimately absent" returns; exceptions for "should exist"

## Exceptions

- Unchecked by default; checked exceptions only when the caller can genuinely recover
- Domain exceptions carry meaning: `InsufficientStockException`, not `RuntimeException("no stock")`
- Never swallow: catch → handle, wrap-rethrow with cause, or let it fly
- Try-with-resources for anything `AutoCloseable` — always

## Enforcement Toolchain

| Tool | Role |
|------|------|
| **Spotless** (+ google-java-format) | Formatting — runs in the [lint gate](../../../LINTING_GATES.md) |
| **Error Prone** | Compile-time bug patterns |
| **Checkstyle** | Residual style rules the formatter can't own |
| **NullAway** | Null-safety enforcement |
| **ArchUnit** | Architecture rules as tests ([structures](JAVA_PROJECT_STRUCTURES.md)) |

```kotlin
// build.gradle.kts
spotless {
    java {
        googleJavaFormat()
        removeUnusedImports()
    }
}
```

`./gradlew spotlessCheck` in CI; `spotlessApply` locally — humans never format.

## Javadoc

Public APIs of libraries: yes. Internal application code: only where the signature can't say it ([same docblock rule as PHP](../php/PHP_CODING_STYLES.md)):

```java
/**
 * Matches ledger entries against the bank statement.
 * Entries within 3 days and R1.00 are considered matched —
 * bank posting delays make exact matching useless.
 *
 * @throws ReconciliationException if the statement period is unclosed
 */
```

## Idiom Corrections

| Smell | Fix |
|-------|-----|
| Lombok `@Data` on everything | Records; or explicit small classes |
| `Optional.get()` bare | `orElseThrow(SpecificException::new)` |
| Field injection | Constructor injection ([Spring rules](springboot/SPRINGBOOT_ESSENTIALS.md)) |
| Utility class with 40 statics | Cohesive classes or default methods |
| `throws Exception` | Specific types |
| Stream chains 8 calls deep | Extract named intermediate steps |

## See Also

- [Java Project Structures](JAVA_PROJECT_STRUCTURES.md)
- [Spring Boot Essentials](springboot/SPRINGBOOT_ESSENTIALS.md)
- [PHP Coding Styles](../php/PHP_CODING_STYLES.md) — the cross-stack registry
