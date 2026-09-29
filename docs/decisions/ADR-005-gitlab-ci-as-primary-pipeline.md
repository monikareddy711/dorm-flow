# ADR-005: GitLab CI as Primary CI/CD Pipeline

## Status
Accepted

## Context
A modern delivery workflow requires automated code quality checks, unit tests, Storybook checks, Docker packaging, and staging deployments tightly coupled to source code and merge requests.

## Decision
Configure `.gitlab-ci.yml` as the primary unified pipeline:
- Stages: install, lint, unit-test, integration-test, build, storybook-test, container-scan, docker-build, deploy-staging, smoke-test, deploy-production.
- Merge requests trigger automated linting and tests before merge gates.

## Consequences
- Single pane of glass for source control, issue tracking, and pipeline execution.
