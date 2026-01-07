# Module 29 NOTE: sql helper
These API routes import `@/lib/db/sql`.

If your repo already has it (likely from Module 3), do nothing.
If not, create a thin wrapper around your Postgres client that provides:

- `sql.one(query, params)` -> returns single row
- `sql.none(query, params)` -> executes no-return query
- `sql.any(query, params)` -> returns rows

Keep server-only. Never expose DB from client components.
