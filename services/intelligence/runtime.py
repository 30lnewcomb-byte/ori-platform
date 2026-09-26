"""Ori's server-side TensorFlow intelligence runtime.

The web app talks to this service over an authenticated internal API.
Models are loaded from the runtime filesystem; they are never sent to the browser.
"""

from __future__ import annotations

import hmac
import os
from pathlib import Path
from typing import Any

import tensorflow as tf
from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

from tensorflow_core.model import LABELS, OriCoreModel


APP_VERSION = "0.1.0"
MODEL_DIR = Path(os.getenv("ORI_MODEL_DIR", "models"))
API_KEY = os.getenv("ORI_INTELLIGENCE_API_KEY", "").strip()

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
    return OriCoreModel(tf.keras.models.load_model(model_path))


CORE_MODEL = load_core_model()


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
        }
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
    # A classifier is not a language generator. Keep this endpoint explicit until
    # an actual trained TensorFlow generative model is registered.
    raise HTTPException(
        status_code=501,
        detail="No TensorFlow generative chat model is registered yet. Use /v1/predict for the current trained core.",
    )
