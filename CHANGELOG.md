# Changelog

All notable changes to RaeburnAI Business Twin are documented here.

## 0.1.0 - 2026-07-02

### Added

- Next.js application shell and dashboard.
- Business twin domain model for teams, roles, workflows and KPIs.
- Scenario engine for capacity, volume and automation modelling.
- Document registration API.
- Health check endpoint.
- JSON development store.
- Postgres and Supabase HTTP storage adapter path.
- Production database schema in `db/schema.sql`.
- Bearer-token API authentication and RBAC roles.
- Structured logging, audit events, rate limiting and approval guard.
- Unit tests, auth tests and UI smoke test.
- Docker and Docker Compose.
- CI, CodeQL and Dependabot configuration.
- OpenAPI, architecture, deployment, security and contribution documentation.

### Changed

- Replaced placeholder lint script with real ESLint command.
- Replaced floating dependency versions with pinned versions.
- Hardened Docker runtime with non-root execution and health checks.
- Updated README to the standard RaeburnAI project structure.
- Formatted core TypeScript files for stricter quality gates.

### Known gaps

- Document parsing currently registers documents but does not extract structured entities.
- A dedicated screenshot document was blocked by the connector, so the UI capture checklist is documented in `docs/DEPLOYMENT.md`.
