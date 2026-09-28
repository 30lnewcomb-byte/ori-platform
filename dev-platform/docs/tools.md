# Ori Tools

Tools are explicit capabilities that Ori can use through a controlled interface.

## Current internal tools

The current Ori Platform has two internal server-side tool interfaces:

- `run_sandbox_command`
- `write_workspace_file`

## Execution model

The intended control path is:

```
Model proposes tool call
        ↓
Ori Platform validates it
        ↓
Platform commits to execution
        ↓
Server-side tool wrapper
        ↓
Controlled runtime
```

The model does not directly receive execution permission.

## Public tools

A public developer tool registration and permissions system is planned.

It must define:

- tool identity
- input schema
- output schema
- permissions
- authentication
- execution boundary
- error behavior
- audit events

## Important rule

Tool availability must be based on real capability and explicit permission, not on a UI control that merely looks available.
