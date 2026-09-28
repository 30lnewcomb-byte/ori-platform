"""Public-domain English corpus loader for Ori pretraining.

The bootstrap language model learns general English from a small, reproducible
set of public-domain Project Gutenberg texts before Ori-specific fine-tuning.
"""

from __future__ import annotations

import re
from urllib.request import Request, urlopen


PUBLIC_DOMAIN_SOURCES = (
    ("alice", "https://www.gutenberg.org/files/11/11-0.txt"),
    ("oz", "https://www.gutenberg.org/files/55/55-0.txt"),
    ("sherlock", "https://www.gutenberg.org/files/1661/1661-0.txt"),
    ("tom_sawyer", "https://www.gutenberg.org/files/74/74-0.txt"),
)


def _download(url: str) -> str:
    request = Request(
        url,
        headers={"User-Agent": "Ori-TensorFlow-Pretraining/0.1"},
    )
    with urlopen(request, timeout=45) as response:
        return response.read().decode("utf-8", errors="replace")


def _strip_gutenberg(text: str) -> str:
    text = text.replace("\r", "")
    start = re.search(r"\*\*\* START OF (?:THE )?PROJECT GUTENBERG", text, re.IGNORECASE)
    end = re.search(r"\*\*\* END OF (?:THE )?PROJECT GUTENBERG", text, re.IGNORECASE)
    if start:
        text = text[start.end():]
    if end:
        text = text[: end.start()]
    return text


def _paragraphs(text: str) -> list[str]:
    paragraphs: list[str] = []
    for raw in re.split(r"\n\s*\n", _strip_gutenberg(text)):
        paragraph = re.sub(r"\s+", " ", raw).strip()
        if not paragraph:
            continue
        if paragraph.startswith("Project Gutenberg"):
            continue
        if 40 <= len(paragraph) <= 2400:
            paragraphs.append(paragraph)
    return paragraphs


def download_public_domain_english(max_chars: int = 360_000) -> list[str]:
    """Return a bounded, mixed public-domain English corpus.

    A bounded corpus keeps Render's free CPU build practical while still giving
    the tokenizer and language model substantially more English than the Ori
    dialogue-only bootstrap set.
    """

    if max_chars < 10_000:
        raise ValueError("max_chars must be at least 10000")

    per_source = max(20_000, max_chars // len(PUBLIC_DOMAIN_SOURCES))
    collected: list[str] = []
    total = 0

    for name, url in PUBLIC_DOMAIN_SOURCES:
        try:
            paragraphs = _paragraphs(_download(url))
        except Exception as exc:
            print(f"English source unavailable ({name}): {exc}")
            continue

        source_chars = 0
        for paragraph in paragraphs:
            if source_chars >= per_source or total >= max_chars:
                break
            remaining = min(per_source - source_chars, max_chars - total)
            if len(paragraph) > remaining:
                paragraph = paragraph[:remaining].rsplit(" ", 1)[0]
            if len(paragraph) < 40:
                continue
            collected.append(paragraph)
            source_chars += len(paragraph)
            total += len(paragraph)

        if total >= max_chars:
            break

    if not collected:
        raise RuntimeError("Could not download any English pretraining text.")

    print(
        f"English pretraining corpus: {len(collected)} passages, "
        f"{total:,} characters."
    )
    return collected
