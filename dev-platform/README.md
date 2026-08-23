# Ori Developer Platform

The Developer Platform is a first-class part of the Ori Platform repository. It is the developer-facing layer around Ori, while `ori-os-lite` remains the lightweight runtime/backend project.

## Planned surface

```text
Developer Platform
├── API
├── Authentication
├── Projects
├── Tools
├── Models
├── Events / Logs
├── Documentation
├── SDKs
└── Console
```

## Foundation

The initial models define projects, API-key metadata, tool registrations, and platform events. Secrets and real credentials are deliberately not stored here.

## Architecture principle

Ori should be able to use the same platform that developers use. Infrastructure providers should sit behind stable platform interfaces rather than becoming part of the platform's identity.

## Not connected yet

No real API keys, Google accounts, email accounts, sandbox providers, or external developer services are connected by these files. Those integrations will be added deliberately later.
