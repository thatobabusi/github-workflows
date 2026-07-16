# SQL Server Essentials

Microsoft SQL Server (T-SQL) — the corporate/.NET-shop standard you'll meet in enterprise work and [Azure](../../azure/AZURE_ESSENTIALS.md) migrations. Engine-agnostic rules in [Database Design](../DATABASE_DESIGN.md).

## Where You Meet It

- Enterprise clients, .NET estates, SSRS/SSIS reporting stacks
- Azure SQL Database (the managed flavor — most of this doc applies)
- Editions: Express (free, 10GB cap) for dev; Developer edition = full features, free, non-prod

## T-SQL Dialect Differences (coming from MySQL/Postgres)

```sql
-- TOP instead of LIMIT
SELECT TOP 20 * FROM orders ORDER BY created_at DESC;

-- Paging: OFFSET/FETCH (ORDER BY mandatory)
SELECT * FROM orders ORDER BY id
OFFSET 40 ROWS FETCH NEXT 20 ROWS ONLY;

-- Identifiers: [brackets]; strings: single quotes; NVARCHAR for Unicode
SELECT [order].[status] FROM [order];

-- Auto-increment
id BIGINT IDENTITY(1,1) PRIMARY KEY

-- Dates
GETDATE(), SYSUTCDATETIME(), DATEADD(day, -7, GETDATE()), DATEDIFF(day, a, b)

-- ISNULL / COALESCE; + concatenates (or CONCAT())
SELECT COALESCE(nickname, first_name) FROM users;

-- Upsert: MERGE exists but is bug-notorious — prefer:
UPDATE settings SET value = @value WHERE user_id = @uid AND [key] = @key;
IF @@ROWCOUNT = 0
    INSERT INTO settings (user_id, [key], value) VALUES (@uid, @key, @value);
```

Type mapping: `NVARCHAR(n)` (Unicode strings — default choice), `DATETIME2` (never legacy `DATETIME`), `BIT` (bool), `DECIMAL(19,4)` or integer cents for [money](../DATABASE_DESIGN.md) — avoid the legacy `MONEY` type.

## Indexes: Clustered Is the Table

- Each table has ONE **clustered index** = the physical row order (default: the PK). Sequential keys (IDENTITY) cluster well; random GUIDs fragment — use `NEWSEQUENTIALID()` if GUID keys are mandated
- **Nonclustered** indexes = the regular kind; `INCLUDE` columns build covering indexes:

```sql
CREATE NONCLUSTERED INDEX ix_orders_user
ON orders (user_id, created_at DESC)
INCLUDE (status, total_cents);        -- query served entirely from the index
```

- Execution plans: SSMS "Include Actual Execution Plan" (Ctrl+M) — watch for scans on hot paths and the missing-index hints (suggestions, not gospel)

## Locking & Isolation (the big operational difference)

Default READ COMMITTED uses **blocking locks** — readers block writers and vice versa, which surprises Postgres/MySQL-InnoDB people. The standard fix:

```sql
ALTER DATABASE appdb SET READ_COMMITTED_SNAPSHOT ON;   -- row-versioning like the others
```

(Azure SQL has it ON by default.) `WITH (NOLOCK)` sprinkled through legacy code = dirty reads, not a performance strategy — treat as debt.

## Ops Survival Kit

```sql
-- Backups (full + log; log backups require FULL recovery model)
BACKUP DATABASE appdb TO DISK = 'D:\backups\appdb.bak' WITH COMPRESSION;
RESTORE DATABASE appdb FROM DISK = 'D:\backups\appdb.bak';

-- What's running / blocking right now
SELECT r.session_id, r.status, r.blocking_session_id, t.text
FROM sys.dm_exec_requests r
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE r.session_id > 50;
```

Tools: SSMS (Windows), Azure Data Studio (cross-platform), `sqlcmd` CLI. Docker dev: `mcr.microsoft.com/mssql/server` ([compose pattern](../../docker/DOCKER_CHEAT_SHEET.md)).

## App Integration

- Laravel: `DB_CONNECTION=sqlsrv` + pdo_sqlsrv extension — works, second-class vs MySQL; migrations mostly portable
- .NET/EF Core is the native pairing; Python via pyodbc
- Azure SQL: connect with Entra ID (OIDC) over SQL auth where possible ([Azure Essentials](../../azure/AZURE_ESSENTIALS.md))

## See Also

- [Database Design](../DATABASE_DESIGN.md) · [SQL Cheat Sheet](../sql/SQL_CHEAT_SHEET.md)
- [Azure Essentials](../../azure/AZURE_ESSENTIALS.md)
