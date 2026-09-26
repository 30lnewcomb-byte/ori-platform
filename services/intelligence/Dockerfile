FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000 \
    ORI_LM_DIR=/app/services/intelligence/artifacts/ori-small

WORKDIR /app

COPY services/intelligence/requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY services/intelligence ./services/intelligence

WORKDIR /app/services/intelligence

# Build the bootstrap learned Ori language model into the image so the runtime
# never silently falls back to a scripted response path.
RUN python tensorflow_core/train_ori.py \
    --data tensorflow_core/data/ori_training_expanded.jsonl \
    --output artifacts/ori-small \
    --epochs 20 \
    --batch-size 8 \
    --validation-split 0

EXPOSE 8000
CMD ["sh", "start.sh"]
