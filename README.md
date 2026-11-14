# Ori Platform

The open-source foundation for Ori: a user-owned AI platform with a professional web interface, tools, and native learned intelligence.

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

The **Ori Developer Platform** now lives in its own repository and Vercel project. This repository is intentionally focused on the user-facing Ori workspace: Home, Chat, account onboarding, conversation persistence, intelligence access, and controlled runtime integrations.

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

The native TensorFlow runtime boundary and first learned models are in place. The VM integration remains a separate capability with its own runtime and permission boundaries. Developer projects, API credentials, model/tool administration, and developer documentation are maintained in the separate Developer Platform repository.


## Ori VM connection

The platform owns a server-side wrapper for the Render-hosted Ori VM at `apps/web/lib/ori-vm.ts`. The browser never receives the VM credential.

**Hosting notice:** Ori Platform depends on Render-hosted services for intelligence and VM capabilities. If a supporting service is starting, unavailable, or under maintenance, the related capability may be temporarily unavailable while other parts of the platform remain accessible. The app displays this notice globally and links to the public Ori status page.

The wrapper supports:
- authenticated VM status, execution, and workspace operations
- an unauthenticated wake request at the VM's `/v1/wake` endpoint
- a committed-intent prewarm gate via `prewarmOriVmForIntent()`

Prewarm must not be driven by raw model thoughts, keywords, or speculative tool candidates. Ori should only mark an `OriVmIntent` as committed after orchestration has selected the VM as the concrete execution mechanism. This lets Render startup overlap with the remainder of planning without waking the service for every speculative thought.
