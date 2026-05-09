"""Build standalone phrases artifacts for GitHub Pages (see repo spec.md)."""

from __future__ import annotations

import gzip
import hashlib
import json
from pathlib import Path

from dictionary.config import output_directory, sentence_pairs_source_path
from dictionary.data_types import Phrase


def _count_greek_letters(s: str) -> int:
    """Count letters in Greek and Coptic + Greek Extended Unicode blocks."""
    n = 0
    for c in s:
        o = ord(c)
        if 0x0370 <= o <= 0x03FF or 0x1F00 <= o <= 0x1FFF:
            n += 1
    return n


def _count_latin_letters(s: str) -> int:
    return sum(1 for c in s if "A" <= c <= "Z" or "a" <= c <= "z")


def _assign_greek_english_pair(line_a: str, line_b: str) -> tuple[str, str]:
    """Pick Greek vs English by which line has more Greek letters; tie-break with Latin counts."""
    ga, gb = _count_greek_letters(line_a), _count_greek_letters(line_b)
    if ga > gb:
        return line_a, line_b
    if gb > ga:
        return line_b, line_a
    la, lb = _count_latin_letters(line_a), _count_latin_letters(line_b)
    if la > lb:
        return line_b, line_a
    if lb > la:
        return line_a, line_b
    return line_a, line_b


def parse_bilingual_sentence_file(text: str) -> list[Phrase]:
    """Blocks are runs of non-empty lines (after trim); runs are separated by blank lines."""
    lines = [ln.strip() for ln in text.splitlines()]
    blocks: list[list[str]] = []
    cur: list[str] = []
    for line in lines:
        if line:
            cur.append(line)
        elif cur:
            blocks.append(cur)
            cur = []
    if cur:
        blocks.append(cur)

    result: list[Phrase] = []
    for block_lines in blocks:
        if len(block_lines) < 2:
            continue
        greek, english = _assign_greek_english_pair(block_lines[0], block_lines[1])
        result.append(Phrase(greek=greek, english=english))
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
