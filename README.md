# Ori Platform

The open-source foundation for Ori: a user-owned AI platform with a professional web interface, Ori World, developer platform, tools, and future local/cloud intelligence.

## Design principles

- **User-owned:** Ori is built for Liam to own and control.
- **Truthful UI:** the interface reflects real system state; it never invents activity or capabilities.
- **Professional:** intentional typography, spacing, hierarchy, accessibility, and responsive behavior.
- **Human:** approachable without becoming childish or gimmicky.
- **Technical:** powerful developer capabilities without exposing unnecessary complexity.
- **Calm:** important problems are clear without creating noise.
- **Iterative:** the system is tested, reviewed, and improved continuously.

## Initial architecture

```text
apps/
  web/                 # Ori web application

packages/
  ui/                  # shared Ori design system
  typography/          # Ori type family and font tooling
  shared/              # shared types and utilities

services/
  api/                 # platform API
  intelligence/        # intelligence/model orchestration
  tools/               # tool integrations

world/
  runtime/             # future Ori World implementation

dev-platform/
  architecture.md      # developer platform architecture
  roadmap.md           # implementation roadmap

docs/
  design/              # design decisions and standards
```

The repository starts intentionally small. Directories are added when the corresponding implementation exists.

## Ori World

Ori World is a small, purpose-built working environment for Ori. It is designed around code, files, tests, experiments, and other controlled work that Ori actually needs. It is not intended to be a generic hosted sandbox product or a required paid service.

The current web experience lives at `/sandbox` while the concept is being developed; the UI labels it **Ori World**. The implementation is not connected yet.

## Developer Platform

The Developer Platform is a first-class part of Ori Platform. It provides the future public surface for projects, API access, authentication, tools, models/intelligence, events, SDKs, the Developer Console, and dedicated Developer Docs.

The platform and its documentation must clearly distinguish implemented capabilities from planned work.

## UI direction

Ori's primary navigation is currently:

**Home → Chat → Projects → Ori World → Developer → Settings**

Desktop uses a persistent sidebar. Compact layouts use bottom navigation with less-frequent destinations under More.

Home is a launchpad, not a dashboard. Chat is where the user works with Ori. Projects organize work. Ori World represents where Ori will perform controlled work.

## Typography direction

The planned Ori type family combines the classic editorial qualities we like from Times New Roman with the readability qualities we like from Lexend, while using original glyph designs rather than copying either typeface.

Planned families:

- **Ori Display** — branding and major headings
- **Ori Text** — UI, chat, and documentation
- **Ori Mono** — code, logs, and technical data

## Status

Early foundation. Architecture and UI are being designed before the first production implementation.
