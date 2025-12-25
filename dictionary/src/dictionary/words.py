import sqlite3
import re

from dictionary.config import db_path, slim_words_cache_path, enriched_words_cache_path
from dictionary.data_types import PartOfSpeechEnglish, Phrase, Word
from dictionary.lemmas import create_lemmas
from dictionary.orm import word_from_record
from dictionary.phrases import extract_phrases
from dictionary.word_ranking import create_word_ranking
from dictionary.accentless import drop_greek_accents, forms_to_exclude
from dictionary.utils import cache_to_file
from pydantic import TypeAdapter


@cache_to_file(enriched_words_cache_path, TypeAdapter(list[Word]))
def create_words_stage_2() -> list[Word]:
    """Enriches words with lemma index"""
    words: list[Word] = create_words_stage_1()
    lemmas = create_lemmas()
    lemma_index_map: dict[tuple[PartOfSpeechEnglish, str], int] = {}
    for idx, lemma in enumerate(lemmas):
        lemma_index_map[(lemma.pos_en, lemma.lemma)] = idx
    enriched_words: list[Word] = []
    for word in words:
        lemma_index = lemma_index_map.get((word.pos_en, word.lemma), -1)
        enriched_word = word.model_copy(update={"lemma_index": lemma_index})
        enriched_words.append(enriched_word)
    return enriched_words


@cache_to_file(slim_words_cache_path, TypeAdapter(list[Word]))
def create_words_stage_1() -> list[Word]:
    """Creates the list of words occuring in phrases.

    - Take all word forms used as keys in io/phrases.json
    - Take all word forms occuring in io/phrases.json values.
       Remove markup when parsing. Bring to lower case.
    - Query dict.db for respective word forms.
    - Construct Word objects from the query results.
    - Create a set of lemmas.
    - Query dict.db for all word forms for these lemmas.
    - Construct Word objects.
    - Add these Word objects to the set.
    - Enrich Word objects with word ranks (io/word_ranking.json) and phrases.
    - Sort words by key: (whether occuring in keys of phrases.json, rank)
    - Cache output to io/words.json.
    """
    form_phrase: dict[str, Phrase] = extract_phrases()
    key_forms = set(form_phrase.keys())  # Forms used as keys
    sort_key = lambda w: _sort_key(key_forms, w)
    value_forms = _extract_value_forms(form_phrase)
    all_forms = key_forms | value_forms
    words: set[Word] = _query_words_from_db(all_forms)
    lemmas = {word.lemma for word in words}
    words |= _query_words_by_lemmas(lemmas)
    words = {w for w in words if _word_filter(w)}
    accentless_form_rank = create_word_ranking()
    enriched_words: set[Word] = set()
    for word in words:
        accentless_form = drop_greek_accents(word.form)
        frequency_rank: int = accentless_form_rank.get(accentless_form, None)
        enriched_word = word.model_copy(update={"frequency_rank": frequency_rank})
        enriched_words.add(enriched_word)
    enriched_words_list = list(enriched_words)
    enriched_words_list.sort(key=sort_key)
    return enriched_words_list


_greek_word_pattern = re.compile(
    r"[\u1F00-\u1FFF\u0370-\u03FF\u1F00-\u1FFFΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψωςάέήίόύώΐΰϋϊἱΆΈΉΊΌΎΏΫΪ]+"
)


def _extract_value_forms(phrases_map: dict) -> set[str]:
    """Extract word forms from the Greek text of phrase values."""
    value_forms = set()
    for phrase in phrases_map.values():
        # Remove markup (like ** markers)
        greek_text = re.sub(r"\*\*([^*]+)\*\*", r"\1", phrase.greek)
        # Extract Greek words
        words = _greek_word_pattern.findall(greek_text)
        for word in words:
            # Convert to lowercase and strip punctuation
            word_lower = word.lower().strip(".,;:!?()[]{}")
            if word_lower and len(word_lower) > 0:
                value_forms.add(word_lower)
    return value_forms


def _batch_items(items: set[str], batch_size: int = 100) -> list[list[str]]:
    """Split a set of items into batches of specified size."""
    items_list = list(items)
    return [
        items_list[i : i + batch_size] for i in range(0, len(items_list), batch_size)
    ]


def _query_words_from_db(all_forms: set[str]) -> set[Word]:
    """Query dict.db for given word forms and return dict of (form, lemma) -> Word."""
    if not db_path.exists():
        raise FileNotFoundError(f"Database not found at {db_path}")
    db_uri = f"file:{db_path}?mode=ro"
    words: set[Word] = set()
    with sqlite3.connect(db_uri, uri=True) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        batches = _batch_items(all_forms, batch_size=100)
        for batch in batches:
            placeholders = ",".join("?" * len(batch))
            query = f"SELECT * FROM words WHERE form IN ({placeholders})"
            cursor.execute(query, batch)
            for row in cursor.fetchall():
                record = dict(row)
                if not record.get("pos"):
                    continue
                word = word_from_record(record)
                words.add(word)
    return words


def _query_words_by_lemmas(lemmas: set[str]) -> set[Word]:
    """Query dict.db for all word forms that have the given lemmas."""
    if not db_path.exists():
        raise FileNotFoundError(f"Database not found at {db_path}")
    db_uri = f"file:{db_path}?mode=ro"
    words: set[Word] = set()
    with sqlite3.connect(db_uri, uri=True) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        if not lemmas:
            return words
        batches = _batch_items(lemmas, batch_size=100)
        for batch in batches:
            placeholders = ",".join("?" * len(batch))
            cursor.execute(
                f"SELECT * FROM words WHERE lemma IN ({placeholders})", batch
            )
            for row in cursor.fetchall():
                record = dict(row)
                if not record.get("pos"):
                    continue
                word = word_from_record(record)
                words.add(word)
    return words


def _sort_key(key_forms, w: Word) -> tuple[bool, int]:
    in_keys = w.form in key_forms
    return (
        not in_keys,
        -(w.frequency_rank or 0),
    )


def _word_filter(w: Word) -> bool:
    return (
        len(w.lemma.split()) == 1
        and len(w.form.split()) == 1
        and drop_greek_accents(w.form) not in forms_to_exclude
        and drop_greek_accents(w.lemma) not in forms_to_exclude
    )
