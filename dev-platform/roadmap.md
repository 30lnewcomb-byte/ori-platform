# Developer Platform Roadmap

This is an implementation roadmap, not a claim that every item below exists today.

## Foundation

- [x] Developer Platform footprint
- [x] Project model foundation
- [x] Tool registration foundation
- [x] Platform event foundation
- [x] Native TensorFlow runtime boundary
- [x] Initial TensorFlow model contract
- [x] Bootstrap Ori generative model training path
- [ ] Connect the platform API
- [ ] Define stable API versioning

## Developer Console

- [ ] Developer home
- [ ] Projects view
- [ ] API credentials view
- [ ] Tool management
- [ ] Usage/activity view
- [ ] Settings
- [ ] Model registry and version management

## API

- [ ] Authentication flow
- [ ] Project-scoped API credentials
- [ ] Core project endpoints
- [ ] Tool endpoints
- [ ] Event/log endpoints
- [ ] Error model
- [ ] Request validation
- [ ] Public model/intelligence endpoints

## SDKs

- [ ] Define API contract
- [ ] JavaScript/TypeScript SDK
- [ ] Python SDK
- [ ] SDK documentation

## Documentation

- [ ] Dedicated Developer Docs page
- [ ] Getting Started
- [ ] Platform overview
- [ ] API reference
- [ ] Authentication guide
- [ ] Projects guide
- [ ] Tools guide
- [ ] Models/intelligence guide
- [ ] SDK guides
- [ ] Changelog/versioning guidance

## Intelligence

- [x] Private TensorFlow service boundary
- [x] `ori-core` learned TensorFlow classifier
- [x] Native `ori-small` generative model implementation
- [x] Bootstrap training pipeline
- [x] Held-out evaluation harness
- [ ] Production runtime deployment
- [ ] Model artifact storage/registry
- [ ] Model version promotion/rollback
- [ ] Larger Ori-specific training corpus
- [ ] Improved tokenizer and generation quality
- [ ] Automated training/evaluation pipeline

## Platform

- [ ] Webhooks
- [ ] Usage metering
- [ ] Advanced permissions
- [ ] Sandbox integration when a real sandbox is needed

## Current rule

Do not connect real developer accounts, credentials, or external services until the corresponding interface is ready and explicitly enabled.
