# Agile Project Management: Sprints & Retrospectives

## Project Epics & Traceability
- **EPIC-1: Project Foundation & Architecture** (Monorepo, TypeScript baseline, Docker Compose)
- **EPIC-2: Authentication & Role-Based Authorization** (JWT, BCrypt, Resident & Manager guards)
- **EPIC-3: Resident Maintenance Reporting Portal** (React 18, Vite, SCSS, Duplicate detection, Mobile viewport)
- **EPIC-4: Manager Triage & Facility Workflow** (Angular 17+, Standalone components, Reactive forms, RxJS, Status transitions)
- **EPIC-5: Design System & Storybook Documentation** (Design tokens, SCSS mixins, reusable UI components)
- **EPIC-6: Native Web Component Integration** (Custom Elements, Shadow DOM, cross-framework events)
- **EPIC-7: Cloud-Native DevOps & CI/CD** (GitLab CI, Jenkinsfile, Kubernetes manifests, Azure Bicep)
- **EPIC-8: Quality Assurance, Security & Retrospectives** (Automated tests, accessibility WCAG 2.1 AA, ADRs)

## Sprint Breakdown (Simulated 4 Two-Week Sprints)
### Sprint 1: Foundation & Data Architecture
- Defined domain model with Prisma schema (User, Building, Issue, Comment, History, Follower).
- Established monorepo npm workspaces and SCSS design tokens.
- Implemented JWT auth endpoints and Docker Compose with PostgreSQL 16.

### Sprint 2: Core Resident Workflow & UI Component Library
- Built React Student Portal with mobile-first viewport support (360px).
- Added duplicate issue detection to prevent redundant maintenance tickets.
- Implemented reusable React UI components with Storybook stories.

### Sprint 3: Manager Dashboard & Web Component
- Developed Angular 17+ standalone dashboard with RxJS state pipelines.
- Built lifecycle status transitions and technician assignment workflows.
- Implemented framework-neutral `<dormflow-issue-status>` Custom Element and tested in plain HTML, React, and Angular.

### Sprint 4: CI/CD Pipelines, Kubernetes & Cloud Hardening
- Authored multi-stage Dockerfiles with non-root security.
- Created complete GitLab CI pipeline and secondary Jenkins pipeline.
- Defined Kubernetes manifests (Deployment, Service, Ingress, HPA) and Azure Bicep cloud infrastructure.
- Documented ADR-001 through ADR-008 and AWS service-equivalence mapping.

## Retrospective Insights
- **Cross-Framework Integration:** Developing the Web Component with native browser standards allowed clean re-use across both the React portal and Angular dashboard without duplication or bundle bloat.
- **Data Validation:** Enforcing validations and role checks at the REST API level ensured consistent business rule application regardless of whether requests originated from React, Angular, or direct API calls.
