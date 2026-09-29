# ADR-004: PostgreSQL for Relational Data Model

## Status
Accepted

## Context
Dormitory maintenance requests inherently possess relational structures:
- A User belongs to a Building and Room.
- An Issue belongs to a Building and a Creator, and optionally an Assignee.
- Comments and Status History events have foreign keys to Issues and Users.
- Strict referential integrity is required (e.g. deleting an issue cascades comments and history).

## Decision
Adopt PostgreSQL 16 as the primary persistent data store, with Prisma schema and migrations.

## Consequences
- Guaranteed ACID compliance and referential integrity.
- Rich querying capabilities for multi-faceted filters and operational aggregations.
