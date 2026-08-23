# Ori TensorFlow Core

This directory contains the learned TensorFlow side of Ori.

## Two stages

### Current Core
`model.py` is the existing compact TensorFlow classifier. It can provide intent/complexity signals to the orchestrator.

### Ori Language Model
`ori_lm.py` is the foundation for Ori's own small decoder-only Transformer. It is intentionally separate from the Mentor model.

## Mentor relationship

Mentor remains the supporting language model and is currently Qwen3-0.6B. Mentor is allowed to help with language understanding, planning, data generation, evaluation, and difficult requests while the custom Ori model is trained.

Mentor must NOT silently become Ori's permanent core identity.

## Long-term architecture

```text
User
  |
  v
Ori Platform
  |
  v
Orchestrator
  |--------------------|
  v                    v
Ori TensorFlow LM    Mentor (Qwen3-0.6B)
  |                    |
  |---- reasoning -----|
           |
           v
Memory / Tools / Ori World
```

The orchestrator should be able to change the balance between Ori LM and Mentor without changing Ori's identity layer.
