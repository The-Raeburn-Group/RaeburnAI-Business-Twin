# Security Policy

Please report security issues privately by opening a GitHub security advisory or contacting the maintainers.

## Supported versions

The `main` branch is the supported development line until the first stable release.

## Security principles

- Validate all API inputs with schemas.
- Keep document ingestion auditable.
- Do not store secrets in the repository.
- Prefer least privilege for production deployments.
- Treat uploaded company documents as confidential data.

## Production recommendations

- Use managed Postgres with encryption at rest.
- Add authentication before exposing the app publicly.
- Store files in private object storage.
- Enable request logging and alerting.
- Run dependency scanning in CI.
