# SQL Cheat Sheet

The queries you actually reach for — joins, aggregation, window functions, CTEs, and upserts.

## Joins, Visually

```
INNER JOIN   — only rows matching on both sides
LEFT JOIN    — all left rows; NULLs where right is missing
RIGHT JOIN   — mirror of LEFT (rewrite as LEFT for sanity)
FULL OUTER   — everything, NULL-padded both ways
CROSS JOIN   — every combination (rare, deliberate)
```

```sql
-- The "find rows WITHOUT a match" idiom
SELECT u.*
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;                    -- users who never ordered
```

## Aggregation

```sql
SELECT
    user_id,
    COUNT(*)                          AS order_count,
    SUM(total_cents)                  AS lifetime_cents,
    AVG(total_cents)::BIGINT          AS avg_cents,
    MAX(created_at)                   AS last_order_at
FROM orders
WHERE status = 'completed'
GROUP BY user_id
HAVING COUNT(*) >= 3                  -- HAVING filters groups; WHERE filters rows
ORDER BY lifetime_cents DESC
LIMIT 20;
```

`COUNT(*)` counts rows; `COUNT(col)` skips NULLs; `COUNT(DISTINCT col)` uniques.

## Window Functions

Aggregates without collapsing rows — the biggest upgrade to intermediate SQL:

```sql
-- Rank orders per user by value
SELECT
    user_id, id, total_cents,
    ROW_NUMBER() OVER w             AS rn,          -- 1,2,3,4
    RANK()       OVER w             AS rnk,         -- 1,2,2,4
    SUM(total_cents) OVER (PARTITION BY user_id)   AS user_total,
    LAG(total_cents) OVER w         AS previous_order_cents
FROM orders
WINDOW w AS (PARTITION BY user_id ORDER BY total_cents DESC);

-- Top-N per group (the classic interview question)
SELECT * FROM (
    SELECT o.*, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
    FROM orders o
) ranked
WHERE rn <= 3;                        -- each user's 3 latest orders
```

## CTEs

```sql
WITH monthly AS (
    SELECT date_trunc('month', created_at) AS month, SUM(total_cents) AS revenue
    FROM orders GROUP BY 1
),
with_growth AS (
    SELECT month, revenue,
           revenue - LAG(revenue) OVER (ORDER BY month) AS delta
    FROM monthly
)
SELECT * FROM with_growth WHERE delta < 0;    -- months revenue dropped

-- Recursive: walk a tree (categories, org charts)
WITH RECURSIVE tree AS (
    SELECT id, parent_id, name, 0 AS depth
    FROM categories WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.parent_id, c.name, t.depth + 1
    FROM categories c JOIN tree t ON c.parent_id = t.id
)
SELECT * FROM tree ORDER BY depth;
```

## Upserts

```sql
-- PostgreSQL
INSERT INTO settings (user_id, key, value)
VALUES (42, 'theme', 'dark')
ON CONFLICT (user_id, key)
DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- MySQL
INSERT INTO settings (user_id, `key`, value)
VALUES (42, 'theme', 'dark')
ON DUPLICATE KEY UPDATE value = VALUES(value);
```

Upserts + unique constraints = the [idempotency](../../ASYNC_PATTERNS.md) workhorse for jobs and imports.

## Useful Patterns

```sql
-- Keyset pagination (deep lists — never OFFSET)
SELECT * FROM orders WHERE id > :last_seen_id ORDER BY id LIMIT 50;

-- Exists beats IN for big subqueries
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.total_cents > 100000);

-- Conditional aggregation (pivot-lite)
SELECT user_id,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed,   -- Postgres
    COUNT(*) FILTER (WHERE status = 'refunded')  AS refunded
    -- MySQL equivalent: SUM(status = 'completed')
FROM orders GROUP BY user_id;

-- Delete with a join (dedupe keeping newest)
DELETE FROM events a USING events b
WHERE a.id < b.id AND a.fingerprint = b.fingerprint;

-- Safe date ranges (index-friendly, DST-proof)
WHERE created_at >= '2026-07-01' AND created_at < '2026-08-01'
-- never: WHERE DATE(created_at) = ...  (kills index use)
```

## Reading EXPLAIN

```sql
EXPLAIN ANALYZE SELECT ...;
```

| You See | It Means |
|---------|----------|
| `Seq Scan` on a large table in a hot query | Missing/unusable index |
| `Index Scan` / `Index Only Scan` | Good — the latter never touches the heap |
| `Nested Loop` with high loop count | Often the N+1 shape inside the DB |
| Row estimate wildly off actual | Stale statistics — `ANALYZE` the table |
| `Sort` spilling to disk | Raise `work_mem` or add an ordered index |

## Safety Habits

- Write the `WHERE` before the `UPDATE`/`DELETE` verb — or run it as a `SELECT` first
- Wrap risky data fixes in an explicit transaction; verify, then `COMMIT`
- Always parameterized (`?`/`:name`) — string-built SQL is [injection](../../SECURITY_PERFORMANCE.md), full stop
- Production data fixes get a migration or an audited script, never a console one-liner from memory

## See Also

- [Database Design](DATABASE_DESIGN.md)
- [Security & Performance](../../SECURITY_PERFORMANCE.md)
