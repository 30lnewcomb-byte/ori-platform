# Ori Intelligence Service

This is the integration boundary for Ori's intelligence architecture.

## Current architecture

- **Ori TensorFlow model** is the long-term custom learned language component. The first decoder-only Transformer lives under `tensorflow_core/ori_model.py`.
- **TensorFlow core classifier** remains available under `tensorflow_core/model.py` for intent/complexity signals while the language model is trained.
- **Mentor** is a supporting language-model layer. The current default is **Qwen3-0.6B** for language understanding, task structuring, planning assistance, and evaluation.
- **Orchestrator** decides when and how these components interact.

Qwen is deliberately a replaceable Mentor, not the permanent definition of Ori.

## New custom Ori model

`tensorflow_core/ori_model.py` contains a compact decoder-only Transformer implemented directly with TensorFlow/Keras. It includes:

- configurable context length and model size
- causal self-attention
- trainable token and position embeddings
- JSONL training support
- an explicit tokenizer interface that can later be upgraded to BPE/SentencePiece
- saved TensorFlow weights and model configuration

`tensorflow_core/train_ori.py` is the first training pipeline. Starter examples are in `tensorflow_core/data/ori_training.jsonl`.

From `services/intelligence/tensorflow_core`:

```bash
python train_ori.py --data data/ori_training.jsonl --output artifacts/ori-small
```

The starter dataset is intentionally tiny. It proves the training path; it is **not** enough to make a good general-purpose language model. The next stage is building a much larger Ori-specific corpus and evaluation suite.

## Architecture boundary

```text
User message
    ↓
Platform API
    ↓
Intelligence Orchestrator
    ├── Ori TensorFlow Model   ← custom language model
    ├── TensorFlow Core       ← intent/complexity signals
    └── Mentor                ← optional supporting model
    ↓
Memory / Tools / Ori World
    ↓
User-facing Ori response
```

The model does **not** own Ori's identity, memory, permissions, tools, or persistent state. Those belong to the platform. This is what lets us improve or replace the model without making Ori stop being Ori.

## Current state

The working web chat still uses the Mentor boundary when configured. The custom TensorFlow language model has now been added as the foundation for Ori's own model and has a real training path.

Do not claim live intelligence until the configured model connection is working and its health/status can be verified.

## Configuration

Set provider credentials as environment variables, never in source control:

- `HF_TOKEN` — Hugging Face token for the supporting Mentor path.
- `ORI_MENTOR_MODEL` — supporting model identifier; current default is `Qwen/Qwen3-0.6B`.

## Rules

Do not expose provider-specific credentials to the browser.

Do not silently turn the Mentor into the permanent definition of Ori's core intelligence.

Do not treat the starter TensorFlow model as production-ready yet. It is the foundation we will train, evaluate, and improve into Ori's own small language model.
