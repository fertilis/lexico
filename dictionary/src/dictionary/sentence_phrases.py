"""Build standalone phrases artifacts for GitHub Pages (see repo spec.md)."""

from __future__ import annotations

import gzip
import hashlib
import json
import re
from pathlib import Path

from dictionary.config import output_directory, sentence_pairs_source_path
from dictionary.data_types import Phrase


def parse_bilingual_sentence_file(text: str) -> list[Phrase]:
    """Split on blank lines; each block: first non-empty line = Greek, second = English."""
    text = text.strip()
    if not text:
        return []
    blocks = re.split(r"\n\s*\n", text)
    result: list[Phrase] = []
    for block in blocks:
        lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
        if len(lines) < 2:
            continue
        result.append(Phrase(greek=lines[0], english=lines[1]))
    return result


def build_sentence_phrase_artifacts(
    source_path: Path | None = None,
    out_dir: Path | None = None,
) -> tuple[str, Path, Path]:
    """
    Read source bytes, compute md5[:6], write phrases-{hash}.json.gz and phrases-current.txt.
    Returns (hash6, gzip_path, manifest_path).
    """
    src = source_path or sentence_pairs_source_path
    out = out_dir or output_directory
    out.mkdir(parents=True, exist_ok=True)

    raw = src.read_bytes() if src.exists() else b""
    hash6 = hashlib.md5(raw).hexdigest()[:6]
    text = raw.decode("utf-8") if raw else ""
    phrases = parse_bilingual_sentence_file(text)

    payload = {"phrases": [p.model_dump(mode="json") for p in phrases]}
    json_bytes = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    basename = f"phrases-{hash6}.json.gz"
    gz_path = out / basename
    manifest_path = out / "phrases-current.txt"

    with gzip.GzipFile(filename=str(gz_path), mode="wb", mtime=0) as f:
        f.write(json_bytes)

    manifest_path.write_text(basename + "\n", encoding="utf-8")
    return hash6, gz_path, manifest_path


if __name__ == "__main__":
    h, gz, manifest = build_sentence_phrase_artifacts()
    print(f"hash={h}\n{gz}\n{manifest}")
