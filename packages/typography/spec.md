# Ori Type System Spec

## Roles

| Role | Purpose | Default use |
| --- | --- | --- |
| Ori Display | expressive hierarchy | home hero, major product moments |
| Ori Text | readable interface voice | chat, navigation, settings, docs |
| Ori Mono | technical precision | code, logs, IDs, API values |

## Principles

1. Readability beats novelty.
2. Distinctive details should appear in glyph construction, not decorative effects.
3. Numerals and punctuation need special attention because developer interfaces use them heavily.
4. The family must work at both large display sizes and dense UI sizes.
5. The browser stack should retain safe fallbacks until the binary font assets exist.

## First glyph set

The first source pass should prioritize:

- uppercase and lowercase Latin
- numerals 0–9
- common punctuation
- arrows and UI symbols used by Ori
- developer characters: `{ } [ ] ( ) < > / \\ | _ - + = * # @ : ; . ,`

## Current implementation

The application already references the three family names. This keeps the product ready for the custom font while preventing the UI from pretending a binary font asset exists before the glyph work is complete.
