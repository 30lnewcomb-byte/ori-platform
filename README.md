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

The Developer Platform is a first-class part of Ori Platform, but it is its **own destination** inside the product. It provides the future public surface for projects, API access, authentication, tools, models/intelligence, events, SDKs, the Developer Console, and dedicated Developer Docs.

The canonical Developer Docs source lives under `dev-platform/docs/`. The Next.js route under `apps/web/app/developer/docs/` is only the web presentation layer.

The Developer destination is a separate in-app workspace. It does not open a new browser tab and is not embedded into Home.

The platform and its documentation must clearly distinguish implemented capabilities from planned work.

## UI direction

Ori's current primary navigation is:

**Home → Chat → Search → Projects → Tasks → Activity → Ori World → Developer → Settings**

Desktop uses a persistent sidebar. Mobile/compact navigation is a later polish pass and should not change the canonical destination set.

Home is the app workspace for starting and resuming work, not a marketing landing page. Chat is where the user works with Ori. Projects organize work. Tasks track substantial work. Activity shows system events. Search finds work. Ori World represents where Ori will perform controlled work. Developer is a separate in-app workspace for the platform and docs. Settings contains configuration.

## Typography direction

The planned Ori type family combines editorial character with highly readable UI forms while using original glyph designs rather than copying an existing typeface.

Planned families:

- **Ori Display** — branding and major headings
- **Ori Text** — UI, chat, and documentation
- **Ori Mono** — code, logs, and technical data

The role names are wired into the design system, but the actual custom font binaries are still a separate font-production task.

## Intelligence

The intelligence service is currently an integration boundary, not a live model connection. The architecture is intended to support Ori's TensorFlow core, Mentor, and an orchestrator without claiming that live inference exists before it is actually connected and verified.

## Status

Early foundation. The interface and platform boundaries are being stabilized before the first production intelligence connection.
