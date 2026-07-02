# Deployment

## Required services

- Node.js 22 or container hosting.
- Managed Postgres or Supabase for production persistence.
- Private object storage for uploaded company documents.
- Centralised logs and alerting.
- TLS at the hosting provider or load balancer.
- API authentication enabled with a strong bearer token.

## Local production check

```bash
pnpm install
pnpm lint
pnpm format
pnpm typecheck
pnpm test
pnpm build
docker build -t raeburnai-business-twin .
docker compose up --build
```

## Environment

Start from `.env.example`. Do not commit real secrets.

Production settings:

```bash
RAEBURN_AUTH_ENABLED=true
RAEBURN_API_TOKEN=replace-with-secret
RAEBURN_STORAGE_DRIVER=supabase
RAEBURN_DATABASE_HTTP_URL=https://your-database-adapter.example.com
RAEBURN_DATABASE_SERVICE_TOKEN=replace-with-secret
```

## Auth and RBAC

When `RAEBURN_AUTH_ENABLED=true`, API requests must include:

```text
Authorization: Bearer <RAEBURN_API_TOKEN>
X-Raeburn-Role: viewer | analyst | admin | owner
```

Minimum roles:

- `viewer`: read twins.
- `analyst`: run scenarios.
- `admin`: create twins and register documents.
- `owner`: full access.

## Storage

`RAEBURN_STORAGE_DRIVER=json` is for local demos. Production should use `postgres` or `supabase` with `RAEBURN_DATABASE_HTTP_URL` and `RAEBURN_DATABASE_SERVICE_TOKEN`.

The HTTP database adapter expects these operations:

- `select_twins`
- `get_twin`
- `upsert_twin`

## Notes

1. Build the Docker image in CI.
2. Run as the non-root app user.
3. Mount a writable data volume only where required.
4. Configure rate limits for expected traffic.
5. Forward JSON logs to the platform log sink.
6. Rotate API tokens and database service tokens.

## UI capture checklist

The app includes a dashboard UI. Before public launch, capture and add images under `docs/assets/` for:

- Landing dashboard.
- Scenario result panel.
- Workflow cost ranking panel.
- API health response.

## Known blockers

- Document parsing currently registers documents but does not extract entities.
- A dedicated screenshots document was blocked by the connector, so the capture checklist is included here.
