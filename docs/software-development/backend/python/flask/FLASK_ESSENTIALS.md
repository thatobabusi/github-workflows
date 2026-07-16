# Flask Essentials

The Python micro-framework done with discipline — app factory, blueprints, and knowing when you've outgrown it.

## When Flask

[The frameworks doc](../PYTHON_FRAMEWORKS.md) verdict: small services, webhooks, prototypes, teaching. Past three extensions you've hand-assembled a framework — FastAPI or [Django](../django/DJANGO_ESSENTIALS.md) would have decided better. This doc is for doing the small thing properly.

## App Factory + Blueprints (non-negotiable structure)

Module-level `app = Flask(__name__)` kills testing and config isolation. Factory pattern from day one:

```python
# app/__init__.py
from flask import Flask

def create_app(config: type = ProdConfig) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)                        # extensions bind late

    from app.orders import bp as orders_bp
    app.register_blueprint(orders_bp, url_prefix="/api/v1/orders")

    register_error_handlers(app)
    return app
```

```python
# app/orders/__init__.py — blueprint = the module unit
bp = Blueprint("orders", __name__)

# app/orders/routes.py
@bp.post("")
def create_order():
    data = CreateOrderSchema().load(request.get_json())   # validate at boundary
    order = order_service.place(g.current_user, data)     # services do the work
    return OrderSchema().dump(order), 201
```

Blueprints per domain (orders, users) — the [feature-folder instinct](../PYTHON_PROJECT_STRUCTURES.md).

## Errors & Responses

```python
def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ValidationError)
    def validation_error(e):
        return {"message": "Validation failed", "errors": e.messages}, 422

    @app.errorhandler(404)
    def not_found(e):
        return {"message": "Not found"}, 404

    @app.errorhandler(Exception)
    def server_error(e):
        app.logger.exception(e)
        return {"message": "Internal server error"}, 500    # opaque in prod
```

[API Standards](../../../../API_STANDARDS.md) envelope and status codes; stacks never leak.

## The Standard Extension Set

| Need | Extension |
|------|-----------|
| ORM + migrations | Flask-SQLAlchemy + Flask-Migrate (Alembic) |
| Serialization/validation | marshmallow (or plain Pydantic) |
| Auth sessions | Flask-Login / JWT via flask-jwt-extended |
| CORS | Flask-CORS |
| Rate limiting | Flask-Limiter |

Counting four+? That's the outgrown signal.

## Context Gotchas

- `request`, `g`, `current_app` are **context-locals** — valid only during a request; background threads need `app.app_context()`
- Anything slow leaves the request: queue it (RQ/Celery — [async rules](../../../../ASYNC_PATTERNS.md)); Flask is sync-first (one blocked worker = one fewer worker)
- Store per-request state on `g`, never on module globals

## Testing

```python
@pytest.fixture
def client():
    app = create_app(TestConfig)             # the factory pays off here
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
```

```python
def test_create_order(client, auth_headers):
    resp = client.post("/api/v1/orders", json={"product_id": 1}, headers=auth_headers)
    assert resp.status_code == 201
```

## Production

```bash
gunicorn "app:create_app()" -w 4 -b 0.0.0.0:8000   # never the dev server
```

Behind nginx or in a [container](../../../docker/DOCKER_CHEAT_SHEET.md); env-var config; health endpoint; the [deploy gates](../../../../DEPLOYMENT_GUIDE.md) unchanged.

## See Also

- [Python Frameworks](../PYTHON_FRAMEWORKS.md)
- [Django Essentials](../django/DJANGO_ESSENTIALS.md)
- [Vanilla PHP Essentials](../../php/vanilla/VANILLA_PHP_ESSENTIALS.md) — the same "small thing, done right" philosophy
