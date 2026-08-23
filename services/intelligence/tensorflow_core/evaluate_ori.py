"""Evaluate an Ori checkpoint against a small held-out behavior set.

This intentionally measures useful Ori behavior, not just training loss.
It can be expanded as the evaluation corpus grows.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import tensorflow as tf

from ori_model import OriLMConfig, OriLanguageModel, OriTokenizer


def load_eval(path: Path) -> list[dict]:
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            rows.append(json.loads(line))
    if not rows:
        raise ValueError("Evaluation dataset is empty")
    return rows


def score_completion(model, tokenizer, prompt: str, expected: str) -> float:
    prefix = tokenizer.encode(prompt, add_bos=True, add_eos=False)
    target = tokenizer.encode(expected, add_bos=False, add_eos=True)
    if not target:
        return 0.0

    ids = prefix[: model.config.context_length]
    correct = 0
    total = 0
    for token in target:
        if not ids:
            break
        logits = model.next_logits(tf.constant([ids], dtype=tf.int32))[0]
        prediction = int(tf.argmax(logits).numpy())
        correct += prediction == token
        total += 1
        ids.append(token)
        ids = ids[-model.config.context_length:]
    return correct / total if total else 0.0


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/ori_eval.jsonl")
    parser.add_argument("--artifact", default="artifacts/ori-small")
    args = parser.parse_args()

    artifact = Path(args.artifact)
    vocab = OriTokenizer.load(artifact / "vocab.json")
    config_data = json.loads((artifact / "config.json").read_text(encoding="utf-8"))
    config = OriLMConfig(**config_data)
    model = OriLanguageModel(config, name="ori_language_model")
    model(tf.zeros((1, 2), dtype=tf.int32))
    model.load_weights(artifact / "model.weights.h5")

    rows = load_eval(Path(args.data))
    scores = [score_completion(model, vocab, r["prompt"], r["expected"]) for r in rows]
    result = {
        "examples": len(scores),
        "mean_token_accuracy": float(np.mean(scores)),
        "passed": int(sum(score >= r.get("minimum_score", 0.0) for score, r in zip(scores, rows))),
    }
    result["pass_rate"] = result["passed"] / result["examples"]
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
