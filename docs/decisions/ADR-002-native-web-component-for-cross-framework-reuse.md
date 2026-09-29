# ADR-002: Native Web Component for Cross-Framework Reuse

## Status
Accepted

## Context
Dormitory councils, student associations (AStA), and external dormitory informational portals frequently need to embed live maintenance status widgets (e.g., showing elevator or laundry room status) on legacy PHP sites, Hugo static blogs, React apps, or Angular apps without bundling hundreds of kilobytes of framework overhead.

## Decision
Implement `<dormflow-issue-status>` using native Custom Elements v1 and Shadow DOM (Web Components standards). The component:
- Observes `issue-id` and `api-base-url` HTML attributes.
- Encapsulates its own styles in Shadow DOM so host CSS does not clash.
- Dispatches standard custom browser DOM events (`dormflow-open-issue`).
- Requires zero framework runtime.

## Consequences
- **Positive:** Can be dropped into any static HTML, WordPress, React, or Angular host environment seamlessly.
- **Trade-off:** Manual DOM rendering and attribute change handling without framework abstractions; mitigated by simple TypeScript state handling.
