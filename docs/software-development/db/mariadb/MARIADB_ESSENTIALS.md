# MariaDB Essentials

The MySQL fork that ships as the default "mysql" on most Linux distros and cPanel/shared hosting. Mostly compatible, deliberately diverging — this doc covers the differences that bite.

## Where You Meet It

- Debian/Ubuntu/RHEL `apt install mysql` → often MariaDB
- Shared hosting and cPanel almost universally
- Drop-in choice for [WordPress](../../backend/php/wordpress/WORDPRESS_ESSENTIALS.md) stacks

Everything in [MySQL Essentials](../mysql/MYSQL_ESSENTIALS.md), [Database Design](../DATABASE_DESIGN.md), and the [SQL Cheat Sheet](../sql/SQL_CHEAT_SHEET.md) applies unless listed below.

## Compatibility Reality (10.x vs MySQL 8)

| Area | Status |
|------|--------|
| Wire protocol, connectors, basic SQL | Compatible — apps generally just work |
| InnoDB internals | Diverged (MariaDB froze at a fork point, then went its own way) |
| JSON | **MariaDB: alias for LONGTEXT** + functions; MySQL: real binary JSON type |
| `utf8mb4` collations | MySQL's `utf8mb4_0900_ai_ci` **doesn't exist** in MariaDB — the classic dump-import failure |
| Replication | GTID implementations incompatible — can't mix engines in one replica set |
| Auth | MariaDB: `unix_socket` default on Linux; MySQL: `caching_sha2_password` |

**Version numbers are not comparable** — MariaDB 10.6/10.11/11.x ≠ MySQL 8.x. Check features per engine docs, not by number.

## The Collation Trap (most common migration failure)

```sql
-- MySQL 8 dump into MariaDB fails with:
-- ERROR 1273: Unknown collation: 'utf8mb4_0900_ai_ci'

-- Fix the dump:
sed -i 's/utf8mb4_0900_ai_ci/utf8mb4_unicode_ci/g' backup.sql

-- House standard that works on BOTH engines:
CREATE DATABASE appdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Targeting both engines (packages, portable apps): stick to `utf8mb4_unicode_ci` and avoid MySQL-8-only syntax.

## MariaDB Niceties MySQL Lacks

```sql
-- Real sequences (beyond AUTO_INCREMENT)
CREATE SEQUENCE invoice_seq START WITH 1000;
SELECT NEXTVAL(invoice_seq);

-- System-versioned tables — audit history for free
ALTER TABLE orders ADD SYSTEM VERSIONING;
SELECT * FROM orders FOR SYSTEM_TIME AS OF '2026-07-01 00:00:00';

-- RETURNING on INSERT/DELETE (10.5+)
DELETE FROM sessions WHERE expired = 1 RETURNING id;
```

Use with eyes open: each one deepens the lock-in to MariaDB specifically.

## Ops Notes

```bash
mariadb -u root -p appdb                 # CLI (mysql alias still works)
mariadb-dump --single-transaction appdb > backup.sql
```

- Tuning knob is the same: `innodb_buffer_pool_size`
- `unix_socket` auth means root login via `sudo mariadb` — password auth for app users as usual
- Laravel/Django connect via the mysql driver unchanged; set the collation explicitly in config

## Choosing Between Them

| Situation | Pick |
|-----------|------|
| You control the server, Laravel stack | [MySQL 8](../mysql/MYSQL_ESSENTIALS.md) — house default |
| Shared hosting / distro default already MariaDB | Stay — don't fight the platform |
| Need system-versioned tables/sequences | MariaDB, deliberately |
| Cross-engine portability required | Common subset + `utf8mb4_unicode_ci` |

## See Also

- [MySQL Essentials](../mysql/MYSQL_ESSENTIALS.md)
- [Database Design](../DATABASE_DESIGN.md) · [SQL Cheat Sheet](../sql/SQL_CHEAT_SHEET.md)
