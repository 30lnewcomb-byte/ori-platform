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
    ("pride_prejudice", "https://www.gutenberg.org/files/1342/1342-0.txt"),
    ("frankenstein", "https://www.gutenberg.org/files/84/84-0.txt"),
    ("jane_eyre", "https://www.gutenberg.org/files/1260/1260-0.txt"),
    ("little_women", "https://www.gutenberg.org/files/514/514-0.txt"),
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



def everyday_english() -> list[str]:
    """Generate clean, grammar-safe modern English and short dialogue."""
    sentences: list[str] = []

    first_plural_subjects = ["I", "you", "we", "they"]
    actions = [
        "need", "want", "like", "use", "check", "open", "close", "read",
        "write", "test", "build", "learn", "understand", "remember",
    ]
    objects = [
        "the file", "the project", "the code", "the result", "the answer",
        "the system", "the settings", "the device", "the program",
        "the model", "the data", "the task",
    ]
    for subject in first_plural_subjects:
        for action in actions:
            for obj in objects:
                sentences.append(f"{subject} {action} {obj}.")
                sentences.append(f"Do {subject.lower()} {action} {obj}?")
                sentences.append(f"{subject} can {action} {obj}.")
                sentences.append(f"{subject} will {action} {obj}.")
                if len(sentences) >= 3200:
                    break
            if len(sentences) >= 3200:
                break
        if len(sentences) >= 3200:
            break


    singular_subjects = [
        "the user", "the program", "the model", "the server",
        "the computer", "the printer", "the browser",
    ]
    singular_actions = [
        ("needs", "the file"), ("uses", "the data"), ("checks", "the result"),
        ("opens", "the project"), ("closes", "the file"), ("reads", "the code"),
        ("writes", "the output"), ("tests", "the program"), ("builds", "the project"),
        ("learns", "from examples"), ("explains", "the answer"), ("creates", "a file"),
        ("changes", "the settings"), ("finds", "the problem"), ("helps", "the user"),
    ]
    for subject in singular_subjects:
        for verb, obj in singular_actions:
            sentences.append(f"{subject} {verb} {obj}.")
            sentences.append(f"Does {subject} {verb[:-1] if verb.endswith('s') else verb} {obj}?")

    states = [
        ("The model", "is ready"), ("The server", "is online"),
        ("The program", "is running"), ("The file", "is available"),
        ("The result", "is correct"), ("The printer", "is paused"),
        ("The project", "is active"), ("The system", "is working"),
        ("The computer", "is connected"), ("The browser", "is open"),
    ]
    for subject, state in states:
        sentences.append(f"{subject} {state}.")
        sentences.append(f"Is {subject.lower()} {state[3:]}?")

    topics = [
        "Python", "JavaScript", "HTML", "CSS", "JSON", "an API",
        "a database", "a server", "a browser", "a neural network",
        "machine learning", "a 3D printer", "a 3D model", "a file",
        "a program", "a project", "a computer",
    ]
    for topic in topics:
        sentences.extend([
            f"What is {topic}?",
            f"Can you explain {topic}?",
            f"I want to learn about {topic}.",
            f"I have a question about {topic}.",
            f"I am working with {topic}.",
            f"I need help with {topic}.",
            f"How does {topic} work?",
            f"Why is {topic} useful?",
            f"What can {topic} do?",
            f"Can {topic} be changed?",
        ])

    common = [
        "Hello there.", "Hi.", "Good morning.", "Good afternoon.",
        "Good evening.", "Thanks.", "You're welcome.", "I don't know.",
        "I can't find it.", "I can't open the file.", "Let's try again.",
        "That makes sense.", "I understand.", "I need more information.",
        "Please explain that.", "Can you help me?", "What should I do next?",
        "Where do I start?", "What happened?", "Why did that happen?",
        "Is this correct?", "That looks good.", "The result is ready.",
        "The program is running.", "The model needs more training.",
        "The file was saved.", "The test passed.", "The test failed.",
        "The printer is online.", "The printer is paused.",
        "I am working on a project.", "We can solve this problem.",
        "Let's check the result.", "Please show me the code.",
    ]
    sentences.extend(common)

    return sentences


def download_public_domain_english(max_chars: int = 360_000) -> list[str]:
    """Return a diverse bounded English corpus with guaranteed modern-language exposure."""

    if max_chars < 10_000:
        raise ValueError("max_chars must be at least 10000")

    book_budget = int(max_chars * 0.80)
    modern_budget = max_chars - book_budget
    per_source = max(20_000, book_budget // len(PUBLIC_DOMAIN_SOURCES))
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
            if source_chars >= per_source or total >= book_budget:
                break
            remaining = min(per_source - source_chars, book_budget - total)
            if len(paragraph) > remaining:
                paragraph = paragraph[:remaining].rsplit(" ", 1)[0]
            if len(paragraph) < 40:
                continue
            collected.append(paragraph)
            source_chars += len(paragraph)
            total += len(paragraph)

        if total >= book_budget:
            break

    if not collected:
        raise RuntimeError("Could not download any English pretraining text.")

    modern = everyday_english()
    modern_used = 0
    for sentence in modern:
        if modern_used >= modern_budget:
            break
        remaining = modern_budget - modern_used
        text = sentence if len(sentence) <= remaining else sentence[:remaining].rsplit(" ", 1)[0]
        if len(text) < 10:
            continue
        collected.append(text)
        total += len(text)
        modern_used += len(text)

    print(
        f"English pretraining corpus: {len(collected)} passages, "
        f"{total:,} characters."
    )
    return collected
