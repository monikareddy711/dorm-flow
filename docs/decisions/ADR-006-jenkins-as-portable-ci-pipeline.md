# ADR-006: Jenkins as Portable Secondary CI Pipeline

## Status
Accepted

## Context
Enterprise environments often utilize self-hosted Jenkins agents alongside cloud Git platforms. Demonstrating CI portability validates that builds do not depend on proprietary CI vendor lock-in.

## Decision
Provide a declarative `Jenkinsfile` executing:
- Checkout
- Dependency caching
- Linting
- Unit and integration tests
- Production compilation
- Multi-stage Docker image builds
- Test report archiving

## Consequences
- Demonstrates enterprise DevOps readiness across multiple industry-standard CI systems.
