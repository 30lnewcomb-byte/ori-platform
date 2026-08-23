# Ori Platform

The open-source foundation for Ori: a user-owned AI platform with a professional web interface, Ori World, a Developer Platform, tools, and future local/cloud intelligence.

## Design principles

- **User-owned:** Ori is built for Liam to own and control.
- **Truthful UI:** the interface reflects real system state; it never invents activity or capabilities.
- **Professional:** intentional typography, spacing, hierarchy, accessibility, and responsive behavior.
- **Human:** approachable without becoming childish or gimmicky.
- **Technical:** powerful developer capabilities without exposing unnecessary complexity.
- **Calm:** important problems are clear without creating noise.
- **Iterative:** the system is tested, reviewed, and improved continuously.

## Current architecture

```text
apps/
  web/                 # Ori web application
  web/app/api/chat/    # server-side Mentor chat adapter

packages/
  ui/                  # shared Ori design system
  typography/          # Ori type family and font tooling
  shared/              # shared types and utilities

services/
  intelligence/        # intelligence/model orchestration boundary

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

The first live intelligence path is now the **Mentor** integration behind `/api/chat`. It uses a server-side Hugging Face Inference Providers connection when `HF_TOKEN` is configured. The TensorFlow core remains Ori's intended primary learned intelligence and is not yet the production inference path.

Provider credentials stay server-side and the browser only talks to Ori's own `/api/chat` endpoint.

## Configuration

Use `.env.example` as the reference for the current Mentor integration. Never commit a real inference token.

## Status

The platform UI and developer workspace are being stabilized while the first real intelligence path is being connected. Ori's deeper TensorFlow core, tools, and Ori World remain future implementation phases.
