# Ori Platform

The user-facing Ori application: a chat workspace for conversations, saved chat history, account onboarding, and appearance preferences. It connects to Ori Intelligence through a server-side API.

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
  web/app/api/         # authenticated chat, conversation, preference, and integration routes

services/
  intelligence/        # legacy compatibility snapshot; not the production source of truth
  intelligence/tensorflow_core/
                         # legacy TensorFlow/Keras copy; see ori-intelligence repository

packages/
  ui/                  # shared Ori design system
  typography/          # Ori type family and font tooling
  shared/              # shared types and utilities

docs/
  design/              # design decisions and standards
```

`ori-platform` is the main product repository. **OriOS Lite is intentionally separate** and is not a dependency of this repository.

## Product boundaries

The **Ori Developer Platform** now lives in its own repository and Vercel project. This repository contains the user-facing Ori workspace: Chat, conversation history, account onboarding, appearance settings, intelligence access, and server-side runtime integrations.

Developer projects, API credentials, model/tool administration, activity, and developer documentation belong to the separate Developer Platform product.

## UI direction

Ori's current primary navigation is intentionally small:

**Home → Chat**

The overflow menu provides access to the **About Ori** reference and **Developer Platform**. This keeps the everyday assistant experience focused on capabilities that have real behavior behind them.

Home is the app workspace for starting work and understanding the current product. Chat is where the user works with Ori and manages conversations. Search, Projects, Tasks, Activity, and broad Settings controls remain longer-term product surfaces and are deliberately not exposed as primary navigation until their underlying functionality is real.

## Typography

An original **Ori Text starter font** is now shipped at `apps/web/public/fonts/OriText-Regular.woff2` and loaded by the web app. The app currently reuses that original starter glyph set for the Ori Display and Ori Mono roles while the dedicated designs are refined.

Planned families:

- **Ori Display** — branding and major headings
- **Ori Text** — UI, chat, and documentation
- **Ori Mono** — code, logs, and technical data

## Intelligence

The production intelligence boundary is the standalone **[ori-intelligence repository](https://github.com/30lnewcomb-byte/ori-intelligence)**, deployed independently on Render. The Vercel app calls that service over an authenticated server-to-server API; the browser never receives the runtime credential.

The older `services/intelligence/` tree in this repository is a legacy compatibility snapshot. It is not the source of truth for the production runtime and should not be used for routine model or runtime changes. Make intelligence-runtime changes in `ori-intelligence` so its Render deployment remains independent from Ori Platform's web deployments.

The runtime exposes these endpoints:

- `GET /health` — basic process health
- `GET /v1/status` — authenticated model-readiness status
- `GET /v1/models` — authenticated model registry
- `POST /v1/predict` — authenticated Ori Core intent classification
- `POST /v1/chat` — authenticated Ori Small language generation
- `POST /v1/title` — authenticated conversation-title generation

The current runtime uses two existing trained TensorFlow model artifacts: **Ori Core** for intent classification and **Ori Small** for language generation. These are loaded from saved checkpoints; normal service startup does not train models. Incremental fine-tuning is a separate, explicitly configured operation, and full from-scratch rebuilding is blocked unless two separate authorization switches are enabled.

The coding and 3D specialist worker interfaces exist in the runtime, but the latest observed production startup reported `workers=none`. They must not be described as loaded or available until their trained artifacts are present and readiness confirms them.

## Configuration

Use `.env.example` as the reference for server-side configuration. Real credentials must never be committed. `ORI_INTELLIGENCE_API_KEY` is for the Vercel-to-runtime connection and must remain server-side. `ORI_INTELLIGENCE_URL` identifies the standalone Render service.

## Status

The current workspace includes Chat, saved conversation history, automatic conversation titles, account onboarding, and appearance settings. Users can select System, Light, or Dark appearance and choose an accent color. Chat history is stored in the account database, with a browser cache for continuity.

The standalone TensorFlow runtime boundary and the existing Core and Small model checkpoints are in place. The VM integration remains a separate capability with its own runtime and permission boundaries. Developer projects, API credentials, model/tool administration, and developer documentation are maintained in the separate Developer Platform repository.

## Ori VM connection

The platform owns a server-side wrapper for the Render-hosted Ori VM at `apps/web/lib/ori-vm.ts`. The browser never receives the VM credential.

**Service dependencies:** Ori Platform uses separately hosted services for intelligence and VM capabilities. A Vercel deployment confirms the web application build; it does not confirm that those runtime services are available. The public Ori-AI status page provides point-in-time service checks.

The wrapper supports:
- authenticated VM status, execution, and workspace operations
- an unauthenticated wake request at the VM's `/v1/wake` endpoint
- a committed-intent prewarm gate via `prewarmOriVmForIntent()`

Prewarm must not be driven by raw model thoughts, keywords, or speculative tool candidates. Ori should only mark an `OriVmIntent` as committed after orchestration has selected the VM as the concrete execution mechanism. This lets Render startup overlap with the remainder of planning without waking the service for every speculative thought.
