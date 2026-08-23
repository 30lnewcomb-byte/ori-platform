# Ori Intelligence Service

This is the integration boundary for Ori's intelligence architecture.

## Current architecture

- **TensorFlow core** is Ori's primary learned intelligence.
- **Mentor** is a supporting language-model layer for language understanding, task structuring, planning assistance, and evaluation.
- **Orchestrator** decides when and how these components interact.

The architecture is defined in `docs/architecture/intelligence.md` and is intentionally provider/model agnostic at the integration boundary.

## Current state

The web app is not connected to a live model yet. This folder establishes the interface before credentials, model endpoints, or production inference are wired in.

## Planned request flow

```text
User message
    ↓
Platform API
    ↓
Intelligence Orchestrator
    ├── TensorFlow Core
    └── Mentor
    ↓
Memory / Tools / Ori World as needed
    ↓
User-facing response
```

## Rule

Do not claim live intelligence until an actual model connection exists and its health/status can be verified.
