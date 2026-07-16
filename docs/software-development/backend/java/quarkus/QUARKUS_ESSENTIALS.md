# Quarkus Essentials

Kubernetes-native Java: build-time wiring, instant startup, native compilation. The Spring Boot alternative when footprint and cold-start matter.

## Why Quarkus Exists

Spring resolves beans, proxies, and classpath scanning **at runtime, every startup**. Quarkus does that work **at build time**:

| Metric (typical REST service) | Spring Boot (JVM) | Quarkus (JVM) | Quarkus (native) |
|-------------------------------|-------------------|---------------|------------------|
| Startup | 3–10s | ~1s | **~0.05s** |
| Memory (RSS) | 300–500MB | ~150MB | **~40MB** |

Native images (GraalVM) make Java viable for serverless/scale-to-zero — the [Azure Container Apps](../../../azure/AZURE_ESSENTIALS.md) sweet spot.

## Bootstrapping

```bash
quarkus create app com.babusi:orders-service
cd orders-service && quarkus dev        # live reload + Dev UI at /q/dev
```

**Dev mode is the killer feature:** code changes hot-reload in milliseconds, and Dev Services auto-starts throwaway containers (Postgres, Kafka, Redis) for anything you've configured but not pointed anywhere — zero local setup.

## The Core Pattern

CDI + JAX-RS instead of Spring's annotations — same shape, different vocabulary:

```java
@Path("/api/v1/orders")
@Produces(MediaType.APPLICATION_JSON)
public class OrderResource {

    private final OrderService orders;

    @Inject
    public OrderResource(OrderService orders) {    // constructor injection, same rule
        this.orders = orders;
    }

    @POST
    @ResponseStatus(201)
    public OrderResponse create(@Valid CreateOrderRequest request) {
        return OrderResponse.from(orders.place(request));
    }
}

@ApplicationScoped
public class OrderService {
    @Transactional
    public Order place(CreateOrderRequest request) { ... }
}
```

### Rosetta Stone

| Spring | Quarkus |
|--------|---------|
| `@RestController` + `@RequestMapping` | `@Path` (JAX-RS) |
| `@Service` / `@Component` | `@ApplicationScoped` |
| `@Autowired` | `@Inject` |
| `application.yml` | `application.properties` |
| Spring Data repositories | Panache repositories/entities |
| Actuator | SmallRye Health (`/q/health`) |

## Panache (Data Layer)

Hibernate with the boilerplate removed:

```java
@Entity
public class Order extends PanacheEntity {      // id, persist(), delete() included
    public Long userId;
    public OrderStatus status;

    public static List<Order> pendingFor(Long userId) {
        return list("userId = ?1 and status = ?2", userId, OrderStatus.PENDING);
    }
}
```

Prefer the repository pattern (`PanacheRepository<Order>`) when the team dislikes active-record — [same trade-off discussion](../../php/PHP_DESIGN_PATTERNS.md) as everywhere.

## Configuration

```properties
# application.properties — profile prefixes instead of separate files
quarkus.datasource.jdbc.url=${DATABASE_URL}
%dev.quarkus.hibernate-orm.log.sql=true
%prod.quarkus.hibernate-orm.database.generation=none
```

```java
@ConfigMapping(prefix = "billing")              // typed config
public interface BillingConfig {
    String provider();
    int retryLimit();
}
```

## Native Compilation

```bash
quarkus build --native                          # needs GraalVM/Mandrel
# or containerized build (no local GraalVM):
quarkus build --native -Dquarkus.native.container-build=true
```

Native trade-offs: longer builds (minutes), reflection needs registering (`@RegisterForReflection`), some libraries incompatible — test natively in CI before committing to it. JVM-mode Quarkus is already a big win without native.

## Testing

```java
@QuarkusTest
class OrderResourceTest {
    @Test
    void createsOrder() {
        given().contentType(ContentType.JSON)
            .body(new CreateOrderRequest(42L, 2))
        .when().post("/api/v1/orders")
        .then().statusCode(201);
    }
}
```

RestAssured built in; Dev Services spin up real databases for tests automatically; `@QuarkusIntegrationTest` runs the same tests against the packaged (even native) artifact.

## Choosing: Quarkus vs Spring Boot

| Factor | Winner |
|--------|--------|
| Serverless / scale-to-zero / tight memory | **Quarkus** |
| Team already fluent in Spring | Spring Boot |
| Ecosystem breadth (every vendor SDK) | Spring Boot |
| Dev-loop speed (live reload + Dev Services) | **Quarkus** |
| Kubernetes-first deployment | Quarkus (marginally) |
| Long-running monolith on a big VM | Toss-up — Spring's maturity edges it |

## See Also

- [Java Project Structures](../JAVA_PROJECT_STRUCTURES.md)
- [Spring Boot Essentials](../springboot/SPRINGBOOT_ESSENTIALS.md)
- [Docker Cheat Sheet](../../../docker/DOCKER_CHEAT_SHEET.md)
