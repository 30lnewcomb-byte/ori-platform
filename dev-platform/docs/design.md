# Ori Design Language

Ori's interface should feel technical, calm, and deliberate.

## Visual direction

The primary Ori experience uses:

- light neutral application surfaces
- restrained blue accents
- strong typography
- generous spacing
- minimal decoration
- direct copy
- clear system state

The Developer Platform uses a darker technical console treatment while remaining recognizably part of Ori.

## UI rule

Avoid adding controls simply because a future workflow might eventually need them.

A button should have a real action behind it. A navigation item should lead to a useful surface. A status label should describe confirmed state.

## Information hierarchy

The user should understand:

1. what they can do now
2. what Ori is doing
3. whether the action actually succeeded
4. where to continue

Implementation details belong in the Developer Platform and documentation, not in the everyday assistant experience.


## Typography

Ori uses three family roles.

- **Ori Display** — branding and major headings.
- **Ori Text** — UI, chat, product copy, and documentation.
- **Ori Mono** — code, logs, paths, commands, and technical data.

The current shipped families are starter cuts. They are separate webfont resources with independent family metadata so the roles can evolve independently as the dedicated Ori typeface is refined.

CSS role variables:

`--font-display` → Ori Display  
`--font-text` → Ori Text  
`--font-mono` → Ori Mono

Do not point all three roles at one font file. The family separation is intentional even while the glyph designs are still being refined.
