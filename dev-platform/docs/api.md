# Ori Developer API

The public Ori Developer API is the external contract that future applications will use to communicate with Ori.

## Public API status

The stable public API is **in development**.

Do not treat internal runtime endpoints as a public developer API.

## Planned contract

The first stable version is intended to use a versioned path:

`/v1/*`

A representative chat request is:

```http
POST /v1/chat
Authorization: Bearer <project-key>
Content-Type: application/json
```

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, Ori."
    }
  ]
}
```

This example describes the intended shape. It is not a released public endpoint.

## Current internal runtime contract

The private intelligence runtime currently exposes:

- `GET /health`
- `GET /v1/status`
- `GET /v1/models`
- `POST /v1/predict`
- `POST /v1/chat`

These routes exist behind the server-side platform boundary.

## Public API requirements

Before external release, the public contract needs:

- developer authentication
- project-scoped credentials
- request validation
- stable error responses
- versioning
- rate and usage controls
- documented model and tool semantics
- revocation and credential rotation

## Security

The browser must not receive internal runtime credentials. Public developer credentials should be scoped to a project and validated by the Ori platform before downstream services are called.
