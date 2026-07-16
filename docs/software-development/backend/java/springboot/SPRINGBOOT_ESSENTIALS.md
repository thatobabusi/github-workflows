# Spring Boot Essentials

The Java ecosystem's default application framework — conventions, the annotations that matter, and the traps.

## Bootstrapping

Start from [start.spring.io](https://start.spring.io) — pick only the starters you need:

| Starter | Gives You |
|---------|-----------|
| `spring-boot-starter-web` | MVC + embedded Tomcat |
| `spring-boot-starter-data-jpa` | Hibernate + repositories |
| `spring-boot-starter-validation` | Bean Validation (`@Valid`) |
| `spring-boot-starter-security` | Auth filter chain |
| `spring-boot-starter-actuator` | Health/metrics endpoints |
| `spring-boot-starter-test` | JUnit 5 + Mockito + AssertJ |

## The Core Pattern

Thin controller → service → repository, wired by **constructor injection**:

```java
@RestController
@RequestMapping("/api/v1/orders")
class OrderController {

    private final OrderService orders;      // final + constructor = testable

    OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    OrderResponse create(@Valid @RequestBody CreateOrderRequest request,
                         @AuthenticationPrincipal AppUser user) {
        return OrderResponse.from(orders.place(user, request));
    }
}

@Service
class OrderService {
    @Transactional
    public Order place(AppUser user, CreateOrderRequest request) { ... }
}

interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
}
```

Rules:

- **Never field-inject** (`@Autowired` on fields) — constructor injection keeps dependencies explicit and tests honest
- `@Transactional` on service methods, not controllers or repositories
- Request/response records at the boundary; JPA entities never leave the service layer (same rule as [API Standards](../../../../API_STANDARDS.md) resources)

## Configuration

```yaml
# application.yml + profile overrides (application-prod.yml)
spring:
  datasource:
    url: ${DATABASE_URL}
  jpa:
    open-in-view: false        # ALWAYS — the default true hides N+1s
```

```java
// Typed config over @Value scatter
@ConfigurationProperties(prefix = "billing")
public record BillingProperties(String provider, int retryLimit) {}
```

- Secrets via environment variables, never in YAML ([same rule everywhere](../../../../SECURITY_PERFORMANCE.md))
- Profiles = environments; activate with `SPRING_PROFILES_ACTIVE=prod`

## Testing

```java
// Slice tests — fast, focused
@WebMvcTest(OrderController.class)      // web layer only, mock the service
@DataJpaTest                            // repositories against H2/Testcontainers

// Full-context integration — use sparingly
@SpringBootTest(webEnvironment = RANDOM_PORT)

// Real database in CI
@Testcontainers
class OrderRepositoryTest {
    @Container
    static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");
}
```

Prefer slice tests + Testcontainers over mocking the database — mocked repositories test your mocks.

## The Traps

| Trap | Fix |
|------|-----|
| `open-in-view: true` (the default!) | Set false; fetch what you need in the service |
| JPA lazy-loads triggering N+1 | `@EntityGraph` or explicit `join fetch` — verify with SQL logging |
| Entities as API responses | Boundary records; entities stay internal |
| `@Transactional` on private/self-called methods | Proxies can't intercept those — restructure |
| Fat `@Component` grab-bag classes | One responsibility; feature packages ([structure](../JAVA_PROJECT_STRUCTURES.md)) |
| Catch-all `@ControllerAdvice` swallowing errors | Map known exceptions; let unknowns 500 loudly |

## Production Notes

- Actuator: expose `health`, `info`, `metrics` — lock down the rest
- Health endpoint feeds the [deploy pipeline's post-deploy check](../../../../DEPLOYMENT_GUIDE.md)
- Build OCI images with `./gradlew bootBuildImage` (buildpacks — no hand-rolled Dockerfile needed, but see [Docker](../../../docker/DOCKER_CHEAT_SHEET.md) when you do)
- Virtual threads (Boot 3.2+): `spring.threads.virtual.enabled: true` for thread-per-request scalability

## See Also

- [Java Project Structures](../JAVA_PROJECT_STRUCTURES.md)
- [Quarkus Essentials](../quarkus/QUARKUS_ESSENTIALS.md) — the alternative
- [API Standards](../../../../API_STANDARDS.md)
