# Guide: Ori Cloud Architecture

Ori is built as a distributed system.

## Components

### Ori Platform

The web/control plane renders the product and owns server-side orchestration.

### Ori TensorFlow

The learned intelligence runtime contains Ori's native TensorFlow/Keras models.

### Ori VM

The controlled execution runtime provides an isolated place for approved work when the platform selects execution.

## Request flow

```
Browser
  ↓
Ori Platform
  ↓
TensorFlow intelligence
  ↓
(optional)
Ori VM execution
```

## Why the services are separate

The web layer and learned intelligence runtime can evolve independently.

The contract is the interface between them, not a shared machine or shared provider account.

## Provider boundary

Vercel and Render are infrastructure choices. The Ori product should depend on Ori interfaces, not provider-specific behavior.

## Security

The browser never needs:

- provider API credentials
- TensorFlow runtime credentials
- VM credentials
- internal shared secrets

The platform keeps those secrets on the server.
