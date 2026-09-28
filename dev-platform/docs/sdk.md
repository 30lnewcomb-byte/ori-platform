# Ori SDKs

Ori SDKs will provide convenient clients for the stable public API.

## Planned first-party SDKs

- JavaScript / TypeScript
- Python

## Source of truth

The versioned public API contract is the source of truth.

SDKs must follow the API rather than creating independent behavior.

## Planned responsibilities

SDKs should handle:

- authentication headers
- request construction
- response types
- standard error handling
- API version selection
- developer-friendly retries where appropriate

## Current status

No public SDK package has been released because the public API contract is still in development.
