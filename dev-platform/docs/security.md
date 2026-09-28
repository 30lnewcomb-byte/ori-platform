# Ori Security Model

Security in Ori is built around explicit server-side boundaries.

## Browser boundary

The browser is a user interface and should not receive infrastructure credentials.

Client code may call Ori's own application endpoints, but secrets needed to reach private runtimes remain on the server.

## Intelligence secret

`ORI_INTELLIGENCE_API_KEY` authenticates the Vercel-to-TensorFlow connection.

It must remain server-side.

It is not:

- a Render personal API key
- a user password
- a public developer API key

## VM boundary

The VM service is also accessed through a server-side wrapper. VM credentials must not be exposed to browser JavaScript.

## Tool execution boundary

A model response can propose a tool call, but the model does not receive execution permission directly.

The platform validates the proposed call and performs execution through the appropriate server-side path.

## Future developer authentication

The intended Developer Platform model is:

`Developer identity → project-scoped credential → Ori API → platform services`

The design should support least privilege, rotation, and revocation.

## Truthful state

Security and product trust overlap. The UI should only expose a capability as available when the underlying system confirms it.
