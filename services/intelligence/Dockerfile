FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1     PYTHONUNBUFFERED=1     PIP_NO_CACHE_DIR=1     PORT=8000

WORKDIR /app

COPY services/intelligence/requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY services/intelligence ./services/intelligence

WORKDIR /app/services/intelligence
EXPOSE 8000
CMD ["sh", "start.sh"]
