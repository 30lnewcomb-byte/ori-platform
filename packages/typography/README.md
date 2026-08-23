# Ori Typography

This package is the home for the custom Ori type family.

## Planned families

- **Ori Display** — brand, hero headings, major product moments.
- **Ori Text** — chat, navigation, settings, documentation, and normal UI.
- **Ori Mono** — code, logs, identifiers, and technical values.

## Design direction

The type family should combine:

- editorial character and confident forms
- high readability at UI sizes
- open counters and comfortable spacing
- a technical feel without looking like a coding font everywhere

The glyphs must be original. We are taking inspiration from qualities we like in classic serif/editorial typography and highly readable modern UI type, not copying an existing typeface.

## Current stage

The type system is now wired into the design tokens and CSS using the `Ori Display`, `Ori Text`, and `Ori Mono` family names with safe fallbacks. Actual custom font files still need to be generated from the glyph design work before they are shipped as binary assets.
