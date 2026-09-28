# Ori Platform Architecture

Ori is a distributed platform composed of a web/control plane, a private learned-intelligence runtime, and an optional controlled execution runtime.

## High-level path

```
Browser
  ↓
Ori Platform web application
  ↓
Server-side orchestration
  ├──→ Ori TensorFlow intelligence runtime
  └──→ Ori VM runtime (when concrete execution is selected)
```

## Vercel

The Vercel-hosted Ori Platform contains the web application and server-side orchestration boundary.

Responsibilities include:

- rendering the user interface
- accepting chat requests
- validating and shaping model/tool interactions
- keeping runtime credentials private
- coordinating downstream runtime calls

## TensorFlow runtime

The Render-hosted TensorFlow service contains the native learned intelligence implementation.

The web platform communicates with it through authenticated HTTPS requests.

## VM runtime

The Render-hosted VM is an optional controlled execution environment.

The user-facing product should treat it as an implementation of execution, not as a provider product.

## Cross-cloud design

Vercel and Render are independent services. They communicate through explicit interfaces and do not need to share the same host or network.

This is a normal distributed-systems arrangement:

`Vercel control plane → Render intelligence → Render execution`

The browser does not need to know the provider topology to use Ori.

## Security boundary

The browser must never receive:

- provider account credentials
- runtime secrets
- VM credentials
- internal shared API keys

The control plane is responsible for deciding when and how a downstream capability is invoked.

## Interface rule

Public consumers should depend on Ori's documented contracts, not internal runtime endpoints or infrastructure-provider APIs.
