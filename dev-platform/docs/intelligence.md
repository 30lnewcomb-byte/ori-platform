# Ori Intelligence

Ori's intelligence layer is designed around a private TensorFlow runtime behind the Ori Platform server boundary.

## Boundary

The browser does not call the intelligence runtime directly.

The current path is:

`Browser → Ori Platform → authenticated server-to-server request → Ori TensorFlow runtime`

The runtime credential stays server-side.

## ori-core

`ori-core` is the learned TensorFlow/Keras classifier in the current native intelligence stack.

Its role is to classify conversation and intent categories used by the platform.

It is a trainable learned model, not a hard-coded collection of response rules.

## ori-small

`ori-small` is the compact decoder-only Transformer generation model in the current development stack.

Current documented architecture:

- vocabulary size: 2048
- context length: 256
- model width: 192
- attention heads: 4
- Transformer blocks: 4
- feed-forward width: 768
- dropout: 0.1

The model is intentionally small and native to the Ori TensorFlow runtime.

## Runtime interfaces

The internal runtime currently exposes:

- `GET /health`
- `GET /v1/status`
- `GET /v1/models`
- `POST /v1/predict`
- `POST /v1/chat`

These are internal implementation contracts. They are not the public Developer API.

## Production behavior

The Vercel web application calls the intelligence service from the server side through `ORI_INTELLIGENCE_URL` and `ORI_INTELLIGENCE_API_KEY`.

The API key is a private shared secret for the Vercel-to-TensorFlow connection. It is not a Render account credential and it is not a developer API key.

## Training

The repository contains native training and evaluation code for the models.

Training is part of the deployment pipeline for the current runtime. Longer-term work includes better model artifacts, larger Ori-specific training data, improved tokenization, generation quality, and automated evaluation/training workflows.
