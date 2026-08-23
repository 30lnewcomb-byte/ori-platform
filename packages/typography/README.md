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

The first original **Ori Text starter font** is now shipped as `apps/web/public/fonts/OriText-Regular.woff2` and is loaded by the web app.

For the first implementation pass, Ori Display and Ori Mono intentionally reuse the same original starter glyph set through their CSS family aliases. Separate Display and Mono glyph designs can be refined later without changing the app's type contract.

This is an **experimental starter font**, not the final Ori typeface. The next typography pass can refine letterforms, spacing, weights, and optical sizes after the product UI has settled.
