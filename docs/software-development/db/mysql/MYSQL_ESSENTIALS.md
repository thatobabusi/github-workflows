# MySQL Essentials

MySQL 8.x specifics — the Laravel-hosting default. Engine-agnostic design rules live in [Database Design](../DATABASE_DESIGN.md); query patterns in the [SQL Cheat Sheet](../sql/SQL_CHEAT_SHEET.md).

## Daily CLI

```bash
mysql -u root -p appdb
mysqldump -u root -p --single-transaction appdb > backup-$(date +%F).sql   # non-locking dump
mysql -u root -p appdb < backup.sql

# Inside the shell
SHOW DATABASES; USE appdb; SHOW TABLES;
SHOW CREATE TABLE orders\G          -- \G = vertical output
DESCRIBE orders;
SHOW PROCESSLIST;                   -- what's running/stuck right now
```

## Configuration That Matters

```ini
# my.cnf essentials
[mysqld]
innodb_buffer_pool_size = 4G        # THE tuning knob: ~60-70% of dedicated RAM
max_connections = 200
slow_query_log = 1
long_query_time = 0.5               # log anything over 500ms
```

- **InnoDB only** (default since 5.5) — MyISAM has no transactions, no row locks, no FK
- Charset: `utf8mb4` + `utf8mb4_0900_ai_ci` — plain `utf8` is a 3-byte lie that breaks emoji
- `sql_mode` keep `STRICT_TRANS_TABLES` (default in 8) — silent truncation was the old MySQL's worst habit

## MySQL-Specific Syntax Worth Knowing

```sql
-- Upsert (unique key drives it)
INSERT INTO settings (user_id, `key`, value) VALUES (42, 'theme', 'dark')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- Generated column + index = queryable JSON
ALTER TABLE events
    ADD COLUMN user_id BIGINT AS (payload->>'$.user_id') STORED,
    ADD INDEX idx_events_user (user_id);

-- Conditional aggregation (no FILTER clause in MySQL)
SELECT user_id,
       SUM(status = 'completed') AS completed,
       SUM(status = 'refunded')  AS refunded
FROM orders GROUP BY user_id;

-- Online DDL — don't lock the hot table
ALTER TABLE orders ADD INDEX idx_status (status), ALGORITHM=INPLACE, LOCK=NONE;
```

## EXPLAIN, MySQL Flavor

```sql
EXPLAIN ANALYZE SELECT ...;          -- 8.0.18+: actual timings, like Postgres
```

| `type` column | Meaning |
|---------------|---------|
| `const` / `eq_ref` | Excellent — PK/unique lookup |
| `ref` / `range` | Good — index used |
| `index` | Full index scan — mediocre |
| **`ALL`** | Full table scan — the red flag |

Also watch `Extra`: `Using filesort` / `Using temporary` on hot queries = index or query redesign.

## Locking Gotchas

- Default isolation **REPEATABLE READ** (Postgres/SQL Server default READ COMMITTED) — gap locks under load can deadlock inserts; many ORMs/apps run READ COMMITTED deliberately
- Deadlocks are retryable events, not bugs: catch error 1213, retry the transaction ([idempotency rules](../../../ASYNC_PATTERNS.md))
- `SELECT ... FOR UPDATE` to lock rows you're about to update in multi-step transactions

## Operational Checklist

- [ ] Backups: nightly `mysqldump --single-transaction` minimum; test restores ([Deployment Guide](../../../DEPLOYMENT_GUIDE.md))
- [ ] Slow query log on and reviewed; `pt-query-digest` for summaries
- [ ] Every FK indexed (InnoDB does this automatically — verify anyway)
- [ ] App user has least privilege — no root in `.env`, no `GRANT ALL` ([security](../../../SECURITY_PERFORMANCE.md))
- [ ] Laravel: `DB_CONNECTION=mysql`, strict mode on (framework default)

## vs The Field

[MariaDB](../mariadb/MARIADB_ESSENTIALS.md) forked from MySQL 5.5 — compatible for common workloads but diverging (see its doc). Postgres comparison in [Database Design](../DATABASE_DESIGN.md). Default: MySQL for Laravel-ecosystem hosting ubiquity.

## See Also

- [Database Design](../DATABASE_DESIGN.md) · [SQL Cheat Sheet](../sql/SQL_CHEAT_SHEET.md)
- [MariaDB Essentials](../mariadb/MARIADB_ESSENTIALS.md)
