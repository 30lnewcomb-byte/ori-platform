# OriOS Lite

OriOS Lite is the lightweight orchestration layer for Ori. It is intentionally smaller than the future full OriOS and is designed to run on inexpensive/free-tier infrastructure while preserving the architecture we can grow later.

## Responsibilities

- Task orchestration
- Sandbox lifecycle management
- Workspace/project state
- Event and activity reporting
- Tool routing
- Permission boundaries
- Provider abstraction

## Architecture

```text
Ori Web (Vercel)
       |
       v
  OriOS Lite API
       |
       +--> Task Manager
       +--> Event Bus
       +--> Sandbox Manager
       +--> Tool Manager
       +--> State/Memory adapter
       |
       v
 Render Sandbox Host
       |
       v
 Isolated sandbox runtime(s)
```

The first hosted implementation will target Render. The sandbox manager must not depend directly on Render APIs; Render is a deployment target behind a provider interface.

## Sandbox philosophy

The Ori Sandbox is Ori's workshop. It is where Ori can create/edit files, write and run code, test projects, use Git, inspect logs, and produce build/preview artifacts.

A persistent workspace can contain:

```text
workspace/
  projects/
  shared/
  tasks/
  temp/
  logs/
  snapshots/
```

Persistent project data should survive task cleanup. Temporary task directories can be removed independently.

## Execution loop

Ori should operate through an explicit action/observation loop:

1. Ori chooses an allowed sandbox action.
2. Sandbox Manager validates permissions and resource limits.
3. Runtime executes the action.
4. Sandbox Manager returns structured output, logs, and status.
5. Ori interprets the result and chooses the next action.

Do not expose an unrestricted `execute_everything` capability.

## Provider abstraction

The sandbox API should be provider-neutral:

```text
SandboxProvider
  createWorkspace()
  getWorkspace()
  runTask()
  readFile()
  writeFile()
  execute()
  getLogs()
  getStatus()
  createSnapshot()
  restoreSnapshot()
  stopTask()
  destroyTaskEnvironment()
```

Initial provider: `RenderSandboxProvider`.

Future providers may include a local runtime or another cloud runtime without changing Ori's higher-level task system.

## Security boundary

The sandbox is not automatically granted access to the user's personal computer, credentials, or unrestricted network. Capabilities should be explicit, scoped, logged, and approval-gated when an action is consequential.

## Product principle

**Ori is the intelligence. OriOS Lite is the orchestration layer. The Sandbox is Ori's workshop.**

This separation should remain stable as the platform grows toward the eventual full OriOS architecture.
