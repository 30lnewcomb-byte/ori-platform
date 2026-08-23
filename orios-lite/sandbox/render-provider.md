# Render Sandbox Provider

Render is the initial hosting target for OriOS Lite's sandbox service.

## Boundary

The hosted service is responsible for:

- accepting authenticated sandbox operations from OriOS Lite
- managing project workspaces
- running approved development tasks
- returning structured task status and logs
- exposing build/preview metadata
- enforcing workspace and task resource limits

The web application on Vercel is **not** the sandbox runtime. It calls the OriOS Lite API.

## Planned service shape

```text
Vercel Ori UI
    |
    v
OriOS Lite API
    |
    v
Render: sandbox service
    |
    +-- workspace storage
    +-- runtime isolation
    +-- task runner
    +-- logs/events
    +-- preview metadata
```

## Important implementation rule

Do not make Render-specific code part of the UI or task model. Keep it behind `SandboxProvider` so the runtime can later move to another host or a local provider without changing Ori's higher-level architecture.

## Next implementation steps

1. Create the Render service/container definition.
2. Implement authenticated sandbox API endpoints.
3. Add workspace persistence.
4. Add an isolated runtime for development commands.
5. Add task/event streaming.
6. Add snapshots and restore.
7. Connect the Vercel Ori UI to OriOS Lite.
