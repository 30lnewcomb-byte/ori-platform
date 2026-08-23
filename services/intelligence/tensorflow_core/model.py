"""Small TensorFlow core model for Ori.

This is intentionally NOT Ori's future super model. It is a real, trainable
TensorFlow/Keras starting point for intent and complexity signals that the
orchestrator can use before the larger learned intelligence is developed.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import tensorflow as tf

LABELS = (
    "conversation",
    "question",
    "coding",
    "planning",
    "troubleshooting",
    "creative",
)


@dataclass(frozen=True)
class CorePrediction:
    label: str
    confidence: float


class OriCoreModel:
    """Tiny Keras text classifier used as Ori's first TensorFlow core."""

    def __init__(self, model: tf.keras.Model) -> None:
        self.model = model

    @staticmethod
    def build(max_tokens: int = 4096, sequence_length: int = 96) -> "OriCoreModel":
        vectorizer = tf.keras.layers.TextVectorization(
            max_tokens=max_tokens,
            output_mode="int",
            output_sequence_length=sequence_length,
            name="text_vectorizer",
        )

        inputs = tf.keras.Input(shape=(), dtype=tf.string, name="text")
        tokens = vectorizer(inputs)
        x = tf.keras.layers.Embedding(max_tokens, 64, name="embedding")(tokens)
        x = tf.keras.layers.GlobalAveragePooling1D(name="pool")(x)
        x = tf.keras.layers.Dense(64, activation="relu", name="hidden")(x)
        outputs = tf.keras.layers.Dense(len(LABELS), activation="softmax", name="intent")(x)
        model = tf.keras.Model(inputs=inputs, outputs=outputs, name="ori_core")
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"],
        )
        return OriCoreModel(model)

    def adapt(self, texts: list[str]) -> None:
        for layer in self.model.layers:
            if isinstance(layer, tf.keras.layers.TextVectorization):
                layer.adapt(tf.data.Dataset.from_tensor_slices(texts).batch(32))
                return
        raise RuntimeError("Ori Core model is missing its TextVectorization layer")

    def predict(self, text: str) -> CorePrediction:
        probabilities = self.model.predict(tf.constant([text]), verbose=0)[0]
        index = int(tf.argmax(probabilities).numpy())
        return CorePrediction(label=LABELS[index], confidence=float(probabilities[index]))

    def save(self, directory: str | Path) -> None:
        self.model.save(directory)


if __name__ == "__main__":
    core = OriCoreModel.build()
    core.adapt([
        "hello there",
        "what is python",
        "fix my code",
        "help me plan a project",
        "why is this broken",
        "write a story idea",
    ])
    prediction = core.predict("help me debug my Python project")
    print(prediction)
