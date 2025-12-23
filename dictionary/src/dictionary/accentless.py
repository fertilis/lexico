import sqlite3
import unicodedata

from dictionary.config import accentless_cache_path, db_path
from dictionary.utils import cache_to_file
from pydantic import TypeAdapter


@cache_to_file(accentless_cache_path, TypeAdapter(dict[str, list[str]]))
def create_accentless_form_to_lemmas_mapping() -> dict[str, list[str]]:
    """Create a mapping from accentless words to their lemmas.

    Reads from the SQLite database and creates a dictionary mapping accentless
    word forms to their lemmas. The result is cached to io/accentless.json
    for faster subsequent loads.

    Returns:
        Dictionary mapping accentless word -> list of lemmas
    """
    accentless_map: dict[str, set[str]] = {}
    if not db_path.exists():
        raise FileNotFoundError(f"Database not found at {db_path}")
    db_uri = f"file:{db_path}?mode=ro"
    with sqlite3.connect(db_uri, uri=True) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT form, lemma FROM words")
        for form, lemma in cursor.fetchall():
            if len(form.split()) > 1:
                continue
            if len(lemma.split()) > 1:
                continue
            accentless_form = drop_greek_accents(form)
            if accentless_form in forms_to_exclude:
                continue
            if accentless_form not in accentless_map:
                accentless_map[accentless_form] = set()
            accentless_map[accentless_form].add(lemma)
    result = {k: list(sorted(v)) for k, v in accentless_map.items()}
    return result


def drop_greek_accents(word: str) -> str:
    """Remove all Greek diacritical marks (accents, breathing marks, iota subscripts).

    Args:
        word: Greek word with possible accents

    Returns:
        Word with all accents removed
    """
    result = []
    for char in word:
        if char in GREEK_ACCENT_MAP:
            result.append(GREEK_ACCENT_MAP[char])
        else:
            # Use Unicode normalization to decompose characters
            # NFD (Normalization Form Decomposed) separates base characters from diacritics
            normalized = unicodedata.normalize("NFD", char)
            # Filter out combining diacritical marks (category starts with 'M' for Mark)
            base_char = "".join(
                c for c in normalized if unicodedata.category(c) != "Mn"
            )
            result.append(base_char if base_char else char)
    return "".join(result)


# Mapping of accented Greek characters to their unaccented equivalents
GREEK_ACCENT_MAP = {
    # Lowercase with acute accent
    "ά": "α",
    "έ": "ε",
    "ή": "η",
    "ί": "ι",
    "ό": "ο",
    "ύ": "υ",
    "ώ": "ω",
    # Uppercase with acute accent
    "Ά": "Α",
    "Έ": "Ε",
    "Ή": "Η",
    "Ί": "Ι",
    "Ό": "Ο",
    "Ύ": "Υ",
    "Ώ": "Ω",
    # Lowercase with grave accent
    "ὰ": "α",
    "ὲ": "ε",
    "ὴ": "η",
    "ὶ": "ι",
    "ὸ": "ο",
    "ὺ": "υ",
    "ὼ": "ω",
    # Uppercase with grave accent
    "Ὰ": "Α",
    "Ὲ": "Ε",
    "Ὴ": "Η",
    "Ὶ": "Ι",
    "Ὸ": "Ο",
    "Ὺ": "Υ",
    "Ὼ": "Ω",
    # Lowercase with circumflex
    "ᾶ": "α",
    "ῆ": "η",
    "ῖ": "ι",
    "ῦ": "υ",
    "ῶ": "ω",
    # Uppercase with circumflex (using combining characters, handled by normalization)
    # Diaeresis
    "ϊ": "ι",
    "ϋ": "υ",
    "ΐ": "ι",
    "ΰ": "υ",
    "Ϊ": "Ι",
    "Ϋ": "Υ",
    # Iota subscript (combining)
    "ᾳ": "α",
    "ῃ": "η",
    "ῳ": "ω",
    "ᾼ": "Α",
    "ῌ": "Η",
    "ῼ": "Ω",
}

forms_to_exclude = {
    "ο",
    "του",
    "το",
    "τον",
    "η",
    "της",
    "τη",
    "την",
    "οι",
    "των",
    "τους",
    "τις",
    "τα",
    "ενας",
    "ενος",
    "ενα",
    "εναν",
    "μια",
    "μιας",
    "μιαν",
    "ενους",
    "ενη",
    "ενου",
    "ενης",
    "ενοι",
    "ενων",
    "ενες",
}
