# Ori Product Status

This document separates the current product from the longer-term design.

## Available today

### Ori web platform

- Home
- Chat
- browser-local conversation history
- new chat
- reopening saved chats
- deleting saved chats
- server-side chat gateway
- server-side connection to the native TensorFlow runtime

### Native intelligence

- private TensorFlow runtime
- learned `ori-core` classifier
- learned `ori-small` generation model implementation
- internal status/model/predict/chat runtime contracts
- native training/evaluation pipeline

### VM infrastructure

- cloud VM service
- server-side VM wrapper
- authenticated VM operations
- committed-intent prewarm path

## In development

- durable authenticated developer projects
- public Developer API
- developer authentication and project-scoped API keys
- public tool registration/permissions
- durable developer activity/events
- first-party SDKs
- end-to-end Ori World orchestration
- richer server-side conversation persistence

## Intentionally parked or not exposed

- primary Search navigation
- primary Projects navigation
- primary Tasks navigation
- primary Activity navigation
- broad Settings controls
- direct exposure of internal runtime credentials
- provider-specific infrastructure controls in the user UI

## Product rule

A route existing in the repository does not make a feature complete.

A feature is complete only when the behavior, persistence, security boundary, and user-facing state all agree.
