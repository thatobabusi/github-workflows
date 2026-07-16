# MongoDB Essentials

The document database: schema by design decision, not by accident. Relational rules live in [Database Design](../DATABASE_DESIGN.md); this is the different mental model.

## When Mongo (honestly)

| Situation | Verdict |
|-----------|---------|
| Document-shaped data (content, catalogs, event payloads, profiles) | Good fit |
| Rapid iteration where shape genuinely varies per record | Good fit |
| Financial/relational integrity, many-to-many joins, reporting | **Postgres/MySQL** — transactions and joins are their home game |
| "NoSQL because scale" on a CRUD app | No — relational scales further than your app will |

Schemaless ≠ schema-free: the schema moves from the database into your code. Undisciplined, that's worse.

## The Model: Embed vs Reference

The design decision that replaces normalization:

```javascript
// EMBED: data owned by, and read with, the parent (1:few)
{
  _id: ObjectId("..."),
  reference: "ORD-1042",
  user_id: ObjectId("..."),          // REFERENCE: shared/unbounded relations
  status: "pending",
  lines: [                            // embedded — always loaded with the order
    { product_id: 7, name: "Widget", qty: 2, cents: 4500 },
  ],
  created_at: ISODate("2026-07-16")
}
```

Rules of thumb:

- **Embed** what you read together and what belongs to one parent (order lines, address on profile)
- **Reference** what's shared (users), unbounded (comments in the thousands), or independently queried
- 16MB document cap — unbounded arrays are the classic design failure
- Data read together lives together — model around access patterns, not entities

## Query Cheat Sheet (mongosh)

```javascript
db.orders.find({ status: "pending", "lines.cents": { $gt: 1000 } })
         .sort({ created_at: -1 }).limit(20)

db.orders.updateOne(
    { _id: id },
    { $set: { status: "shipped" }, $push: { events: { at: new Date(), type: "shipped" } } }
)

// Upsert — the idempotency workhorse
db.settings.updateOne({ user_id: 42, key: "theme" },
                      { $set: { value: "dark" } }, { upsert: true })

// Aggregation pipeline = SQL GROUP BY/JOIN territory
db.orders.aggregate([
    { $match: { status: "completed" } },
    { $unwind: "$lines" },
    { $group: { _id: "$user_id", lifetime: { $sum: "$lines.cents" }, n: { $sum: 1 } } },
    { $sort: { lifetime: -1 } }, { $limit: 20 },
])
```

## Indexing (same discipline, same tools)

```javascript
db.orders.createIndex({ user_id: 1, created_at: -1 })   // equality first, then sort
db.orders.createIndex({ "lines.product_id": 1 })        // multikey (into arrays)
db.sessions.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 })  // TTL cleanup
db.users.createIndex({ email: 1 }, { unique: true })

db.orders.find({...}).explain("executionStats")          // COLLSCAN = the Seq Scan red flag
```

The [indexing rules](../DATABASE_DESIGN.md) transfer wholesale: index what you filter/sort, composite order matters, every index taxes writes.

## Schema Discipline Without Schemas

- **Validation at the boundary:** Mongoose schemas (Node), Pydantic/Beanie (Python), `$jsonSchema` validators in the DB itself for the critical collections
- Version documents (`schema_version: 2`) and migrate lazily on read, or batch-migrate — shape drift is Mongo's technical debt
- Same [money rule](../DATABASE_DESIGN.md): integer cents, never floats

## Transactions & Consistency

- Single-document updates are atomic — good embedding often removes the need for transactions
- Multi-document ACID transactions exist (replica set required) — use for real invariants, at a performance cost
- Read/write concerns (`majority`) are the durability dials — defaults are fine until they aren't; know they exist

## Ops Notes

```bash
mongosh "mongodb://localhost:27017/appdb"
mongodump --db appdb --archive=backup-$(date +%F).gz --gzip
mongorestore --archive=backup.gz --gzip
```

- Replica sets are the unit of production (even single-node dev benefits — enables transactions)
- Atlas = the managed default; self-host only with a reason
- Auth ON always — historical "open Mongo on 27017" breaches were all default-config ([security baseline](../../../SECURITY_PERFORMANCE.md))

## See Also

- [Database Design](../DATABASE_DESIGN.md) — when relational wins
- [Node Essentials](../../backend/node/NODE_ESSENTIALS.md) — Mongo's most common pairing
