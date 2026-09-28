# Ori Platform Architecture

Ori is a user-owned AI platform with a focused web experience, native learned intelligence, controlled execution infrastructure, and a separate Developer Platform experience.

## Product layers

```
Ori user experience
├── Home
└── Chat
     └── browser-local conversation history

Developer Platform
├── Dashboard
├── Projects
├── API
├── Authentication
├── Models
├── Tools
├── Activity
├── Status
├── Docs
├── SDKs
└── Settings
```

The Developer Platform documents both real infrastructure and future contracts. Unfinished developer capabilities are labeled instead of being presented as live.

## Runtime layers

```
Browser
  ↓
Ori Platform web/control plane
  ↓
Server-side orchestration
  ├──→ Ori TensorFlow runtime
  └──→ Ori VM runtime when concrete execution is selected
```

### Ori Platform

The web/control plane owns the user experience and server-side gateway behavior.

### Ori TensorFlow

The private learned-intelligence runtime contains Ori-native TensorFlow/Keras models such as `ori-core` and `ori-small`.

### Ori VM

The controlled execution runtime provides an isolated environment for approved work. It remains behind a server-side wrapper.

## Contracts

The stable contract between layers is an Ori-owned interface.

Infrastructure providers are implementation details. A developer integration should not depend on Vercel, Render, model artifact storage, or internal runtime routes directly.

## Security

The browser must never receive internal intelligence credentials, VM credentials, provider account credentials, or other server secrets.

Tool execution also has a separate permission boundary: a model can propose an operation, but execution is validated and performed by the platform.

## Current product rule

Keep the everyday Ori experience small until additional surfaces have real behavior behind them. Put technical detail, implementation state, and future platform design in the Developer Platform and its documentation.
