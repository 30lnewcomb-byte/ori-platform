"""Train Ori's custom TensorFlow language model.

The script owns dataset loading, tokenizer creation, validation, checkpointing,
and final artifact metadata. Mentor/Qwen is intentionally outside this path.
"""

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
    texts: list[str] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON on line {line_number}") from exc
        if "text" in row:
            texts.append(str(row["text"]))
        elif "input" in row and "response" in row:
            texts.append(f"User: {row['input']} Ori: {row['response']}")
        else:
            raise ValueError(f"Line {line_number} needs text or input+response")
    if not texts:
        raise ValueError("Training dataset is empty")
    return texts


def make_arrays(texts: list[str], tokenizer: OriTokenizer, context: int):
    xs, ys = [], []
    for text in texts:
        ids = tokenizer.encode(text)[: context + 1]
        if len(ids) < 3:
            continue
        x, y = ids[:-1], ids[1:]
        pad = tokenizer.vocab["<pad>"]
        x += [pad] * (context - len(x))
        y += [pad] * (context - len(y))
        xs.append(x[:context])
        ys.append(y[:context])
    if not xs:
        raise ValueError("No usable sequences were produced")
    return np.asarray(xs, dtype=np.int32), np.asarray(ys, dtype=np.int32)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/ori_training.jsonl")
    parser.add_argument("--output", default="artifacts/ori-small")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--validation-split", type=float, default=0.2)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    if not 0 <= args.validation_split < 1:
        raise ValueError("--validation-split must be between 0 and 1")

    tf.keras.utils.set_random_seed(args.seed)
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)

    texts = load_records(Path(args.data))
    tokenizer = OriTokenizer.build(texts, vocab_size=8192)
    tokenizer.save(output / "vocab.json")

    config = OriLMConfig(vocab_size=len(tokenizer.vocab))
    model = OriLanguageModel(config, name="ori_language_model")
    model(tf.zeros((1, config.context_length), dtype=tf.int32))
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=3e-4, weight_decay=1e-4),
        loss=MaskedCausalLoss(config.pad_id),
    )

    x, y = make_arrays(texts, tokenizer, config.context_length)
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(output / "checkpoint" / "epoch-{epoch:02d}.weights.h5"),
            save_weights_only=True,
            save_best_only=False,
        ),
        tf.keras.callbacks.CSVLogger(str(output / "training.csv"), append=False),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=3,
            restore_best_weights=True,
        ),
    ]

    fit_kwargs = {
        "batch_size": args.batch_size,
        "epochs": args.epochs,
        "shuffle": True,
        "callbacks": callbacks,
    }
    if len(x) >= 5 and args.validation_split > 0:
        fit_kwargs["validation_split"] = args.validation_split

    history = model.fit(x, y, **fit_kwargs)
    model.save_weights(output / "model.weights.h5")
    (output / "config.json").write_text(
        json.dumps(config.__dict__, indent=2), encoding="utf-8"
    )
    (output / "training_summary.json").write_text(
        json.dumps(
            {
                "examples": len(texts),
                "vocabulary_size": len(tokenizer.vocab),
                "epochs_completed": len(history.history["loss"]),
                "final_loss": history.history["loss"][-1],
                "final_val_loss": history.history.get("val_loss", [None])[-1],
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Ori model saved to {output}")


if __name__ == "__main__":
    main()
