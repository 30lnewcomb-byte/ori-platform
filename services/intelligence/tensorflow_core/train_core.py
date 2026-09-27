"""Train Ori's compact native TensorFlow intent classifier."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import tensorflow as tf

from model import LABELS, OriCoreModel


TRAINING_DATA = [
    ("conversation", "hello Ori"),
    ("conversation", "hi there"),
    ("conversation", "good morning"),
    ("conversation", "thanks Ori"),
    ("conversation", "nice to see you"),
    ("conversation", "what are we working on"),
    ("conversation", "talk with me"),
    ("conversation", "are you online"),
    ("question", "what is TensorFlow"),
    ("question", "what framework does Ori use"),
    ("question", "what is Ori Core"),
    ("question", "why is identity outside the model"),
    ("question", "what does server side mean"),
    ("question", "why keep the API key private"),
    ("question", "what is a language model"),
    ("question", "how does a transformer work"),
    ("coding", "write Python code"),
    ("coding", "help me code a web app"),
    ("coding", "create a function"),
    ("coding", "write a JavaScript example"),
    ("coding", "show me how to use an API"),
    ("coding", "make a script for this"),
    ("coding", "help me program this"),
    ("coding", "write the code for the feature"),
    ("planning", "plan this project"),
    ("planning", "break this into tasks"),
    ("planning", "make a roadmap"),
    ("planning", "what should we build first"),
    ("planning", "help me organize the work"),
    ("planning", "design the next phase"),
    ("planning", "give me a project plan"),
    ("planning", "how should we structure this"),
    ("troubleshooting", "why is this broken"),
    ("troubleshooting", "help me debug this error"),
    ("troubleshooting", "fix my failing build"),
    ("troubleshooting", "why did deployment fail"),
    ("troubleshooting", "find the bug in this code"),
    ("troubleshooting", "the server is returning an error"),
    ("troubleshooting", "help me diagnose this problem"),
    ("troubleshooting", "something stopped working"),
    ("creative", "write a story idea"),
    ("creative", "give me a joke"),
    ("creative", "invent a character"),
    ("creative", "brainstorm a game"),
    ("creative", "write a scene"),
    ("creative", "come up with a fun idea"),
    ("creative", "make a creative concept"),
    ("creative", "help me design a fictional world"),
]


def build_dataset() -> tuple[list[str], list[int]]:
    label_to_id = {label: index for index, label in enumerate(LABELS)}
    texts = [text for label, text in TRAINING_DATA]
    labels = [label_to_id[label] for label, _ in TRAINING_DATA]
    return texts, labels


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="models/ori_core.keras")
    parser.add_argument("--epochs", type=int, default=30)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--validation-split", type=float, default=0.2)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    if not 0 < args.validation_split < 1:
        raise ValueError("--validation-split must be between 0 and 1")

    tf.keras.utils.set_random_seed(args.seed)

    texts, labels = build_dataset()
    model = OriCoreModel.build(max_tokens=4096, sequence_length=96)
    model.adapt(texts)

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)

    history = model.model.fit(
        tf.constant(texts),
        tf.constant(labels, dtype=tf.int32),
        batch_size=args.batch_size,
        epochs=args.epochs,
        validation_split=args.validation_split,
        shuffle=True,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor="val_accuracy",
                patience=5,
                mode="max",
                restore_best_weights=True,
            ),
        ],
        verbose=2,
    )

    model.save(output)

    summary = {
        "model": "ori-core",
        "examples": len(texts),
        "labels": list(LABELS),
        "epochs_completed": len(history.history["loss"]),
        "final_loss": history.history["loss"][-1],
        "final_accuracy": history.history["accuracy"][-1],
        "final_val_loss": history.history.get("val_loss", [None])[-1],
        "final_val_accuracy": history.history.get("val_accuracy", [None])[-1],
        "seed": args.seed,
    }
    summary_path = output.with_suffix(".training.json")
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
