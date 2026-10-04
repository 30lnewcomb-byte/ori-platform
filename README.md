# Ori Platform

The open-source foundation for Ori: a user-owned AI platform with a professional web interface, Ori World, tools, and native learned intelligence.

## Design principles

- **User-owned:** Ori is built for the creator to own and control.
- **Truthful UI:** the interface reflects real system state; it never invents activity or capabilities.
- **Professional:** Intentional typography, spacing, hierarchy, accessibility, and responsive behavior.
- **Human:** approachable without becoming childish or gimmicky.
- **Technical:** powerful developer capabilities without exposing unnecessary complexity.
- **Calm:** important problems are clear without creating noise.
- **Iterative:** the system is tested, reviewed, and improved continuously.
- **Technical ownership:** Ori's production intelligence is designed around Ori-owned TensorFlow/Keras models rather than a hosted inference provider.

## Current architecture

```text
apps/
  web/                 # Ori web application
  web/app/api/chat/    # server-side gateway to Ori intelligence

services/
  intelligence/        # private TensorFlow runtime
  intelligence/tensorflow_core/
                         # native TensorFlow/Keras models

packages/
  ui/                  # shared Ori design system
  typography/          # Ori type family and font tooling
  shared/              # shared types and utilities

world/
  README.md            # Ori World design and implementation boundary

docs/
  design/              # design decisions and standards
```

`ori-platform` is the main product repository. **OriOS Lite is intentionally separate** and is not a dependency of this repository.

## Ori World

Ori World is a small, purpose-built working environment for Ori. It is designed around code, files, tests, experiments, and other controlled work that Ori actually needs. It is not intended to be a generic hosted sandbox product or a required paid service.

The current web route remains `/sandbox` because the route predates the product name; the user-facing navigation label is **Ori World everywhere**. The server-side VM connection layer is now prepared through `apps/web/lib/ori-vm.ts`; full chat/tool orchestration remains a separate integration step.

## Product boundaries

The **Ori Developer Platform** now lives in its own repository and Vercel project. This repository is intentionally focused on the user-facing Ori workspace: Home, Chat, account onboarding, conversation persistence, intelligence access, and controlled runtime integrations.

Developer projects, API credentials, model/tool administration, activity, and developer documentation belong to the separate Developer Platform product.

## UI direction

Ori's current primary navigation is intentionally small:

**Home → Chat**

The overflow menu provides access to the **About Ori** reference and **Developer Platform**. This keeps the everyday assistant experience focused on capabilities that have real behavior behind them.

Home is the app workspace for starting work and understanding the current product. Chat is where the user works with Ori and manages conversations. Search, Projects, Tasks, Activity, and broad Settings controls remain longer-term product surfaces and are deliberately not exposed as primary navigation until their underlying functionality is real. Ori World is a planned controlled work environment and is documented separately.

## Typography

An original **Ori Text starter font** is now shipped at `apps/web/public/fonts/OriText-Regular.woff2` and loaded by the web app. The app currently reuses that original starter glyph set for the Ori Display and Ori Mono roles while the dedicated designs are refined.

Planned families:

- **Ori Display** — branding and major headings
- **Ori Text** — UI, chat, and documentation
- **Ori Mono** — code, logs, and technical data

## Intelligence

The production intelligence boundary is now **Ori's private TensorFlow runtime**. The Vercel app calls the runtime over an authenticated server-to-server API; the browser never receives the runtime credential.

The runtime exposes stable endpoints for model discovery, health, prediction, and future generative chat:

- `GET /v1/status`
- `GET /v1/models`
- `POST /v1/predict`
- `POST /v1/chat`

The current `ori-core` model is a real trainable TensorFlow/Keras text classifier. It is the first native learned component, not a scripted rule system. A separate trained generative TensorFlow model will plug into the same runtime contract when available.

## Configuration

Use `.env.example` as the reference for server-side configuration. Real credentials must never be committed. `ORI_INTELLIGENCE_API_KEY` is for the Vercel-to-runtime connection and must remain server-side.

## Status

The live product is deliberately focused on Home and Chat. Chat now has local browser history, New Chat, automatic titles, reopening, and deletion.

The native TensorFlow runtime boundary and first learned models are in place. Complete Ori World orchestration remains in development. Developer projects, API credentials, model/tool administration, and developer documentation are maintained in the separate Developer Platform repository.


## Ori VM connection

The platform owns a server-side wrapper for the Render-hosted Ori VM at `apps/web/lib/ori-vm.ts`. The browser never receives the VM credential.

The wrapper supports:
- authenticated VM status, execution, and workspace operations
- an unauthenticated wake request at the VM's `/v1/wake` endpoint
- a committed-intent prewarm gate via `prewarmOriVmForIntent()`

Prewarm must not be driven by raw model thoughts, keywords, or speculative tool candidates. Ori should only mark an `OriVmIntent` as committed after orchestration has selected the VM as the concrete execution mechanism. This lets Render startup overlap with the remainder of planning without waking the service for every speculative thought.
