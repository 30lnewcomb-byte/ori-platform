"""Run Mentor reviews over an Ori evaluation set and write training candidates."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from mentor import QwenMentor, MentorUnavailable


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/ori_eval_expanded.jsonl")
    parser.add_argument("--output", default="artifacts/mentor/mentor_candidates.jsonl")
    parser.add_argument("--ori-answer", default="")
    args = parser.parse_args()

    rows = []
    for line in Path(args.data).read_text(encoding="utf-8").splitlines():
        if line.strip():
            rows.append(json.loads(line))

    mentor = QwenMentor()
    if not mentor.enabled:
        raise MentorUnavailable(
            "Mentor loop is installed but disabled. Configure ORI_MENTOR_URL "
            "before making network calls to a Qwen Mentor service."
        )

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    written = 0
    with output.open("w", encoding="utf-8") as handle:
        for row in rows:
            # This runner expects the caller to provide Ori's generated answer.
            # It never substitutes Mentor output for Ori's model output.
            ori_answer = args.ori_answer or ""
            result = mentor.review(row["prompt"], ori_answer, row["expected"])
            candidate = {
                "prompt": row["prompt"],
                "answer": result.corrected_answer,
                "mentor_rationale": result.rationale,
                "source": "qwen-mentor",
            }
            handle.write(json.dumps(candidate, ensure_ascii=False) + "\n")
            written += 1

    print(json.dumps({"candidates_written": written, "output": str(output)}, indent=2))


if __name__ == "__main__":
    main()
