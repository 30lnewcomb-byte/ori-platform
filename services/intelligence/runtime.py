"""Ori's server-side TensorFlow intelligence runtime."""

from __future__ import annotations

import hmac
import json
import logging
import os
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


def build_prompt(
    messages: list[ChatMessage],
    tools: list[dict[str, Any]] | None = None,
) -> str:
    turns: list[str] = []
    for message in messages:
        if message.role == "system":
            continue
        if message.role == "user":
            turns.append(f"User: {message.content.strip()}")
        elif message.role == "assistant":
            turns.append(f"Ori: {message.content.strip()}")
        elif message.role == "tool":
            turns.append(f"Tool: {message.content.strip()}")

    if tools:
        tool_descriptions: list[str] = []
        for tool in tools:
            if tool.get("type") != "function":
                continue
            function = tool.get("function") or {}
            name = function.get("name")
            parameters = function.get("parameters") or {}
            properties = parameters.get("properties") or {}
            if isinstance(name, str) and name:
                args = ", ".join(str(key) for key in properties.keys())
                tool_descriptions.append(f"{name}({args})")
        if tool_descriptions:
            turns.append(
                "Available internal tools: "
                + "; ".join(tool_descriptions)
                + ". When a tool is required, output only a JSON object with "
                + "'tool' and the tool arguments."
            )

    return " ".join(turns) + " Ori:"


def extract_json_object(text: str) -> dict[str, Any] | None:
    decoder = json.JSONDecoder()
    for match in re.finditer(r"\\{", text):
        try:
            value, _ = decoder.raw_decode(text[match.start():])
        except json.JSONDecodeError:
            continue
        if isinstance(value, dict):
            return value
    return None


def normalize_tool_call(
    content: str,
    tools: list[dict[str, Any]] | None,
) -> tuple[str, list[dict[str, Any]]]:
    if not tools:
        return content, []

    allowed: dict[str, dict[str, Any]] = {}
    for tool in tools:
        if tool.get("type") != "function":
            continue
        function = tool.get("function") or {}
        name = function.get("name")
        if isinstance(name, str) and name:
            allowed[name] = function

    candidate = extract_json_object(content)
    if not candidate:
        return content, []

    tool_name = candidate.get("tool")
    if not isinstance(tool_name, str) or tool_name not in allowed:
        return content, []

    call_id = f"call_{uuid.uuid4().hex[:12]}"
    arguments = {
        key: value for key, value in candidate.items() if key != "tool"
    }

    if tool_name == "run_sandbox_command":
        command = arguments.get("command")
        args = arguments.get("args", [])
        if not isinstance(command, str) or not command:
            return content, []
        if not isinstance(args, list) or not all(
            isinstance(value, str) for value in args
        ):
            return content, []
        arguments = {"command": command, "args": args[:32]}

    elif tool_name == "write_workspace_file":
        path = arguments.get("path")
        file_content = arguments.get("content")
        if not isinstance(path, str) or not isinstance(file_content, str):
            return content, []
        arguments = {"path": path, "content": file_content}

    return "", [
        {
            "id": call_id,
            "type": "function",
            "function": {
                "name": tool_name,
                "arguments": json.dumps(arguments, separators=(",", ":")),
            },
        }
    ]




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
    content, finish_reason = model.generate(
        tokenizer,
        prompt,
        max_new_tokens=payload.max_tokens,
        temperature=payload.temperature,
        top_k=payload.top_k,
    )
    content = content.split("User:", 1)[0].strip()
    content, tool_calls = normalize_tool_call(content, payload.tools)
    if not content and not tool_calls:
        raise HTTPException(status_code=502, detail="Ori's TensorFlow language model produced no usable text.")

    return {
        "content": content,
        "model": "ori-small",
        "version": APP_VERSION,
        "finish_reason": finish_reason,
        "tool_calls": tool_calls,
    }
