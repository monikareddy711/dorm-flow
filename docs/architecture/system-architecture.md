# DormFlow Aachen: System Architecture

## Architecture Overview

```mermaid
graph TD
    ClientResident[Student / Resident Phone/Desktop] -->|HTTPS / REST| ReactPortal[React Student Portal: Vite/SCSS]
    ClientManager[Dormitory Manager Desktop] -->|HTTPS / REST| AngularDashboard[Angular Manager Dashboard]
    ExternalPartner[External Student Council Website] -->|Embeds| WebComponent[Native Web Component: dormflow-issue-status]
    
    ReactPortal -->|JSON REST API| NodeAPI[Node.js REST API]
    AngularDashboard -->|JSON REST API| NodeAPI
    WebComponent -->|JSON REST API| NodeAPI

    NodeAPI -->|Prisma ORM| Postgres[(PostgreSQL 16 Database)]
    
    subgraph Azure Cloud Infrastructure
        AKS[Azure Kubernetes Service Cluster]
        ACR[Azure Container Registry]
        KeyVault[Azure Key Vault]
        AzurePG[(Azure Database for PostgreSQL)]
        AppInsights[Azure Monitor & App Insights]
    end
```

## Data Lifecycle & Status State Machine

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : Resident submits report
    SUBMITTED --> REVIEWED : Manager triages urgency
    REVIEWED --> ASSIGNED : Technician assigned
    ASSIGNED --> IN_PROGRESS : Technician begins repair
    IN_PROGRESS --> RESOLVED : Repair tested & verified
    RESOLVED --> CLOSED : Resident/Manager confirms resolution
    SUBMITTED --> REJECTED : Out of scope / Invalid
    REVIEWED --> REJECTED : Duplicate / Tenant responsibility
```

## Security & Architecture Principles
1. **Zero Secret Leakage:** Environment variables and Kubernetes secrets keep database passwords and JWT signing keys out of Git.
2. **Server-Side Authorization:** While UI hides buttons, the Node.js API verifies `req.user.role` on all mutating endpoints (`PATCH /api/issues/:id/status`, `PATCH /api/issues/:id/assignment`).
3. **Structured Correlation:** Every request carries an `X-Correlation-Id` for log tracing across microservices.
