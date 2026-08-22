# Ori Reusable Sandbox

## Goal

Ori should have a reusable sandbox rather than creating a brand-new environment for every task.

A sandbox is a persistent, isolated workspace that can be reused across compatible tasks. A task can create temporary state inside it and clean that state without destroying the whole workspace.

## Lifecycle

```text
READY
  ↓
START
  ↓
RUNNING
  ↓
PAUSED / IDLE
  ↓
REUSED
  ↓
RUNNING
```

Destructive reset is an explicit operation rather than the default behavior.

## Separation

The sandbox should separate:

- workspace files
- task state
- credentials and secrets
- tool permissions
- runtime processes
- persistent configuration

Credentials should never be copied into general task output or logs.

## Tool access

Sandbox capabilities should be granted through an explicit permission layer. Ori should know which tools a sandbox can use before attempting an operation.

Examples include:

- filesystem access inside the sandbox
- controlled network access
- development tools
- selected platform APIs
- approved hardware integrations

## Safety and reliability

The sandbox is an execution boundary, not a promise that arbitrary code is safe. Resource limits, process cleanup, filesystem boundaries, network policy, and observability are required before autonomous execution is trusted.

## User control

For significant or potentially destructive operations, Ori should request approval according to the platform's approval policy. The UI should clearly show what will happen before approval.

## Future direction

The sandbox may eventually support snapshots, reusable environments, background tasks, and task-specific workspaces. These should be added when there is a concrete use case rather than prebuilding every possible feature.
