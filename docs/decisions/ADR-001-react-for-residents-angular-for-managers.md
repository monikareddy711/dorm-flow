# ADR-001: React for Residents and Angular for Management

## Status
Accepted

## Context
DormFlow Aachen serves two distinct user personas with fundamentally different interaction requirements:
1. **Residents (Students):** High mobile usage (phones), fast load requirements, form-driven maintenance reporting, subscription to issues, and public comment participation.
2. **Dormitory Managers & Technicians:** Desktop/laptop usage, data-dense tabular views, operational KPI monitoring, multi-attribute filtering, state-machine transitions, and internal note taking.

Rather than building duplicate interfaces or choosing one framework arbitrarily, the system needed a legitimate architectural separation.

## Decision
- **Student Portal:** Built with React 18, Vite, TypeScript, and SCSS modules. Demonstrates lightweight, mobile-first, component-driven reactive UX.
- **Manager Dashboard:** Built with Angular 17+ standalone components, Angular Router, Reactive Forms, and RxJS services. Demonstrates enterprise architecture, opinionated dependency injection, and complex data filtering.

## Consequences
- **Positive:** Both major frontend frameworks are used according to their natural domain strengths. Clear separation of concerns and independent deployment cycles.
- **Trade-off:** Maintaining two frontend build configurations. Mitigated by sharing design tokens and shared TypeScript type packages in the monorepo.
