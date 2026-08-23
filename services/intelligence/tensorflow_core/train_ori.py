"""Train the custom Ori language model on JSONL conversation records."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import tensorflow as tf

from ori_model import OriLMConfig, OriLanguageModel, OriTokenizer


class MaskedCausalLoss(tf.keras.losses.Loss):
    def __init__(self, pad_id: int):
        super().__init__()
        self.pad_id = pad_id

    def call(self, y_true, y_pred):
        loss = tf.keras.losses.sparse_categorical_crossentropy(
            y_true, y_pred, from_logits=True
        )
        mask = tf.cast(tf.not_equal(y_true, self.pad_id), loss.dtype)
        return tf.reduce_sum(loss * mask) / tf.maximum(tf.reduce_sum(mask), 1.0)


def load_records(path: Path) -> list[str]:
    texts = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        row = json.loads(line)
        if "text" in row:
            texts.append(row["text"])
        elif "input" in row and "response" in row:
            texts.append(f"User: {row['input']} Ori: {row['response']}")
        else:
            raise ValueError("Each record needs text or input+response")
    if not texts:
        raise ValueError("Training dataset is empty")
    return texts


def make_arrays(texts: list[str], tokenizer: OriTokenizer, context: int):
    xs, ys = [], []
    for text in texts:
        ids = tokenizer.encode(text)
        ids = ids[: context + 1]
        if len(ids) < 3:
            continue
        x, y = ids[:-1], ids[1:]
        x += [tokenizer.vocab["<pad>"]] * (context - len(x))
        y += [tokenizer.vocab["<pad>"]] * (context - len(y))
        xs.append(x[:context])
        ys.append(y[:context])
    if not xs:
        raise ValueError("No usable sequences were produced")
    return np.asarray(xs, dtype=np.int32), np.asarray(ys, dtype=np.int32)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/ori_training.jsonl")
    parser.add_argument("--output", default="artifacts/ori-small")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch-size", type=int, default=8)
    args = parser.parse_args()

    texts = load_records(Path(args.data))
    tokenizer = OriTokenizer.build(texts, vocab_size=8192)
    tokenizer.save(Path(args.output) / "vocab.json")

    config = OriLMConfig(vocab_size=len(tokenizer.vocab))
    model = OriLanguageModel(config)
    model(tf.zeros((1, config.context_length), dtype=tf.int32))
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=3e-4, weight_decay=1e-4),
        loss=MaskedCausalLoss(config.pad_id),
    )

    x, y = make_arrays(texts, tokenizer, config.context_length)
    model.fit(x, y, batch_size=args.batch_size, epochs=args.epochs, shuffle=True)

    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    model.save_weights(output / "model.weights.h5")
    (output / "config.json").write_text(
        json.dumps(config.__dict__, indent=2), encoding="utf-8"
    )
    print(f"Ori model saved to {output}")


if __name__ == "__main__":
    main()
