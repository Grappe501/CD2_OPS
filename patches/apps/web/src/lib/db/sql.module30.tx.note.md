# Module 30 NOTE: sql.tx helper

The callflow endpoint uses `sql.tx(async (t)=>...)`.

If your sql helper already supports transactions, map:
- `sql.tx(fn)` -> begins transaction, passes a transaction client `t` with one/none/any methods.

If not, implement a minimal `tx` wrapper on your Postgres client.

