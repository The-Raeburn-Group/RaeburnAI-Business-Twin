# RaeburnAI Business Twin

Open-source platform for building a live digital twin of a company from policies, org charts, KPIs and process documents.

Users can ask questions such as:

- What happens if we lose 3 recruiters?
- Which workflow costs the most?
- Where are the highest automation opportunities?

## Features

- Next.js and TypeScript application.
- Organisation twin domain model.
- Workflow cost and bottleneck analysis.
- Scenario simulation engine.
- Document ingestion abstraction.
- API routes for twins, documents and scenarios.
- Docker, CI, tests and open-source governance files.

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Scripts

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

## Docker

```bash
docker compose up --build
```

## API

See `openapi.yaml`.

## Architecture

See `docs/ARCHITECTURE.md`.

## Licence

Apache-2.0.