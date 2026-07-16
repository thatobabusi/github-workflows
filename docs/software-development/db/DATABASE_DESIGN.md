# Database Design

Schema design rules, normalization judgment, indexing, and migration discipline — engine-agnostic with MySQL/Postgres notes.

## Schema Rules

| Rule | Why |
|------|-----|
| Singular or plural table names — pick ONE convention repo-wide | Mixed conventions breed join typos (Laravel: plural snake_case) |
| Every table gets `id` (bigint auto / identity) + `created_at` / `updated_at` | Uniform tooling, debuggability |
| Foreign keys are real constraints, not conventions | The database is the last line of integrity |
| `NOT NULL` by default; nullable is an explicit decision | Nulls are where bugs live |
| Money = integer cents; never FLOAT/DOUBLE for anything financial | [Same rule as code](../backend/php/PHP_DESIGN_PATTERNS.md) |
| Timestamps in UTC (`timestamptz` in Postgres) | Timezones are presentation |
| Enums: lookup table or CHECK constraint over engine ENUM | Engine enums make migrations painful |

## Normalization — and When to Stop

Normalize to **3NF by default**:

1. **1NF** — atomic values, no repeating groups (no CSV-in-a-column)
2. **2NF** — every column depends on the whole key
3. **3NF** — no column depends on a non-key column

Denormalize **deliberately**, only with a measured read-path reason, and always with a documented owner of consistency:

- Aggregates (`orders.total_cents` cached from lines) → recompute on write, in a transaction or event
- Reporting copies → rebuildable, clearly named (`*_snapshot`, `*_rollup`)
- JSON columns → fine for genuinely schemaless payloads (webhooks, settings); the moment you query a JSON field in WHERE routinely, promote it to a column

## Relationships

```sql
-- 1:N — FK on the many side
CREATE TABLE orders (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users (id),
    status      VARCHAR(20) NOT NULL DEFAULT 'pending',
    total_cents BIGINT NOT NULL CHECK (total_cents >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- N:M — pivot named after both sides, composite unique
CREATE TABLE order_product (
    order_id   BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products (id),
    quantity   INT NOT NULL DEFAULT 1,
    PRIMARY KEY (order_id, product_id)
);
```

`ON DELETE`: `CASCADE` for owned children (order → lines), `RESTRICT` for referenced masters (product in orders), `SET NULL` rarely and deliberately.

## Indexing

- **Index every foreign key** (Postgres does *not* do this automatically; MySQL InnoDB does)
- Index what you filter/sort on — from real query plans, not guesses
- **Composite index column order matters:** equality columns first, then range. Index `(user_id, created_at)` serves `WHERE user_id = ? ORDER BY created_at` — the reverse doesn't
- Partial indexes for hot subsets: `CREATE INDEX ... WHERE status = 'pending'`
- Every index taxes writes — audit unused indexes (`pg_stat_user_indexes`)

```sql
EXPLAIN ANALYZE SELECT ...;   -- Seq Scan on a big table in a hot path = missing index
```

## Migration Discipline

All schema change flows through versioned migrations ([Laravel](../backend/php/PHP_FRAMEWORKS.md) migrations, Alembic, Flyway):

- One concern per migration; irreversible ones documented as such
- **Expand → migrate → contract** for breaking changes — full procedure in the [Deployment Guide](../../DEPLOYMENT_GUIDE.md)
- Adding an index to a big table: `CREATE INDEX CONCURRENTLY` (Postgres) / online DDL (MySQL) — never lock a hot table
- Never edit a merged migration; ship a new one

## Query Hygiene

The [performance rules](../../SECURITY_PERFORMANCE.md) in SQL terms:

- Kill N+1s with joins/eager loading; verify with query logs
- `SELECT` named columns on hot paths, not `*`
- Paginate with keyset/cursor (`WHERE id > ?  ORDER BY id LIMIT 50`) for deep lists — `OFFSET 100000` scans everything it skips
- Batch writes (`INSERT ... VALUES (...), (...), (...)`) over row-at-a-time loops
- Wrap multi-statement invariants in transactions; keep transactions short

## Engine Notes

| Topic | MySQL 8 | PostgreSQL 16 |
|-------|---------|---------------|
| Default choice when | Laravel hosting ubiquity | Anything data-shaped or beyond CRUD |
| JSON | `JSON` type, generated columns for indexing | `JSONB` + GIN indexes (stronger) |
| Full-text | Basic | Solid (`tsvector`), often replaces a search engine |
| Distinctives | — | Partial/expression indexes, CTEs, window functions, `CONCURRENTLY` |

Both are correct defaults; consistency within an ecosystem beats micro-optimization across engines.

## See Also

- [SQL Cheat Sheet](sql/SQL_CHEAT_SHEET.md)
- [Deployment Guide](../../DEPLOYMENT_GUIDE.md) — migrations in production
- [Security & Performance](../../SECURITY_PERFORMANCE.md)
