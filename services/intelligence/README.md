# Ori Intelligence Service

This is the integration boundary for Ori's intelligence architecture.

## Current architecture

- **TensorFlow core** is Ori's primary learned intelligence and now has a real Keras starter model under `tensorflow_core/model.py`.
- **Mentor** is a small supporting language-model layer. The current default is **Qwen3-0.6B** for language understanding, task structuring, planning assistance, and evaluation.
- **Orchestrator** decides when and how these components interact.

The architecture is intentionally provider/model agnostic at the platform boundary.

## Current state

The web chat is now wired to the Mentor boundary. The current web adapter uses Hugging Face's OpenAI-compatible Inference Providers endpoint when `HF_TOKEN` is configured. Provider availability and free-tier limits can change.

The TensorFlow core is being built alongside this working Mentor path. It is not yet Ori's future super model or the production intelligence core.

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
Qwen3-0.6B
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
User-facing Ori response
```

## Configuration

Set these as environment variables, never in source control:

- `HF_TOKEN` — Hugging Face token with permission to make Inference Provider calls.
- `ORI_MENTOR_MODEL` — model identifier; current default is `Qwen/Qwen3-0.6B`.

## Rules

Do not claim live intelligence until the configured model connection is working and its health/status can be verified.

Do not expose provider-specific credentials to the browser. Keep inference credentials server-side.

Do not silently turn the Mentor into the permanent definition of Ori's core intelligence. It is the current supporting model adapter while the TensorFlow core is developed.
