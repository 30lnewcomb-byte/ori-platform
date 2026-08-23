"""Ori's small custom TensorFlow language model.

This is a compact decoder-only Transformer designed to become Ori's own
language model over time. It deliberately does not own Ori's identity,
memory, tools, or permissions; those remain in the platform core.

The model is trainable from plain JSONL records and can later be replaced or
scaled without changing the surrounding Ori architecture.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import json
import re

import tensorflow as tf


@dataclass(frozen=True)
class OriLMConfig:
    vocab_size: int = 8192
    context_length: int = 256
    d_model: int = 256
    num_heads: int = 4
    num_layers: int = 6
    d_ff: int = 1024
    dropout: float = 0.1
    pad_id: int = 0
    bos_id: int = 1
    eos_id: int = 2
    unk_id: int = 3


class OriTokenizer:
    """Transparent starter tokenizer.

    It is intentionally simple so the first Ori model is easy to inspect.
    Once the training corpus grows, this interface can be backed by BPE or a
    SentencePiece-style tokenizer without changing the model API.
    """

    SPECIAL = ("<pad>", "<bos>", "<eos>", "<unk>")

    def __init__(self, vocab: dict[str, int]):
        self.vocab = vocab
        self.inverse = {v: k for k, v in vocab.items()}

    @staticmethod
    def split(text: str) -> list[str]:
        return re.findall(r"\w+|[^\w\s]", text.lower(), flags=re.UNICODE)

    @classmethod
    def build(cls, texts: list[str], vocab_size: int = 8192) -> "OriTokenizer":
        counts: dict[str, int] = {}
        for text in texts:
            for token in cls.split(text):
                counts[token] = counts.get(token, 0) + 1

        vocab = {token: i for i, token in enumerate(cls.SPECIAL)}
        ranked = sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))
        for token, _ in ranked:
            if token not in vocab:
                vocab[token] = len(vocab)
            if len(vocab) >= vocab_size:
                break
        return cls(vocab)

    def encode(self, text: str, add_bos: bool = True, add_eos: bool = True) -> list[int]:
        ids = [self.vocab["<bos>"]] if add_bos else []
        ids.extend(self.vocab.get(t, self.vocab["<unk>"]) for t in self.split(text))
        if add_eos:
            ids.append(self.vocab["<eos>"])
        return ids

    def decode(self, ids: list[int]) -> str:
        tokens = [self.inverse.get(i, "<unk>") for i in ids]
        tokens = [t for t in tokens if t not in self.SPECIAL]
        text = " ".join(tokens)
        return re.sub(r"\s+([,.!?;:])", r"\1", text)

    def save(self, path: str | Path) -> None:
        Path(path).write_text(json.dumps(self.vocab, indent=2), encoding="utf-8")

    @classmethod
    def load(cls, path: str | Path) -> "OriTokenizer":
        return cls(json.loads(Path(path).read_text(encoding="utf-8")))


class TransformerBlock(tf.keras.layers.Layer):
    def __init__(self, config: OriLMConfig, **kwargs):
        super().__init__(**kwargs)
        self.norm1 = tf.keras.layers.LayerNormalization(epsilon=1e-6)
        self.attn = tf.keras.layers.MultiHeadAttention(
            num_heads=config.num_heads,
            key_dim=config.d_model // config.num_heads,
            dropout=config.dropout,
        )
        self.norm2 = tf.keras.layers.LayerNormalization(epsilon=1e-6)
        self.ffn = tf.keras.Sequential([
            tf.keras.layers.Dense(config.d_ff, activation=tf.nn.gelu),
            tf.keras.layers.Dropout(config.dropout),
            tf.keras.layers.Dense(config.d_model),
        ])
        self.dropout = tf.keras.layers.Dropout(config.dropout)

    def call(self, x, training=False):
        length = tf.shape(x)[1]
        mask = tf.linalg.band_part(
            tf.ones((length, length), dtype=tf.bool), -1, 0
        )
        y = self.attn(self.norm1(x), self.norm1(x), attention_mask=mask, training=training)
        x = x + self.dropout(y, training=training)
        x = x + self.dropout(self.ffn(self.norm2(x), training=training), training=training)
        return x


class OriLanguageModel(tf.keras.Model):
    """Compact decoder-only Transformer for Ori."""

    def __init__(self, config: OriLMConfig, **kwargs):
        super().__init__(**kwargs)
        self.config = config
        self.tokens = tf.keras.layers.Embedding(config.vocab_size, config.d_model, name="token_embedding")
        self.positions = tf.keras.layers.Embedding(config.context_length, config.d_model, name="position_embedding")
        self.dropout = tf.keras.layers.Dropout(config.dropout)
        self.blocks = [TransformerBlock(config, name=f"transformer_{i}") for i in range(config.num_layers)]
        self.norm = tf.keras.layers.LayerNormalization(epsilon=1e-6)
        self.lm_head = tf.keras.layers.Dense(config.vocab_size, use_bias=False, name="lm_head")

    def call(self, token_ids, training=False):
        length = tf.shape(token_ids)[1]
        positions = tf.range(length)[tf.newaxis, :]
        x = self.tokens(token_ids) + self.positions(positions)
        x = self.dropout(x, training=training)
        for block in self.blocks:
            x = block(x, training=training)
        return self.lm_head(self.norm(x))

    def next_logits(self, token_ids):
        return self(token_ids, training=False)[:, -1, :]


def build_model(config: OriLMConfig | None = None) -> OriLanguageModel:
    config = config or OriLMConfig()
    model = OriLanguageModel(config, name="ori_language_model")
    model(tf.zeros((1, min(2, config.context_length)), dtype=tf.int32))
    return model
