"""Train Ori's native TensorFlow language model in two learned stages.

Stage 1: pretrain on a bounded public-domain English corpus.
Stage 2: fine-tune those same weights on Ori-specific conversation/tool data.

This keeps the model's language ability broader than a tiny set of canned Ori
responses while still giving it an Ori-specific behavior layer.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import tempfile

import numpy as np
import sentencepiece as spm
import tensorflow as tf

from english_corpus import download_public_domain_english
from ori_model import OriLMConfig, OriLanguageModel, OriTokenizer


class MaskedCausalLoss(tf.keras.losses.Loss):
    def __init__(self, pad_id: int):
        super().__init__()
        self.pad_id = pad_id

    def call(self, y_true, y_pred):
        loss = tf.keras.losses.sparse_categorical_crossentropy(
            y_true, y_pred, from_logits=True
        )
        mask = tf.cast(tf.not_equal(y_true, self.pad_id), loss.dtype)
        return tf.reduce_sum(loss * mask) / tf.maximum(tf.reduce_sum(mask), 1.0)


def load_records(path: Path) -> list[str]:
    texts: list[str] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON on line {line_number}") from exc
        if "text" in row:
            texts.append(str(row["text"]))
        elif "input" in row and "response" in row:
            texts.append(f"User: {row['input']} Ori: {row['response']}")
        else:
            raise ValueError(f"Line {line_number} needs text or input+response")
    if not texts:
        raise ValueError("Training dataset is empty")
    return texts


def train_tokenizer(
    texts: list[str],
    output: Path,
    vocab_size: int,
) -> OriTokenizer:
    corpus_path = output / "tokenizer-training.txt"
    corpus_path.write_text("\n".join(texts), encoding="utf-8")

    prefix = output / "ori_tokenizer"
    spm.SentencePieceTrainer.train(
        input=str(corpus_path),
        model_prefix=str(prefix),
        vocab_size=vocab_size,
        model_type="bpe",
        character_coverage=1.0,
        pad_id=0,
        bos_id=1,
        eos_id=2,
        unk_id=3,
        pad_piece="<pad>",
        bos_piece="<bos>",
        eos_piece="<eos>",
        unk_piece="<unk>",
        normalization_rule_name="nmt_nfkc",
        add_dummy_prefix=True,
        remove_extra_whitespaces=True,
        max_sentence_length=12000,
        shuffle_input_sentence=True,
        hard_vocab_limit=False,
        minloglevel=1,
    )

    model_path = output / "ori_tokenizer.model"
    if not model_path.exists():
        raise RuntimeError("SentencePiece tokenizer training did not produce a model.")

    return OriTokenizer.load(model_path)


def make_document_arrays(
    texts: list[str],
    tokenizer: OriTokenizer,
    context: int,
) -> tuple[np.ndarray, np.ndarray]:
    """Pack normal English documents into contiguous causal-LM windows."""

    stream: list[int] = []
    for text in texts:
        stream.extend(tokenizer.encode(text, add_bos=False, add_eos=True))

    xs: list[list[int]] = []
    ys: list[list[int]] = []
    for start in range(0, max(0, len(stream) - 1), context):
        chunk = stream[start : start + context + 1]
        if len(chunk) < 3:
            continue
        x = chunk[:-1]
        y = chunk[1:]
        if len(x) < context:
            pad = tokenizer.vocab["<pad>"]
            x = x + [pad] * (context - len(x))
            y = y + [pad] * (context - len(y))
        xs.append(x[:context])
        ys.append(y[:context])

    if not xs:
        raise ValueError("No usable English sequences were produced")
    return np.asarray(xs, dtype=np.int32), np.asarray(ys, dtype=np.int32)


def make_finetune_arrays(
    texts: list[str],
    tokenizer: OriTokenizer,
    context: int,
) -> tuple[np.ndarray, np.ndarray]:
    """Create response-focused causal-LM examples for Ori fine-tuning.

    The user prompt supplies context, but only Ori's response tokens (plus
    EOS) contribute to the fine-tuning loss. This keeps the pretrained English
    model from spending its limited fine-tuning capacity memorizing prompts.
    """
    xs: list[list[int]] = []
    ys: list[list[int]] = []
    pad = tokenizer.vocab["<pad>"]

    for text in texts:
        marker = " Ori:"
        split_at = text.find(marker)
        if split_at < 0:
            continue
        prefix = text[: split_at + len(marker)]
        response = text[split_at + len(marker) :].strip()
        if not response:
            continue

        prefix_ids = tokenizer.encode(prefix, add_bos=True, add_eos=False)
        response_ids = tokenizer.encode(response, add_bos=False, add_eos=True)
        ids = (prefix_ids + response_ids)[: context + 1]
        if len(ids) < 3:
            continue

        x = ids[:-1]
        y = ids[1:]
        response_start = len(prefix_ids)
        for index in range(len(y)):
            # y[index] corresponds to ids[index + 1].
            if index + 1 < response_start:
                y[index] = pad

        x += [pad] * (context - len(x))
        y += [pad] * (context - len(y))
        xs.append(x[:context])
        ys.append(y[:context])

    if not xs:
        raise ValueError("No usable Ori fine-tuning sequences were produced")
    return np.asarray(xs, dtype=np.int32), np.asarray(ys, dtype=np.int32)
def compile_for_learning(
    model: OriLanguageModel,
    pad_id: int,
    learning_rate: float,
) -> None:
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(
            learning_rate=learning_rate,
            weight_decay=1e-4,
            clipnorm=1.0,
        ),
        loss=MaskedCausalLoss(pad_id),
    )


def fit_stage(
    model: OriLanguageModel,
    x: np.ndarray,
    y: np.ndarray,
    *,
    epochs: int,
    batch_size: int,
    validation_split: float,
    checkpoint_dir: Path,
    prefix: str,
) -> dict[str, object]:
    callbacks: list[tf.keras.callbacks.Callback] = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(checkpoint_dir / f"{prefix}-epoch-{{epoch:02d}}.weights.h5"),
            save_weights_only=True,
            save_best_only=False,
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="loss",
            factor=0.5,
            patience=3,
            min_lr=1e-5,
            verbose=1,
        ),
    ]

    fit_kwargs: dict[str, object] = {
        "batch_size": batch_size,
        "epochs": epochs,
        "shuffle": True,
        "callbacks": callbacks,
    }

    has_validation = len(x) >= 10 and validation_split > 0
    if has_validation:
        fit_kwargs["validation_split"] = validation_split
        callbacks.append(
            tf.keras.callbacks.EarlyStopping(
                monitor="val_loss",
                patience=5,
                restore_best_weights=True,
            )
        )

    history = model.fit(x, y, **fit_kwargs)
    return {
        "epochs_completed": len(history.history["loss"]),
        "final_loss": float(history.history["loss"][-1]),
        "final_val_loss": (
            float(history.history["val_loss"][-1])
            if "val_loss" in history.history
            else None
        ),
        "validation_enabled": has_validation,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/ori_training_expanded.jsonl")
    parser.add_argument("--output", default="artifacts/ori-small")
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--english-epochs", type=int, default=8)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--validation-split", type=float, default=0.0)
    parser.add_argument("--vocab-size", type=int, default=1024)
    parser.add_argument("--english-max-chars", type=int, default=500_000)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    if args.epochs < 1 or args.english_epochs < 1:
        raise ValueError("Both --epochs and --english-epochs must be at least 1")
    if not 0 <= args.validation_split < 1:
        raise ValueError("--validation-split must be between 0 and 1")

    tf.keras.utils.set_random_seed(args.seed)

    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    checkpoint_dir = output / "checkpoint"
    checkpoint_dir.mkdir(parents=True, exist_ok=True)

    ori_texts = load_records(Path(args.data))
    english_texts = download_public_domain_english(
        max_chars=args.english_max_chars
    )

    # The tokenizer sees both distributions, so English pretraining and Ori
    # fine-tuning use exactly the same token IDs.
    tokenizer = train_tokenizer(
        english_texts + ori_texts,
        output,
        vocab_size=args.vocab_size,
    )
    tokenizer_path = output / "ori_tokenizer.model"
    if not tokenizer_path.exists():
        raise RuntimeError("Final tokenizer artifact is missing.")

    config = OriLMConfig(
        vocab_size=tokenizer.vocab_size,
        context_length=256,
        d_model=192,
        num_heads=4,
        num_layers=4,
        d_ff=768,
        dropout=0.1,
    )
    model = OriLanguageModel(config, name="ori_language_model")
    model(tf.zeros((1, config.context_length), dtype=tf.int32))

    english_x, english_y = make_document_arrays(
        english_texts,
        tokenizer,
        config.context_length,
    )
    ori_x, ori_y = make_finetune_arrays(
        ori_texts,
        tokenizer,
        config.context_length,
    )

    # Stage 1: teach the network general English syntax, spelling, punctuation,
    # and local language patterns before adding Ori-specific behavior.
    print(
        f"Stage 1/2: pretraining on {len(english_x)} English windows "
        f"for {args.english_epochs} epochs."
    )
    compile_for_learning(model, config.pad_id, learning_rate=3e-4)
    pretraining = fit_stage(
        model,
        english_x,
        english_y,
        epochs=args.english_epochs,
        batch_size=args.batch_size,
        validation_split=0.0,
        checkpoint_dir=checkpoint_dir,
        prefix="english",
    )

    model.save_weights(output / "english-pretrained.weights.h5")

    # Keep a small English replay set during fine-tuning so Ori-specific data
    # does not immediately erase the language foundation.
    replay_count = min(max(64, len(ori_x) * 3), len(english_x))
    replay_x = english_x[:replay_count]
    replay_y = english_y[:replay_count]
    finetune_x = np.concatenate([ori_x, replay_x], axis=0)
    finetune_y = np.concatenate([ori_y, replay_y], axis=0)

    print(
        f"Stage 2/2: fine-tuning on {len(ori_x)} Ori examples "
        f"+ {replay_count} English replay windows for {args.epochs} epochs."
    )
    compile_for_learning(model, config.pad_id, learning_rate=5e-5)
    finetuning = fit_stage(
        model,
        finetune_x,
        finetune_y,
        epochs=args.epochs,
        batch_size=args.batch_size,
        validation_split=args.validation_split,
        checkpoint_dir=checkpoint_dir,
        prefix="ori",
    )

    model.save_weights(output / "model.weights.h5")
    (output / "config.json").write_text(
        json.dumps(config.__dict__, indent=2),
        encoding="utf-8",
    )
    (output / "training_summary.json").write_text(
        json.dumps(
            {
                "model": "ori-small",
                "training_strategy": "english-pretraining-then-ori-finetuning",
                "english_sources": "Project Gutenberg public-domain texts",
                "english_windows": len(english_x),
                "ori_examples": len(ori_texts),
                "vocabulary_size": tokenizer.vocab_size,
                "english_epochs_requested": args.english_epochs,
                "ori_epochs_requested": args.epochs,
                "pretraining": pretraining,
                "finetuning": finetuning,
                "replay_windows": replay_count,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    # Remove the temporary SentencePiece training input from the deployable
    # artifact directory; only the tokenizer model is needed at runtime.
    try:
        (output / "tokenizer-training.txt").unlink()
        (output / "ori_tokenizer.vocab").unlink()
    except FileNotFoundError:
        pass

    # Emit a tiny build-time smoke sample. This is diagnostic only; inference
    # still happens through the runtime after the service starts.
    sample, _ = model.generate(
        tokenizer,
        "User: Hello Ori! Good afternoon. Ori:",
        max_new_tokens=24,
        temperature=0.20,
        top_k=8,
    )
    print(f"Final English/Ori smoke sample: {sample!r}")
    print(f"Ori model saved to {output}")


if __name__ == "__main__":
    main()
