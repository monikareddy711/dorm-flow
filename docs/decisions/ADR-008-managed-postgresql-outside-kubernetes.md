# ADR-008: Managed PostgreSQL Database Outside Kubernetes

## Status
Accepted

## Context
Running stateful relational databases inside Kubernetes worker nodes introduces operational complexities regarding persistent volume attachment, failover, quorum management, point-in-time recovery, and OS patching.

## Decision
For production cloud environments, decouple the database from Kubernetes:
- Use Azure Database for PostgreSQL Flexible Server (or Amazon RDS for AWS).
- Kubernetes pods connect securely over TLS with credentials retrieved from Azure Key Vault / Kubernetes Secrets.
- Local development continues to use Docker Compose with containerized Postgres for fast developer iteration.

## Consequences
- Guaranteed automated cloud backups, automated high availability, and reduced operational failure points.
