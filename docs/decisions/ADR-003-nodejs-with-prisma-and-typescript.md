# ADR-003: Node.js REST API with Prisma ORM and TypeScript

## Status
Accepted

## Context
The backend needed to serve RESTful endpoints, enforce strict role-based access control (Resident, Manager, Technician), sanitize inputs, provide correlation IDs for logging, and document endpoints with OpenAPI 3.0.

## Decision
Build the backend API using Node.js, Express/NestJS architecture patterns, TypeScript, and Prisma ORM. 
- Strict typing shared across monorepo packages.
- JWT bearer tokens for stateless authentication.
- Centralized error-handling middleware with structured responses.
- X-Correlation-ID logging for distributed tracing.

## Consequences
- Single language across frontend, backend, and build scripts.
- Type-safe database queries prevent SQL injection by design.
