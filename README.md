# DormFlow Aachen

> **Dormitory Maintenance and Shared-Facility Management Enterprise Platform**  
> A responsive web application enabling students in Aachen dormitories to report room or facility issues, avoid duplicate reports, follow repair progress, and communicate with facility management.

---

## Executive Summary

- **Problem:** Students in Aachen university dormitories (Kastanienweg, Eckertweg, Halifaxstraße, Mattschö-Moll-Weg) face fragmented maintenance communication (untracked emails, WhatsApp groups, hallway chats). Residents cannot see whether a shared washing machine or heating breakdown has already been reported, while facility managers spend hours consolidating duplicate reports.
- **Solution:** DormFlow delivers a **React-based Student Portal**, an **Angular-based Manager Dashboard**, a **framework-independent native Web Component**, a **Node.js REST API with Prisma ORM**, containerized multi-stage **Docker deployments**, dual **GitLab CI/CD & Jenkins** pipelines, **Kubernetes manifests**, and target **Azure Cloud** infrastructure.

---

## Architecture & Monorepo Structure

```
dormflow-aachen/
├── apps/
│   ├── student-portal-react/        # React 18, Vite, SCSS Modules, React Router
│   ├── manager-dashboard-angular/   # Angular 17+ Standalone Components, RxJS, Reactive Forms
│   └── api-node/                    # Node.js, Express, Prisma ORM, JWT, OpenAPI
├── packages/
│   ├── dormflow-web-components/     # Native Custom Element (<dormflow-issue-status>), Shadow DOM
│   ├── ui-react/                    # Accessible UI Component Library & Storybook
│   ├── shared-types/                # Shared TypeScript contracts, Enums, DTOs
│   └── design-tokens/               # SCSS variables, mixins, CSS Custom Properties
├── infrastructure/
│   ├── docker/                      # Multi-stage Dockerfiles (non-root) & Nginx configs
│   ├── kubernetes/                  # Namespace, Deployments, Services, Ingress, HPA
│   ├── azure/                       # Azure Bicep IAC (AKS, ACR, Postgres Flexible, Key Vault)
│   └── aws-mapping/                 # Cloud equivalence mapping (Azure to AWS)
├── docs/
│   ├── architecture/                # System architecture diagrams & workflows
│   ├── api/                         # OpenAPI 3.0 specification
│   ├── decisions/                   # Architecture Decision Records (ADR-001 - ADR-008)
│   └── confluence-export/           # Agile epics, sprint breakdown & retrospectives
├── .gitlab-ci.yml                   # 11-stage primary GitLab CI/CD pipeline
├── Jenkinsfile                      # Portable secondary Jenkins pipeline
├── docker-compose.yml               # Local development stack (PostgreSQL + API + Frontends)
└── README.md
```

---

## Technology Stack Matrix

| Area | Technology | Architectural Role in DormFlow |
| :--- | :--- | :--- |
| **Student Portal** | **React 18 + Vite** | Mobile-first resident interface, duplicate ticket detection, live comments, WCAG 2.1 AA accessibility down to 360px viewport |
| **Manager Dashboard** | **Angular 17+** | Enterprise administrative console, standalone components, RxJS data streams, route guards, multi-faceted filtering & status state machine |
| **Cross-App Integration** | **Native Web Component** | Framework-neutral `<dormflow-issue-status>` with Shadow DOM; runs in plain HTML, React, and Angular |
| **Backend REST API** | **Node.js + Express/NestJS** | REST endpoints, JWT authentication, role guards, correlation IDs (`X-Correlation-Id`), input validation |
| **ORM & Database** | **Prisma + PostgreSQL 16** | Relational data integrity, schema migrations, seed scripts, relational cascade policies |
| **Design System** | **SCSS + Storybook 8** | Reusable design tokens, responsive breakpoints, accessible interactive UI stories |
| **Containerization** | **Docker & Docker Compose** | Multi-stage, lean, non-root production images; local microservice orchestration |
| **CI / CD** | **GitLab CI & Jenkins** | Multi-stage pipeline (lint, unit/integration test, Storybook, container scan, docker build, staging deploy) |
| **Cloud & Orchestration** | **Kubernetes & Azure** | AKS deployment manifests, Horizontal Pod Autoscaling (HPA), Ingress, Azure Bicep template + AWS Equivalence mapping |

---

## Demo User Accounts

All pre-seeded demo accounts use password: `Password123!`

| Role | Name | Email | Residence / Context |
| :--- | :--- | :--- | :--- |
| **Facility Manager** | Daniel Becker | `daniel@dormflow.rwth.de` | Central Management (Triage, Assign, Resolve) |
| **Technician** | Marcus Weber | `marcus@dormflow.rwth.de` | Sanitary & Heating Field Engineering Team |
| **Resident** | Lina Al-Mansoor | `lina@rwth-aachen.de` | Wohnheim Kastanienweg, Room 412 |
| **Resident Rep** | Noor El-Sayed | `noor@rwth-aachen.de` | Wohnheim Eckertweg (Turm), Room 1105 |

---

## Local Quickstart

### Option A: Docker Compose (Entire Stack)

```bash
# Clone the repository
git clone https://github.com/<your-github-username>/dormflow-aachen.git
cd dormflow-aachen

# Launch PostgreSQL, Node API, React Student Portal, and Angular Dashboard
docker compose up -d
```

- **React Student Portal:** `http://localhost:3000`
- **Angular Manager Dashboard:** `http://localhost:4200`
- **Node.js REST API & Docs:** `http://localhost:4000/api/docs`
- **API Health Check:** `http://localhost:4000/api/health`

### Option B: Local Node.js Development

```bash
# 1. Install workspace dependencies
npm install

# 2. Start backend REST API
npm run dev:api

# 3. Start React Student Portal (in another terminal)
npm run dev:react

# 4. Start Angular Manager Dashboard (in another terminal)
npm run dev:angular
```

---

## Reusable Web Component: `<dormflow-issue-status>`

A framework-agnostic Custom Element for embedding maintenance updates on external websites:

```html
<!-- Native HTML, React, Angular, or Vue -->
<dormflow-issue-status
  issue-id="iss-101"
  api-base-url="http://localhost:4000">
</dormflow-issue-status>

<script>
  // Listens across Shadow DOM boundary
  document.addEventListener('dormflow-open-issue', (e) => {
    console.log('User clicked issue:', e.detail.issueId, e.detail.title);
  });
</script>
```

- **Interactive Standalone Demo:** Open `packages/dormflow-web-components/demo/index.html` in any browser.
- **React Integration:** Route `/web-component-demo` inside `apps/student-portal-react`.
- **Angular Integration:** Route `/admin/web-component` inside `apps/manager-dashboard-angular`.

---

## CI/CD & Cloud Infrastructure

### GitLab CI/CD Pipeline Stages
1. `install`: Dependency installation with caching
2. `lint`: ESLint and style validation
3. `unit-test`: Isolated component & logic tests
4. `integration-test`: Backend API route tests
5. `build`: Production builds for React, Angular, and Node.js
6. `storybook-test`: UI component interaction tests
7. `container-scan`: Dependency and container vulnerability scan
8. `docker-build`: Multi-stage Docker image packaging
9. `deploy-staging`: Automated deployment to AKS Staging
10. `smoke-test`: Staging health check validation
11. `deploy-production`: Manual gate promotion to Production AKS

### Jenkins Pipeline
A secondary declarative `Jenkinsfile` provides a portable, self-hosted CI pipeline demonstrating platform neutrality.

### Cloud Architecture & AWS Equivalence
- Implemented via Azure Bicep (`infrastructure/azure/main.bicep`).
- Full cross-cloud mapping provided in `infrastructure/aws-mapping/aws-mapping.md`:
  - Azure Kubernetes Service (AKS) ⇄ Amazon EKS
  - Azure Container Registry (ACR) ⇄ Amazon ECR
  - Azure Database for PostgreSQL ⇄ Amazon RDS for PostgreSQL
  - Azure Key Vault ⇄ AWS Secrets Manager
  - Azure Monitor / Application Insights ⇄ Amazon CloudWatch

---

## Architecture Decision Records (ADRs)

Documented in `docs/decisions/`:
- **ADR-001:** React for Residents & Angular for Facility Management
- **ADR-002:** Native Web Component for Cross-Framework Reuse
- **ADR-003:** Node.js REST API with Prisma ORM and TypeScript
- **ADR-004:** PostgreSQL Relational Data Model
- **ADR-005:** GitLab CI as Primary Pipeline
- **ADR-006:** Jenkins as Portable Secondary CI Pipeline
- **ADR-007:** Azure Cloud Target Architecture with AWS Equivalence Mapping
- **ADR-008:** Managed PostgreSQL Database Outside Kubernetes

---

## Author

**Monika Sompuram**  
Email: [monikareddy711@gmail.com](mailto:monikareddy711@gmail.com)  
Project: DormFlow Aachen
