# Contributing

Thank you for helping improve RaeburnAI Business Twin.

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Quality checks

Run all checks before opening a pull request:

```bash
pnpm lint
pnpm format
pnpm typecheck
pnpm test
pnpm build
```

Docker check:

```bash
docker build -t raeburnai-business-twin .
```

## Pull requests

Please include:

- Clear description of the change.
- Tests for domain, API or security-control changes.
- Documentation updates when behaviour changes.
- No committed secrets, local data files or generated build output.

## Good first contribution areas

- Document parsers.
- Supabase storage adapter.
- Scenario templates.
- Workflow visualisation.
- KPI importers.
- Auth and RBAC implementation.
- CodeQL and dependency review workflow hardening.
