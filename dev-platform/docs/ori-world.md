# Ori World

Ori World is Ori's controlled working environment.

It is designed for work that benefits from an isolated environment: code, files, tests, experiments, project context, and approved tool execution.

## What belongs in Ori World

- working files
- code and test workflows
- small experiments
- structured results
- logs
- project context
- controlled execution

## What does not belong in Ori World

Ori World is not intended to become:

- a generic hosting product
- unrestricted access to the user's computer
- a permanent infrastructure dependency that exists without a useful workload
- a provider-specific UI

## Current implementation

The web platform contains a server-side VM wrapper in `apps/web/lib/ori-vm.ts`.

That wrapper is designed to keep the VM credential on the server and provide authenticated status, execution, and workspace operations.

The current web route is historically `/sandbox`, while the product name is Ori World.

## Prewarm

VM prewarm is an optimization, not a user-visible feature.

The intended rule is that prewarm happens only after orchestration has selected the VM as the concrete execution mechanism.

Raw model thoughts, keywords, or speculative tool candidates must not wake the VM.

## Current status

The intelligence connection is live. The VM service exists independently on the cloud side and has a server-side wrapper in Ori Platform.

Full chat-to-Ori-World orchestration is still a separate integration step. Until that is complete, the product should not present Ori World as though an end-to-end autonomous work environment already exists.
