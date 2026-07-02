# Deployment

## Required services

- Node.js 22 or container hosting.
- Managed Postgres or Supabase for production persistence.
- Private object storage for uploaded company documents.
- Centralised logs and alerting.
- TLS at the hosting provider or load balancer.
- Authentication before exposing customer data.

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

## Notes

1. Build the Docker image in CI.
2. Run as the non-root app user.
3. Mount a writable data volume only where required.
4. Configure rate limits for expected traffic.
5. Forward JSON logs to the platform log sink.
6. Put the app behind an identity-aware proxy until native auth is implemented.

## Known blockers

- JSON storage is for local demo and development only.
- Native auth and RBAC are not yet implemented.
- Document parsing currently registers documents but does not extract entities.
- CodeQL and dependency review should be enabled manually if connector writes are blocked.
