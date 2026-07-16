# Python Frameworks

The web landscape, honest trade-offs, selection guidance. Same evaluation lens as [PHP Frameworks](../php/PHP_FRAMEWORKS.md).

## Decision Table

| You're Building | Reach For |
|-----------------|-----------|
| JSON API / microservice (default) | **FastAPI** |
| Full app: admin, auth, ORM, batteries | **Django** |
| Tiny service / learning the layer | Flask |
| Async-heavy websockets/streaming | FastAPI or Litestar |
| Data app / internal dashboard | Streamlit / Dash |
| Task runners behind any of these | Celery / RQ / arq |

## FastAPI

Type-hints-as-contract: validation, serialization, and OpenAPI docs generated from the signatures you were writing anyway.

```python
from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI()


class OrderIn(BaseModel):
    product_id: int
    quantity: int = 1


@app.post("/orders", status_code=201)
async def create_order(
    order: OrderIn,                        # validated request body
    user: User = Depends(current_user),    # dependency injection
) -> OrderOut:                             # response schema + docs
    return await order_service.place(user, order)
```

**Strengths:** Pydantic validation for free, automatic `/docs` (Swagger), first-class async, dependency injection built in, near-Starlette performance.

**Costs:** no ORM/auth/admin included — you assemble (SQLAlchemy + Alembic + your auth); project structure discipline is on you ([layout](PYTHON_PROJECT_STRUCTURES.md)).

**Fits:** APIs consumed by SPAs/mobile, microservices, ML model serving.

## Django

The Laravel of Python — ORM, migrations, admin, auth, forms, templates in one coherent framework.

```python
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    total_cents = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


# The admin you get for one line:
admin.site.register(Order)
```

**Strengths:** the free admin interface is a genuine product feature; migrations mature; auth/session/CSRF handled; DRF for serious APIs; 20 years of answered questions.

**Costs:** heavier start; ORM couples models to persistence (Active Record trade-off, [same as Eloquent](../php/PHP_FRAMEWORKS.md)); async support still second-class in places.

**Fits:** content sites, internal tools, anything where the admin saves you building a back-office.

## Flask

Micro-framework — routing + request context, everything else is extensions.

```python
app = Flask(__name__)

@app.get("/health")
def health():
    return {"status": "ok"}
```

**Strengths:** minimal, unopinionated, huge extension ecosystem, best teaching tool for WSGI.

**Costs:** by the time you've added SQLAlchemy + Migrate + Login + Marshmallow, you've hand-assembled a framework — FastAPI or Django would have decided better. Sync-first.

**Fits:** small services, webhooks, prototypes.

## The Rest of the Field

| Framework | One-Liner | When |
|-----------|-----------|------|
| **Litestar** | FastAPI-alike, stricter architecture | Async APIs, teams wanting more structure |
| **Django REST Framework** | The API layer on Django | You're already in Django |
| **Streamlit / Dash** | Python-only data UIs | Internal dashboards, ML demos |
| **aiohttp** | Async HTTP client/server primitives | Low-level async services |
| **Tornado / Sanic** | Older async servers | Legacy |

## Background Work

| Tool | Broker | Character |
|------|--------|-----------|
| **Celery** | Redis/RabbitMQ | The heavyweight standard — retries, schedules, chords |
| **RQ** | Redis | Simple, readable, enough for most apps |
| **arq** | Redis | Async-native, pairs with FastAPI |

The [async patterns rules](../../../ASYNC_PATTERNS.md) apply verbatim: idempotent jobs, bounded retries, explicit failure handlers, workers under a supervisor.

## Full-Stack Pairings

| Pairing | Choose When |
|---------|-------------|
| Django + templates + HTMX | Server-rendered with modern interactivity, minimal JS |
| FastAPI + separate SPA | API-first, frontend team, mobile clients |
| Django + DRF + SPA | Django's back-office + API app |

HTMX occupies the Livewire slot from the [PHP pairings](../php/PHP_FRAMEWORKS.md): interactivity without a JS build.

## Framework-Agnostic Insurance

- Business logic in plain modules (`services/`) — importable without the framework
- Pydantic/dataclass schemas at the boundaries, ORM models inside
- Same [evaluation checklist](../php/PHP_FRAMEWORKS.md#evaluation-checklist) before committing: LTS policy, upgrade story, ecosystem, hiring, exit cost

## See Also

- [Python Project Structures](PYTHON_PROJECT_STRUCTURES.md)
- [Python Coding Styles](PYTHON_CODING_STYLES.md)
- [API Standards](../../../API_STANDARDS.md)
