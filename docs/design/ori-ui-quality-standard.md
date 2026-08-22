# Ori UI Quality Standard

Every Ori screen should pass these checks before it is considered ready.

## Purpose

- The screen has a clear job.
- Every visible element earns its space.

## Hierarchy

- Important information is visually important.
- Secondary information remains secondary.
- The interface does not make everything compete for attention.

## Clarity

- Users can understand controls without memorizing the interface.
- Labels describe what actions actually do.
- Errors explain what happened and what can be done next.

## Consistency

- Similar controls look and behave consistently.
- Shared components are preferred over one-off implementations.

## AI transparency

Ori clearly communicates whether it is ready, working, waiting, paused, complete, or needs attention.

The UI must never claim that an action happened when the backend did not confirm it.

## Complexity

- Common tasks remain simple.
- Advanced capabilities are available without permanently cluttering the main interface.
- Complexity is exposed progressively when it becomes useful.

## Responsive behavior

- Desktop, tablet, and phone layouts are designed as related compositions, not as one canvas that is merely shrunk.
- Navigation can change form at compact sizes.

## Accessibility

- Text remains readable.
- Interactive controls have comfortable targets.
- Important information does not depend on color alone.
- Keyboard and other appropriate input methods remain usable.

## Visual craft

- Spacing follows the design tokens.
- Typography is intentional.
- Icons communicate meaning.
- Motion communicates state or cause/effect rather than existing as decoration.

## Restraint

If removing an element improves clarity without removing useful capability, remove it.

## Truthfulness

No fake statistics, fake activity, fake progress, fake status, or fake capabilities.

## Core Ori rule

> When a feature is complex, Ori's UI should make the complexity understandable — not hide it and not dump it on the user.
