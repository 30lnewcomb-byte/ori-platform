# Ori Design Tokens

These are the first implementation-level tokens for the Ori design system. They are intentionally expressed as semantic roles so the visual values can evolve without rewriting components.

## Spacing

```text
space-1  = 4px
space-2  = 8px
space-3  = 12px
space-4  = 16px
space-5  = 24px
space-6  = 32px
space-7  = 48px
space-8  = 64px
```

## Typography roles

```text
display       → Ori Display
heading-xl    → page titles
heading-lg    → section titles
heading-md    → component titles
body-lg       → prominent body copy
body          → Ori Text / standard UI and chat
body-sm       → secondary information
label         → controls and metadata
mono          → Ori Mono / code and technical values
```

The eventual Ori type family provides Display, Text, and Mono roles. The application references those family names now with safe fallbacks while the original glyph work is completed.

## Semantic colors

```text
surface-base
surface-raised
surface-overlay
text-primary
text-secondary
text-muted
border-subtle
accent-primary
accent-blue
accent-blue-soft
accent-blue-strong
status-success
status-warning
status-danger
status-info
focus-ring
```

Ori blue is an interaction and identity accent, not a blanket surface color. It is used for navigation state, primary actions, focus, links, and selected product moments.

Status must remain understandable without color alone.

## Shape

Use a small number of consistent radii. Components should not independently invent corner styles.

```text
radius-sm   → compact controls
radius-md   → standard controls and surfaces
radius-lg   → larger contextual surfaces
radius-pill → tags / compact status elements where appropriate
```

## Motion

Motion should be purposeful and state-driven. Components should support reduced-motion preferences and avoid animation that is purely decorative.

## Component rule

A component should consume semantic tokens rather than hard-coded visual values whenever the value represents a system decision.
