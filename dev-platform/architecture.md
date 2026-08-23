# Ori Developer Platform Architecture

The Developer Platform is a first-class part of Ori Platform. It is not a separate product and it is not the same thing as OriOS Lite.

## Core surface

```text
Ori Developer Platform
├── Projects
├── API
├── Authentication
├── Tools
├── Models / intelligence access
├── Events / logs
├── SDKs
├── Developer Console
└── Developer Documentation
```

## Relationship to the rest of Ori

```text
Ori Platform
├── Web application
│   └── Developer experience / Console
├── Platform API
├── Tool system
├── Intelligence orchestration
├── Developer Platform
└── OriOS Lite integration
```

The Developer Platform exposes stable interfaces around these capabilities. Infrastructure providers are implementation details and should not become part of the public developer contract.

## Projects

Projects are the primary unit of developer work. A project can eventually own configuration, API access, tools, model settings, activity, and other resources.

## API

The public API will be versioned independently from internal implementation details. The API should expose truthful, documented capabilities only.

## Authentication

Authentication will eventually support developer identity, project-scoped credentials, revocation, and appropriate permissions. Secrets must never be committed to the repository.

## Tools

Tools are capabilities exposed to Ori and/or developers through explicit interfaces. Tool registration, permissions, and execution should remain separate from the UI.

## SDKs

SDKs will be generated or maintained from the stable API contract rather than becoming the source of truth themselves.

## Events and logs

Platform events provide a consistent way to inspect project activity, tool activity, API operations, and system events.

## Sandbox relationship

A sandbox may eventually provide isolated execution for developer workloads. It is **not currently a dependency** of the Developer Platform. The platform must remain useful before a production sandbox exists.
