# Ori Developer Platform — Platform Overview

The Ori Developer Platform is the developer-facing control surface around Ori.

It is not a separate AI product and it is not OriOS Lite. It provides a place to understand Ori's contracts, projects, tools, intelligence, events, authentication, SDK direction, status, and architecture.

## The platform boundary

```
Developer
   ↓
Ori Developer Platform
   ↓
Ori Platform services
   ├── intelligence
   ├── tools
   ├── projects
   └── execution
```

The public developer contract should remain stable even when the infrastructure behind it changes.

## Console

The console contains:

- Dashboard
- Projects
- API
- Models
- Tools
- Activity
- Status
- Docs
- Settings

These surfaces may contain documented in-development areas, but they must not pretend unfinished backends are available.

## Current state

The console and documentation experience are live.

The stable public developer API, developer authentication, project persistence, public tool management, and first-party SDK packages are still in development.

## Product relationship

The everyday Ori experience stays focused on Home and Chat. Developer Platform is where implementation detail and future platform configuration belong.
