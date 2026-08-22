# Ori Frontend Architecture

## Goal

Build a professional, responsive web interface for Ori that can evolve from a product UI into the front door for the Ori developer platform.

## Proposed stack

- Next.js / React for the web application
- TypeScript for application code
- A shared Ori UI package for reusable components and tokens
- CSS variables for design tokens
- Vercel as the initial web hosting target

The stack is intentionally replaceable at the boundaries. Product behavior should not be tightly coupled to a hosting provider.

## Application areas

```text
Home
Chat
Projects
Sandbox
Developer
Settings
```

### Home

Home is a launchpad. It should answer:

- What can I do with Ori right now?
- What am I currently working on?
- Is anything waiting for me?
- Where should I go next?

It should not become a wall of analytics cards.

### Chat

The primary workspace for interacting with Ori. It will eventually support conversations, tool activity, task progress, approvals, and searchable history.

### Projects

A durable organizational layer for work. Projects can eventually connect conversations, files, sandboxes, tools, and developer resources.

### Sandbox

A view into the reusable execution environment: status, workspace, running work, permissions, and recent activity.

### Developer

The developer-facing surface for APIs, credentials, integrations, events, documentation, and platform configuration.

### Settings

Account, appearance, permissions, notifications, integrations, and system preferences.

## Responsive model

The interface is designed for three broad compositions:

- **Compact:** phone-first interaction with bottom navigation and simplified panels.
- **Medium:** tablet and small laptop layouts with flexible navigation.
- **Expanded:** desktop layouts with persistent sidebar navigation and richer workspace composition.

The compact layout is not simply the desktop UI shrunk down.

## State-driven UI

Frontend components consume explicit backend state. Examples:

```text
ready
working
waiting
paused
success
warning
error
offline
```

The UI must never infer success from the absence of an error or invent progress that the backend did not report.

## API boundary

The frontend should communicate through a typed platform API boundary rather than importing backend implementation details directly.

This makes the web application deployable independently and leaves room for future desktop/mobile clients.

## Design-system boundary

Shared components belong in `packages/ui`. Product pages should compose those components rather than creating one-off visual systems.

The custom Ori type family will be consumed through `packages/typography` once the font pipeline exists.
