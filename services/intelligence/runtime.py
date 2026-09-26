"""Ori's server-side TensorFlow intelligence runtime."""

from __future__ import annotations

import hmac
import json
import logging
import os
import re
from pathlib import Path
from typing import Any

import tensorflow as tf
from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

from tensorflow_core.model import LABELS, OriCoreModel
from tensorflow_core.ori_model import OriLMConfig, OriLanguageModel, OriTokenizer


APP_VERSION = "0.2.0"
MODEL_DIR = Path(os.getenv("ORI_MODEL_DIR", "models"))
LM_DIR = Path(os.getenv("ORI_LM_DIR", "artifacts/ori-small"))
API_KEY = os.getenv("ORI_INTELLIGENCE_API_KEY", "").strip()

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("ori-tensorflow-runtime")

app = FastAPI(title="Ori TensorFlow Intelligence Runtime", version=APP_VERSION)


class PredictRequest(BaseModel):
    text: str = Field(min_length=1, max_length=12000)


class PredictResponse(BaseModel):
    model: str
    version: str
    label: str
    confidence: float


class ChatMessage(BaseModel):
    role: str
    content: str = Field(min_length=1, max_length=12000)


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1, max_length=32)
    temperature: float = Field(default=0.2, ge=0, le=2)
    max_tokens: int = Field(default=96, ge=1, le=256)
    top_k: int = Field(default=20, ge=0, le=128)
    tools: list[dict[str, Any]] | None = None


def require_api_key(authorization: str | None = Header(default=None)) -> None:
    if not API_KEY:
        raise HTTPException(status_code=503, detail="Intelligence runtime credentials are not configured.")
    expected = f"Bearer {API_KEY}"
    if not authorization or not hmac.compare_digest(authorization, expected):
        raise HTTPException(status_code=401, detail="Unauthorized.")


def load_core_model() -> OriCoreModel | None:
    model_path = MODEL_DIR / "ori_core.keras"
    if not model_path.exists():
        return None
    try:
        return OriCoreModel(tf.keras.models.load_model(model_path))
    except Exception:
        logger.exception("Failed to load Ori Core classifier from %s", model_path)
        return None


def load_language_model() -> tuple[OriLanguageModel, OriTokenizer] | None:
    config_path = LM_DIR / "config.json"
    vocab_path = LM_DIR / "vocab.json"
    weights_path = LM_DIR / "model.weights.h5"
    if not (config_path.exists() and vocab_path.exists() and weights_path.exists()):
        return None

    try:
        config = OriLMConfig(**json.loads(config_path.read_text(encoding="utf-8")))
        tokenizer = OriTokenizer.load(vocab_path)
        model = OriLanguageModel(config, name="ori_language_model")
        model(tf.zeros((1, min(2, config.context_length)), dtype=tf.int32))
        model.load_weights(weights_path)
        return model, tokenizer
    except Exception:
        logger.exception("Failed to load Ori language model from %s", LM_DIR)
        return None


CORE_MODEL = load_core_model()
LANGUAGE_MODEL = load_language_model()


TOOL_CALL_PATTERN = re.compile(r"TOOL_CALL\\s*(\\{.*?\\})\\s*END_TOOL", re.DOTALL)


def build_tool_context(tools: list[dict[str, Any]]) -> str:
    entries: list[str] = []
    for tool in tools[:8]:
        function = tool.get("function") if isinstance(tool, dict) else None
        if not isinstance(function, dict):
            continue
        name = function.get("name")
        parameters = function.get("parameters")
        if not isinstance(name, str):
            continue
        properties = parameters.get("properties", {}) if isinstance(parameters, dict) else {}
        required = parameters.get("required", []) if isinstance(parameters, dict) else []
        argument_names = list(properties.keys()) if isinstance(properties, dict) else []
        entries.append(
            f"- {name}: args={','.join(argument_names) or 'none'}"
            f"; required={','.join(str(x) for x in required) or 'none'}"
        )
    if not entries:
        return ""
    return (
        "Available tools: "
        + " ".join(entries)
        + " When a tool is needed, output exactly "
        + 'TOOL_CALL {"name":"tool_name","arguments":{...}} END_TOOL'
        + " and do not invent tools. After a tool result, continue normally."
    )


def build_prompt(messages: list[ChatMessage], tools: list[dict[str, Any]] | None = None) -> str:
    turns: list[str] = []
    for message in messages:
        content = message.content.strip()
        if message.role == "system":
            turns.append(f"System: {content}")
        elif message.role == "user":
            turns.append(f"User: {content}")
        elif message.role == "assistant":
            turns.append(f"Ori: {content}")
        elif message.role == "tool":
            turns.append(f"Tool: {content}")
    tool_context = build_tool_context(tools or [])
    if tool_context:
        turns.insert(1 if turns else 0, tool_context)
    return " ".join(turns) + " Ori:"


def parse_tool_calls(text: str) -> tuple[str, list[dict[str, Any]]]:
    calls: list[dict[str, Any]] = []
    for index, match in enumerate(TOOL_CALL_PATTERN.finditer(text), start=1):
        try:
            payload = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        if not isinstance(payload, dict):
            continue
        name = payload.get("name")
        arguments = payload.get("arguments", {})
        if not isinstance(name, str) or not name.strip() or not isinstance(arguments, dict):
            continue
        calls.append(
            {
                "id": f"ori-call-{index}",
                "type": "function",
                "function": {
                    "name": name.strip(),
                    "arguments": json.dumps(arguments, separators=(",", ":")),
                },
            }
        )
    cleaned = TOOL_CALL_PATTERN.sub("", text).strip()
    return cleaned, calls


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ori-tensorflow-runtime"}


@app.get("/v1/status")
def status(_: None = Depends(require_api_key)) -> dict[str, Any]:
    return {
        "service": "ori-tensorflow-runtime",
        "status": "online",
        "version": APP_VERSION,
        "backend": "tensorflow",
        "core_model_loaded": CORE_MODEL is not None,
        "language_model_loaded": LANGUAGE_MODEL is not None,
        "language_model_id": "ori-small" if LANGUAGE_MODEL is not None else None,
    }


@app.get("/v1/models")
def models(_: None = Depends(require_api_key)) -> dict[str, Any]:
    entries = [
        {
            "id": "ori-core",
            "version": "0.1.0",
            "framework": "tensorflow",
            "task": "intent-classification",
            "status": "ready" if CORE_MODEL is not None else "registered",
            "labels": list(LABELS),
        },
        {
            "id": "ori-small",
            "version": APP_VERSION,
            "framework": "tensorflow",
            "task": "causal-language-model",
            "status": "ready" if LANGUAGE_MODEL is not None else "registered",
            "parameters": "compact",
        },
    ]
    return {"models": entries}


@app.post("/v1/predict", response_model=PredictResponse)
def predict(payload: PredictRequest, _: None = Depends(require_api_key)) -> PredictResponse:
    if CORE_MODEL is None:
        raise HTTPException(status_code=503, detail="No trained TensorFlow core model is loaded.")
    result = CORE_MODEL.predict(payload.text)
    return PredictResponse(
        model="ori-core",
        version="0.1.0",
        label=result.label,
        confidence=result.confidence,
    )


@app.post("/v1/chat")
def chat(payload: ChatRequest, _: None = Depends(require_api_key)) -> dict[str, Any]:
    if LANGUAGE_MODEL is None:
        raise HTTPException(status_code=503, detail="No trained Ori TensorFlow language model is loaded.")

    prompt = build_prompt(payload.messages, payload.tools)
    model, tokenizer = LANGUAGE_MODEL
    generated, finish_reason = model.generate(
        tokenizer,
        prompt,
        max_new_tokens=payload.max_tokens,
        temperature=payload.temperature,
        top_k=payload.top_k,
    )
    generated = generated.split("User:", 1)[0].strip()
    content, tool_calls = parse_tool_calls(generated)
    if not content and not tool_calls:
        raise HTTPException(status_code=502, detail="Ori's TensorFlow language model produced no usable text.")

    return {
        "content": content,
        "model": "ori-small",
        "version": APP_VERSION,
        "finish_reason": "tool_calls" if tool_calls else finish_reason,
        "tool_calls": tool_calls,
    }
