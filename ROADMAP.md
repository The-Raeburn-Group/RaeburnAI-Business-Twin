# Roadmap

## Phase 1: Production foundation

- Pinned dependencies.
- Real lint, format, typecheck, test and build commands.
- Docker and Compose deployment.
- Structured logging and safe error handling.
- Health checks.
- Audit logging and approval guard.

## Phase 2: Enterprise data layer

- Replace JSON storage with Postgres or Supabase.
- Add migrations and seed scripts.
- Add object storage for uploaded documents.
- Add backups and restore testing.

## Phase 3: Authentication and permissions

- Add organisation accounts.
- Add RBAC for owners, admins, analysts and viewers.
- Add API keys for service integrations.
- Add tenant-aware audit trails.

## Phase 4: Document intelligence

- Add PDF, DOCX, CSV and spreadsheet parsers.
- Add entity extraction for roles, processes, KPIs, tools and risks.
- Add human review before extracted changes update the twin.

## Phase 5: Commercial readiness

- Add hosted deployment guide.
- Add billing integration.
- Add customer onboarding flow.
- Add enterprise export and reporting.

## Explicit TODOs

- Add CodeQL workflow manually if the GitHub connector blocks workflow writes.
- Add dependency review or Dependabot manually if connector safety checks block the config.
- Implement production auth before exposing sensitive customer data.
