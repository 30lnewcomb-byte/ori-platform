# Ori World

Ori World is Ori's small, purpose-built working environment.

It is intentionally different from a generic hosted sandbox product. The goal is to give Ori a controlled place to work with code, files, tests, experiments, and project context without making a paid sandbox service a hard dependency.

## What belongs here

- Persistent working context for a project
- Working files
- Code and test workflows
- Small experiments
- Controlled tool execution
- Logs and structured results
- Explicit permissions and approval boundaries

## What does not belong here

- A generic developer hosting product
- Unrestricted access to the user's computer
- Long-lived infrastructure that exists only because it can
- Provider-specific logic in the product UI

## Product boundary

```text
Ori
  |
  v
Ori Platform
  |
  +--> Intelligence
  |
  +--> Tools
  |
  +--> Ori World
          |
          +--> Workspace
          +--> Files
          +--> Tests
          +--> Experiments
          +--> Controlled execution
```

Ori World should remain useful even when no external execution provider is connected.

## Current state

The web route is `/sandbox`, but the user-facing label is **Ori World**. The execution layer is not connected yet.

The implementation will be designed after the live intelligence connection is established, so we can build the smallest useful environment around Ori's real workflow rather than guessing at infrastructure first.
