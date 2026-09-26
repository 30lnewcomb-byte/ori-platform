# Ori Platform

The open-source foundation for Ori: a user-owned AI platform with a professional web interface, Ori World, a Developer Platform, tools, and native learned intelligence.

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

dev-platform/
  architecture.md      # Developer Platform architecture
  roadmap.md           # implementation roadmap
  docs/                # canonical Developer Docs source

world/
  README.md            # Ori World design and implementation boundary

docs/
  design/              # design decisions and standards
```

`ori-platform` is the main product repository. **OriOS Lite is intentionally separate** and is not a dependency of this repository.

## Ori World

Ori World is a small, purpose-built working environment for Ori. It is designed around code, files, tests, experiments, and other controlled work that Ori actually needs. It is not intended to be a generic hosted sandbox product or a required paid service.

The current web route remains `/sandbox` because the route predates the product name; the user-facing navigation label is **Ori World everywhere**. The execution environment is not connected yet.

## Developer Platform

The Developer Platform is a first-class part of Ori Platform, but it is its **own product experience inside the same URL**. It has a dedicated developer shell, top-level tabs, workspace, and documentation experience while sharing the underlying Ori Platform.

The entry point lives in the normal Ori sidebar's **••• menu** near the bottom-left, keeping the primary assistant navigation focused on everyday Ori work. Entering Developer changes the interface into the specialized Developer Platform rather than opening a new browser tab.

The canonical Developer Docs source lives under `dev-platform/docs/`. The Next.js route under `apps/web/app/developer/docs/` is only the web presentation layer.

The platform and its documentation must clearly distinguish implemented capabilities from planned work.

## UI direction

Ori's primary navigation is:

**Home → Chat → Search → Projects → Tasks → Activity → Ori World → Settings**

The Developer Platform is intentionally accessed outside that primary list through the overflow menu. Desktop uses a persistent sidebar. Mobile/compact navigation is a later polish pass and should not change the canonical destination set.

Home is the app workspace for starting and resuming work, not a marketing landing page. Chat is where the user works with Ori. Projects organize work. Tasks track substantial work. Activity shows system events. Search finds work. Ori World represents where Ori will perform controlled work. Developer is a separate in-app workspace for developer work. Settings contains configuration.

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

The web platform and Developer Platform are being stabilized while the native TensorFlow runtime is being connected. The runtime boundary, model registry contract, and first TensorFlow core are now in place.
