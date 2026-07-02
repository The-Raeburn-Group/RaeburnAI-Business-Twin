# Database adapter

RaeburnAI Business Twin supports three storage modes through `RAEBURN_STORAGE_DRIVER`:

- `json` for local development and demos.
- `postgres` for production relational storage.
- `supabase` for production Supabase-backed storage.

## Required environment

```bash
RAEBURN_STORAGE_DRIVER=postgres
RAEBURN_DATABASE_HTTP_URL=https://example.internal/db-adapter
RAEBURN_DATABASE_SERVICE_TOKEN=replace-me
```

For Supabase, use the same adapter contract and point `RAEBURN_DATABASE_HTTP_URL` at an edge function or internal API that exposes the operations below.

## Adapter contract

The application sends JSON POST requests:

```json
{
  "query": "select_twins",
  "variables": {}
}
```

Supported operations:

- `select_twins`
- `get_twin` with `{ "id": "..." }`
- `upsert_twin` with `{ "twin": { ... } }`

The adapter must return:

```json
{ "data": [] }
```

or for single item operations:

```json
{ "data": { "id": "demo-twin" } }
```

## Suggested table

```sql
create table business_twins (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Security notes

- Keep service tokens server-side only.
- Use row-level security for tenant-aware deployments.
- Encrypt backups.
- Do not expose the database adapter publicly without authentication.
