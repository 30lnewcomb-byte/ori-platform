"""Generate real Ori answers and ask the Mentor to review them."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from generate_ori import generate, load_model
from mentor import MentorUnavailable, QwenMentor


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/ori_eval_expanded.jsonl")
    parser.add_argument("--artifact", default="artifacts/ori-small")
    parser.add_argument("--output", default="artifacts/mentor/mentor_candidates.jsonl")
    parser.add_argument("--max-new-tokens", type=int, default=64)
    args = parser.parse_args()

    if not QwenMentor().enabled:
        raise MentorUnavailable(
            "Mentor loop is installed but disabled. Configure ORI_MENTOR_URL "
            "before making network calls to a Qwen Mentor service."
        )

    model, tokenizer = load_model(Path(args.artifact))
    mentor = QwenMentor()
    rows = [
        json.loads(line)
        for line in Path(args.data).read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    written = 0
    with output.open("w", encoding="utf-8") as handle:
        for row in rows:
            ori_answer = generate(model, tokenizer, row["prompt"], args.max_new_tokens)
            result = mentor.review(row["prompt"], ori_answer, row["expected"])
            candidate = {
                "prompt": row["prompt"],
                "ori_answer": ori_answer,
                "answer": result.corrected_answer,
                "mentor_rationale": result.rationale,
                "source": "qwen-mentor",
            }
            handle.write(json.dumps(candidate, ensure_ascii=False) + "\n")
            written += 1

    print(json.dumps({"candidates_written": written, "output": str(output)}, indent=2))


if __name__ == "__main__":
    main()
