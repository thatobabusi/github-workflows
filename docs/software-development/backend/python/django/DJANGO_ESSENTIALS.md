# Django Essentials

The batteries-included Python framework — ORM, migrations, admin, auth in one piece. [When to choose it](../PYTHON_FRAMEWORKS.md): full apps where the free admin pays rent.

## Daily Commands

```bash
django-admin startproject config .        # settings package named 'config'
python manage.py startapp orders
python manage.py makemigrations && python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
python manage.py shell                    # the tinker equivalent
python manage.py test
```

## Where Logic Lives

Same routing table as [Laravel](../../php/laravel/LARAVEL_ESSENTIALS.md), Django vocabulary:

| Concern | Home | Never In |
|---------|------|----------|
| URL → handler | `urls.py` per app | One giant urls.py |
| Request handling | Views (thin!) | — |
| Validation/parsing | Forms / DRF serializers | Views |
| Business logic | `services.py` per app | Views, models-as-god-objects |
| Query shapes | Custom managers/querysets | Copy-pasted filters |
| Admin config | `admin.py` | — |

```python
# orders/models.py
class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending"
        SHIPPED = "shipped"

    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="orders")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    total_cents = models.PositiveBigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    objects = OrderQuerySet.as_manager()

class OrderQuerySet(models.QuerySet):
    def pending(self):                       # the scope pattern
        return self.filter(status=Order.Status.PENDING)
```

## ORM Performance Rules

The [N+1 rules](../../../../SECURITY_PERFORMANCE.md) in Django idiom:

```python
# select_related: FK/one-to-one (SQL join)
orders = Order.objects.select_related("user").all()

# prefetch_related: many-to-many / reverse FK (second query)
users = User.objects.prefetch_related("orders").all()

# only what you need on hot paths
Order.objects.values("id", "total_cents")
Order.objects.only("id", "reference")

# aggregate in the DB, not in Python
User.objects.annotate(order_count=Count("orders")).filter(order_count__gte=3)
```

`django-debug-toolbar` in dev = the query counter that keeps you honest.

## The Admin (the reason you chose Django)

```python
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("reference", "user", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("reference", "user__email")
    autocomplete_fields = ("user",)
    list_select_related = ("user",)          # admin gets N+1s too
```

Resist making the admin the app — it's a back-office, not a product UI.

## Settings Discipline

```
config/settings/base.py      # shared
config/settings/dev.py       # DEBUG=True, toolbar
config/settings/production.py# DEBUG=False, security flags
```

- `django-environ`/env vars for secrets ([the universal rule](../../../../SECURITY_PERFORMANCE.md))
- Production flags: `DEBUG=False`, `ALLOWED_HOSTS` set, `SECURE_HSTS_SECONDS`, `CSRF_TRUSTED_ORIGINS`
- `python manage.py check --deploy` before every launch

## APIs: DRF

```python
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "reference", "status", "total_cents", "created_at"]

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):                  # scope to the user — authorization in the queryset
        return self.request.user.orders.select_related("user")
```

Serializers are the [Resource layer](../../../../API_STANDARDS.md); viewsets + routers give the REST conventions for free.

## Background Work & Testing

- Celery (or `django-tasks`) for anything slow — [async rules](../../../../ASYNC_PATTERNS.md) apply: idempotent, bounded retries
- Tests: `pytest-django` + `factory_boy` factories; `assertNumQueries` locks in query counts

## See Also

- [Python Frameworks](../PYTHON_FRAMEWORKS.md) — Django vs FastAPI vs Flask
- [Flask Essentials](../flask/FLASK_ESSENTIALS.md)
- [Laravel Essentials](../../php/laravel/LARAVEL_ESSENTIALS.md) — the same shape in PHP
