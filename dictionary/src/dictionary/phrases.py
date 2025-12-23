import json
import re

from dictionary.config import phrases_cache_path, phrases_selected_path
from dictionary.data_types import Phrase
from dictionary.utils import cache_to_file
from pydantic import TypeAdapter

AccentedForm = str


@cache_to_file(phrases_cache_path, TypeAdapter(dict[AccentedForm, Phrase]))
def extract_phrases() -> dict[AccentedForm, Phrase]:
    """Creates form->Phrase mapping

    Extracts data from io/phrases/phrases-selected.json
    Caches to io/phrases.json
    """
    if not phrases_selected_path.exists():
        raise FileNotFoundError(f"Phrases file not found at {phrases_selected_path}")
    with open(phrases_selected_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    phrases_map: dict[AccentedForm, Phrase] = {}
    for partition in data.get("partitions", []):
        for phrase_entry in partition.get("phrases", []):
            word = phrase_entry.get("word")
            if not word:
                continue
            if word in phrases_map:
                continue
            greek_phrase = phrase_entry.get("greek_phrase", "").strip()
            english_phrase = phrase_entry.get("english_phrase", "").strip()
            # Remove ** markers used for highlighting
            greek_phrase = re.sub(r"\*\*([^*]+)\*\*", r"\1", greek_phrase)
            english_phrase = re.sub(r"\*\*([^*]+)\*\*", r"\1", english_phrase)
            phrases_map[word] = Phrase(greek=greek_phrase, english=english_phrase)
    return phrases_map
