# Ori Developer Authentication

Authentication is the boundary between a developer and the resources belonging to that developer's projects.

## Intended model

```
Developer identity
      ↓
Project
      ↓
Project-scoped credential
      ↓
Ori Developer API
      ↓
Platform services
```

## Principles

Developer authentication should support:

- identity
- project-scoped credentials
- least privilege
- rotation
- revocation
- clear ownership boundaries

## Internal secret versus developer credential

`ORI_INTELLIGENCE_API_KEY` is an internal server secret used by the Ori Platform web application to authenticate to the private TensorFlow runtime.

It is not a public API key and should never be exposed to a browser or developer application.

## Current status

Developer authentication is being designed. No public credential flow is presented as live yet.
