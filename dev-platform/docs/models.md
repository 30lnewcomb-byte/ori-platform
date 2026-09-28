# Ori Models & Intelligence

Ori's native intelligence stack is hosted behind the private TensorFlow runtime.

## ori-core

`ori-core` is the learned TensorFlow/Keras classifier.

Its role is intent and conversation classification within the Ori platform.

It is a real trainable model rather than a hand-written response rule system.

## ori-small

`ori-small` is a compact decoder-only Transformer used for Ori generation.

Current documented configuration:

- vocabulary: 2048
- context length: 256
- model width: 192
- attention heads: 4
- Transformer blocks: 4
- feed-forward width: 768
- dropout: 0.1

## Access boundary

Applications do not call model artifacts directly.

```
Application
   ↓
Ori Platform
   ↓
Private intelligence runtime
   ↓
Model
```

## Public model access

Public model access is not yet a stable Developer Platform feature.

Future model APIs should expose documented capabilities without coupling developers to internal artifact names or provider infrastructure.
