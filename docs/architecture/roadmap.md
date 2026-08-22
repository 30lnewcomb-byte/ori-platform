# Ori Platform Build Roadmap

This roadmap is intentionally capability-driven rather than version-driven. Ori is expected to evolve continuously.

## Foundation

- [x] Establish repository
- [x] Document UI quality standard
- [x] Document brand direction
- [x] Define core TensorFlow + Mentor architecture
- [ ] Establish frontend application
- [ ] Establish shared design-system package
- [ ] Establish platform API contract

## Product shell

- [ ] Home
- [ ] Chat
- [ ] Projects
- [ ] Sandbox
- [ ] Developer
- [ ] Settings
- [ ] Responsive phone navigation
- [ ] Search across chats and relevant work

## Intelligence

- [ ] TensorFlow core model interface
- [ ] Mentor interface
- [ ] Orchestrator
- [ ] Memory interface
- [ ] Evaluation harness
- [ ] Training pipeline
- [ ] Candidate-model promotion flow

## Sandbox

- [ ] Reusable sandbox lifecycle
- [ ] Sandbox isolation policy
- [ ] Persistent workspace handling
- [ ] Tool permissions
- [ ] Resource limits
- [ ] Reset / snapshot behavior

## Tools and operations

- [ ] Tool registry
- [ ] Approval system
- [ ] Bambu printer integration
- [ ] Google Chat reporting integration
- [ ] Email escalation/reporting
- [ ] Execution audit trail

## Developer platform

- [ ] API authentication
- [ ] API keys / project credentials
- [ ] SDK direction
- [ ] Webhooks/events
- [ ] Developer documentation
- [ ] Observability

## Quality gates

Every major capability should be testable in isolation, observable when running, and represented truthfully in the UI.

Production model changes require evaluation evidence rather than automatic self-approval.
