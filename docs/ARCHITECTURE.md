# Architecture

RaeburnAI Business Twin is organised around a clean domain core.

## Layers

1. App and API: Next.js pages and route handlers.
2. Domain: business twin models, KPI/workflow logic and scenario engine.
3. Storage: repository interface currently backed by local JSON for development.
4. Ingestion: document registration endpoint ready for parser and LLM enrichment.
5. Operations: Docker, CI, environment template and OpenAPI contract.

## Business twin graph

The graph links:

- Teams
- Roles
- Workflows
- KPIs
- Source documents
- Tools and dependencies

## Scenario engine

The first engine supports:

- Capacity change by role.
- Workflow volume change.
- Automation saving analysis.

The engine is deterministic so users can audit assumptions and test changes before introducing generative AI.

## Production extension points

- Replace JSON store with Postgres or Supabase.
- Add document parsing for PDF, DOCX, CSV and spreadsheet uploads.
- Add vector search for policy and SOP retrieval.
- Add permission model for teams and external consultants.
- Add job queue for long document ingestion.
