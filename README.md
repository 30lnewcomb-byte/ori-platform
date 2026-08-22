# Ori Platform

The open-source foundation for Ori: a user-owned AI platform with a professional web interface, reusable sandbox, developer platform, tools, and future local/cloud intelligence.

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

sandbox/
  runtime/             # reusable Ori sandbox runtime

docs/
  design/              # design decisions and standards
```

The repository starts intentionally small. Directories are added when the corresponding implementation exists.

## UI direction

Ori's primary navigation is currently:

**Home → Chat → Projects → Sandbox → Developer → Settings**

Desktop uses a persistent sidebar. Compact layouts use bottom navigation with less-frequent destinations under More.

Home is a launchpad, not a dashboard. Chat is where the user works with Ori. Projects organize work. Sandbox represents where Ori performs isolated work.

## Typography direction

The planned Ori type family combines the classic editorial qualities we like from Times New Roman with the readability qualities we like from Lexend, while using original glyph designs rather than copying either typeface.

Planned families:

- **Ori Display** — branding and major headings
- **Ori Text** — UI, chat, and documentation
- **Ori Mono** — code, logs, and technical data

## Status

Early foundation. Architecture and UI are being designed before the first production implementation.
