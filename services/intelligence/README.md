# Ori Intelligence Service

This is the integration boundary for Ori's intelligence architecture.

## Current architecture

- **TensorFlow core** is Ori's primary learned intelligence.
- **Mentor** is a supporting language-model layer for language understanding, task structuring, planning assistance, and evaluation.
- **Orchestrator** decides when and how these components interact.

The architecture is defined in `docs/architecture/intelligence.md` and is intentionally provider/model agnostic at the platform boundary.

## Current state

The web chat is now wired to the Mentor boundary. The current web adapter uses Hugging Face's OpenAI-compatible Inference Providers endpoint when `HF_TOKEN` is configured. Hugging Face documents this endpoint and a free-tier inference offering.

The TensorFlow core is still not connected to production inference. That remains the next intelligence-engineering phase after the Mentor path is proven.

## Request flow

```text
User message
    ↓
Ori web chat
    ↓
/api/chat
    ↓
Mentor adapter
    ↓
Hugging Face Inference Providers
    ↓
Mentor response
    ↓
User-facing Ori response
```

The long-term flow remains:

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

## Configuration

Set these as environment variables, never in source control:

- `HF_TOKEN` — Hugging Face token with permission to make Inference Provider calls.
- `ORI_MENTOR_MODEL` — model identifier; the current default is `google/gemma-2-2b-it:fastest`.

## Rules

Do not claim live intelligence until the configured model connection is working and its health/status can be verified.

Do not expose provider-specific credentials to the browser. Keep inference credentials server-side.

Do not silently turn the Mentor into the permanent definition of Ori's core intelligence. It is the current supporting model adapter while the TensorFlow core is developed.
