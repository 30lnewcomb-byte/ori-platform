"""Specialized native TensorFlow workers for Ori.

The manager/orchestrator owns routing, permissions, and tool execution.
Workers only transform an assigned task into a learned result.
"""

from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
from typing import Any

import tensorflow as tf

from ori_model import OriLMConfig, OriLanguageModel, OriTokenizer


@dataclass(frozen=True)
class WorkerSpec:
    worker_id: str
    task: str
    model_dir: str


WORKERS = {
    "coding": WorkerSpec("ori-coder", "code-generation", "artifacts/ori-coder"),
    "3d": WorkerSpec("ori-3d", "parametric-cad-generation", "artifacts/ori-3d"),
}


@dataclass
class LoadedWorker:
    spec: WorkerSpec
    model: OriLanguageModel
    tokenizer: OriTokenizer


def load_worker(spec: WorkerSpec) -> LoadedWorker | None:
    root = Path(spec.model_dir)
    config_path = root / "config.json"
    tokenizer_path = root / "ori_tokenizer.model"
    weights_path = root / "model.weights.h5"

    if not (config_path.exists() and tokenizer_path.exists() and weights_path.exists()):
        return None

    try:
        config = OriLMConfig(**json.loads(config_path.read_text(encoding="utf-8")))
        tokenizer = OriTokenizer.load(tokenizer_path)
        model = OriLanguageModel(config, name=f"{spec.worker_id}_language_model")
        model(tf.zeros((1, min(2, config.context_length)), dtype=tf.int32))
        model.load_weights(weights_path)
        return LoadedWorker(spec=spec, model=model, tokenizer=tokenizer)
    except Exception:
        return None


def generate_worker(
    worker: LoadedWorker,
    prompt: str,
    *,
    max_tokens: int = 160,
    temperature: float = 0.15,
    top_k: int = 8,
) -> str:
    worker_prompt = f"Task: {prompt.strip()}\nResult:"
    text, _ = worker.model.generate(
        worker.tokenizer,
        worker_prompt,
        max_new_tokens=max_tokens,
        temperature=temperature,
        top_k=top_k,
    )
    return text.split("Task:", 1)[0].strip()


def compile_cad_plan(plan: dict[str, Any]) -> str:
    """Compile a constrained learned CAD plan into valid OpenSCAD source.

    The worker predicts the plan. This compiler performs no design reasoning;
    it only turns approved primitives/transforms into deterministic geometry.
    """

    operations = plan.get("operations")
    if not isinstance(operations, list) or not operations:
        raise ValueError("CAD plan must contain a non-empty operations list.")

    lines = ["$fn = 48;", ""]
    for op in operations:
        if not isinstance(op, dict):
            raise ValueError("Each CAD operation must be an object.")
        kind = op.get("kind")
        if kind == "cube":
            size = op.get("size")
            center = bool(op.get("center", True))
            if not (
                isinstance(size, list)
                and len(size) == 3
                and all(isinstance(v, (int, float)) and v > 0 for v in size)
            ):
                raise ValueError("cube.size must contain three positive numbers.")
            lines.append(
                f"cube([{size[0]}, {size[1]}, {size[2]}], center={str(center).lower()});"
            )
        elif kind == "cylinder":
            radius = op.get("radius")
            height = op.get("height")
            center = bool(op.get("center", True))
            if not (
                isinstance(radius, (int, float))
                and radius > 0
                and isinstance(height, (int, float))
                and height > 0
            ):
                raise ValueError("cylinder requires positive radius and height.")
            lines.append(
                f"cylinder(r={radius}, h={height}, center={str(center).lower()});"
            )
        elif kind == "translate":
            value = op.get("value")
            if not (
                isinstance(value, list)
                and len(value) == 3
                and all(isinstance(v, (int, float)) for v in value)
            ):
                raise ValueError("translate.value must contain three numbers.")
            lines.append(
                f"translate([{value[0]}, {value[1]}, {value[2]}]) {{"
            )
            lines.extend(["  // nested geometry", "  cube([1,1,1], center=true);", "};"])
        elif kind == "rotate":
            value = op.get("value")
            if not (
                isinstance(value, list)
                and len(value) == 3
                and all(isinstance(v, (int, float)) for v in value)
            ):
                raise ValueError("rotate.value must contain three numbers.")
            lines.append(
                f"rotate([{value[0]}, {value[1]}, {value[2]}]) cube([1,1,1], center=true);"
            )
        else:
            raise ValueError(f"Unsupported CAD operation: {kind!r}")

    return "\n".join(lines)
