"""Ori's compact, native TensorFlow language model.

The language model provides learned language generation. Identity, memory,
tools, permissions, and orchestration stay outside the model in Ori Core.
"""

from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
import re

import tensorflow as tf


@dataclass(frozen=True)
class OriLMConfig:
    vocab_size: int = 2048
    context_length: int = 256
    d_model: int = 192
    num_heads: int = 4
    num_layers: int = 4
    d_ff: int = 768
    dropout: float = 0.1
    pad_id: int = 0
    bos_id: int = 1
    eos_id: int = 2
    unk_id: int = 3


class OriTokenizer:
    """Small transparent tokenizer for the bootstrap Ori corpus.

    The tokenizer deliberately stays inspectable. Its API is stable so it can
    later be backed by a subword tokenizer without changing the model runtime.
    """

    SPECIAL = ("<pad>", "<bos>", "<eos>", "<unk>")

    def __init__(self, vocab: dict[str, int]):
        self.vocab = vocab
        self.inverse = {v: k for k, v in vocab.items()}

    @staticmethod
    def split(text: str) -> list[str]:
        pattern = r"[A-Za-z0-9_]+(?:['’][A-Za-z0-9_]+)?|[^\w\s]"
        return re.findall(pattern, text, flags=re.UNICODE)

    @classmethod
    def build(cls, texts: list[str], vocab_size: int = 2048) -> "OriTokenizer":
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
        output: list[str] = []
        for token_id in ids:
            token = self.inverse.get(token_id, "<unk>")
            if token == "<eos>":
                break
            if token in self.SPECIAL:
                continue
            output.append(token)

        text = " ".join(output)
        text = re.sub(r"\s+([,.!?;:%\)\]\}])", r"\1", text)
        text = re.sub(r"([\(\[\{])\s+", r"\1", text)
        text = re.sub(r"\s+([/])\s+", r"\1", text)
        return text.strip()

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
        self.ffn = tf.keras.Sequential(
            [
                tf.keras.layers.Dense(config.d_ff, activation=tf.nn.gelu),
                tf.keras.layers.Dropout(config.dropout),
                tf.keras.layers.Dense(config.d_model),
            ],
            name="ffn",
        )
        self.dropout = tf.keras.layers.Dropout(config.dropout)

    def call(self, x, training=False):
        length = tf.shape(x)[1]
        causal_mask = tf.linalg.band_part(
            tf.ones((length, length), dtype=tf.bool), -1, 0
        )
        normalized = self.norm1(x)
        attention = self.attn(
            normalized,
            normalized,
            attention_mask=causal_mask,
            training=training,
        )
        x = x + self.dropout(attention, training=training)
        x = x + self.dropout(
            self.ffn(self.norm2(x), training=training),
            training=training,
        )
        return x


class OriLanguageModel(tf.keras.Model):
    """Compact decoder-only Transformer used by Ori's language path."""

    def __init__(self, config: OriLMConfig, **kwargs):
        super().__init__(**kwargs)
        self.config = config
        self.tokens = tf.keras.layers.Embedding(
            config.vocab_size, config.d_model, name="token_embedding"
        )
        self.positions = tf.keras.layers.Embedding(
            config.context_length, config.d_model, name="position_embedding"
        )
        self.dropout = tf.keras.layers.Dropout(config.dropout)
        self.blocks = [
            TransformerBlock(config, name=f"transformer_{i}")
            for i in range(config.num_layers)
        ]
        self.norm = tf.keras.layers.LayerNormalization(epsilon=1e-6)
        self.lm_head = tf.keras.layers.Dense(
            config.vocab_size, use_bias=False, name="lm_head"
        )

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

    def generate(
        self,
        tokenizer: OriTokenizer,
        prompt: str,
        max_new_tokens: int = 96,
        temperature: float = 0.2,
        top_k: int = 20,
    ) -> tuple[str, str]:
        """Generate text from learned weights and return (text, finish_reason)."""
        if not prompt.strip():
            raise ValueError("Generation prompt is empty.")
        if max_new_tokens < 1 or max_new_tokens > 256:
            raise ValueError("max_new_tokens must be between 1 and 256.")
        if temperature < 0 or temperature > 2:
            raise ValueError("temperature must be between 0 and 2.")

        context = tokenizer.encode(prompt, add_bos=True, add_eos=False)
        context = context[-self.config.context_length :]
        generated: list[int] = []

        min_generated_tokens = min(4, max_new_tokens)

        for step in range(max_new_tokens):
            logits = self.next_logits(
                tf.constant([context], dtype=tf.int32)
            )[0]

            blocked_ids = [
                tokenizer.vocab["<pad>"],
                tokenizer.vocab["<bos>"],
                tokenizer.vocab["<unk>"],
            ]
            if step < min_generated_tokens:
                blocked_ids.append(tokenizer.vocab["<eos>"])

            blocked = tf.reduce_any(
                tf.one_hot(
                    blocked_ids,
                    depth=self.config.vocab_size,
                    dtype=tf.bool,
                    on_value=True,
                    off_value=False,
                ),
                axis=0,
            )
            logits = tf.where(blocked, tf.fill(tf.shape(logits), tf.constant(-1e9)), logits)

            if temperature <= 1e-6:
                next_id = int(tf.argmax(logits).numpy())
            else:
                scaled = logits / temperature
                if top_k > 0:
                    k = min(top_k, self.config.vocab_size)
                    values, indices = tf.math.top_k(scaled, k=k)
                    sampled = tf.random.categorical(values[tf.newaxis, :], 1)[0, 0]
                    next_id = int(indices[sampled].numpy())
                else:
                    sampled = tf.random.categorical(scaled[tf.newaxis, :], 1)[0, 0]
                    next_id = int(sampled.numpy())

            if next_id == tokenizer.vocab["<eos>"]:
                return tokenizer.decode(generated), "stop"

            generated.append(next_id)
            context.append(next_id)
            context = context[-self.config.context_length :]

        return tokenizer.decode(generated), "length"


def build_model(config: OriLMConfig | None = None) -> OriLanguageModel:
    config = config or OriLMConfig()
    model = OriLanguageModel(config, name="ori_language_model")
    model(tf.zeros((1, min(2, config.context_length)), dtype=tf.int32))
    return model
