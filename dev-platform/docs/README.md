# Ori Developer Docs

This directory is the canonical documentation source for Ori and the Ori Developer Platform.

The web experience is served through Next.js under `/developer/docs`. The Markdown files here remain the source of truth for product behavior, architecture, security boundaries, implementation status, and developer-facing contracts.

## Ori product reference

- `ori-overview.md` — what Ori is and what belongs in the product
- `chat.md` — conversation, New Chat, and local history
- `intelligence.md` — native TensorFlow intelligence
- `ori-world.md` — controlled work environment and VM boundary
- `architecture.md` — distributed system architecture
- `security.md` — browser, runtime, VM, and tool security boundaries
- `product-status.md` — what is live, in development, or intentionally parked
- `design.md` — Ori product and UI rules

## Developer Platform

- `platform-overview.md` — developer console and platform boundary
- `getting-started.md` — starting point for developers
- `api.md` — public API direction and internal runtime contract
- `authentication.md` — developer identity and credentials
- `projects.md` — project model
- `tools.md` — tool contracts and execution
- `models.md` — model and intelligence surface
- `sdk.md` — first-party SDK direction
- `status.md` — current platform status
- `guides/cloud-architecture.md` — practical architecture guide

## Documentation rule

Documentation must distinguish:

- **Live** — the behavior exists and is usable.
- **Internal** — the capability exists behind the Ori platform boundary but is not a public developer contract.
- **In development** — the design or implementation is actively being built.
- **Parked / not exposed** — the idea exists but is deliberately kept out of the product surface until the underlying behavior is ready.

A page existing in the repository does not, by itself, mean the capability is complete.
