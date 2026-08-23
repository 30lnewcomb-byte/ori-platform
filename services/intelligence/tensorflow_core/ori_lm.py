"""Small custom TensorFlow language model for Ori.

This is Ori's own learned-language path. It is intentionally separate from
Mentor (currently Qwen3-0.6B), so Mentor can assist while Ori's model grows.
"""

from __future__ import annotations

from dataclasses import dataclass

import tensorflow as tf


@dataclass(frozen=True)
class OriLMConfig:
    vocab_size: int = 8192
    max_sequence_length: int = 256
    d_model: int = 256
    num_heads: int = 4
    num_layers: int = 4
    feed_forward_dim: int = 1024
    dropout: float = 0.1


class CausalBlock(tf.keras.layers.Layer):
    def __init__(self, config: OriLMConfig, **kwargs):
        super().__init__(**kwargs)
        self.norm1 = tf.keras.layers.LayerNormalization(epsilon=1e-5)
        self.attention = tf.keras.layers.MultiHeadAttention(
            num_heads=config.num_heads,
            key_dim=config.d_model // config.num_heads,
            dropout=config.dropout,
        )
        self.norm2 = tf.keras.layers.LayerNormalization(epsilon=1e-5)
        self.ffn = tf.keras.Sequential([
            tf.keras.layers.Dense(config.feed_forward_dim, activation=tf.nn.gelu),
            tf.keras.layers.Dropout(config.dropout),
            tf.keras.layers.Dense(config.d_model),
        ])
        self.dropout = tf.keras.layers.Dropout(config.dropout)

    def call(self, x, training=False):
        y = self.norm1(x)
        y = self.attention(y, y, use_causal_mask=True, training=training)
        x = x + self.dropout(y, training=training)
        x = x + self.dropout(self.ffn(self.norm2(x), training=training), training=training)
        return x


class OriLanguageModel(tf.keras.Model):
    """Compact decoder-only Transformer implemented entirely in TensorFlow."""

    def __init__(self, config: OriLMConfig, **kwargs):
        super().__init__(**kwargs)
        self.config = config
        self.token_embedding = tf.keras.layers.Embedding(config.vocab_size, config.d_model)
        self.position_embedding = tf.keras.layers.Embedding(config.max_sequence_length, config.d_model)
        self.blocks = [CausalBlock(config, name=f"ori_block_{i}") for i in range(config.num_layers)]
        self.final_norm = tf.keras.layers.LayerNormalization(epsilon=1e-5)
        self.output = tf.keras.layers.Dense(config.vocab_size)

    def call(self, token_ids, training=False):
        length = tf.shape(token_ids)[1]
        positions = tf.range(length)[tf.newaxis, :]
        x = self.token_embedding(token_ids) + self.position_embedding(positions)
        for block in self.blocks:
            x = block(x, training=training)
        return self.output(self.final_norm(x))

    def next_token_logits(self, token_ids):
        return self(token_ids, training=False)[:, -1, :]


if __name__ == "__main__":
    config = OriLMConfig()
    model = OriLanguageModel(config)
    logits = model(tf.zeros((1, 8), dtype=tf.int32))
    print(model.name, logits.shape)
    print(f"Parameters: {model.count_params():,}")
