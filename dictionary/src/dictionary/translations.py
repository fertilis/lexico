import sqlite3

from collections import defaultdict

from dictionary.config import db_path, translations_cache_path
from dictionary.data_types import Translation
from dictionary.utils import cache_to_file
from pydantic import TypeAdapter

Lemma = str


@cache_to_file(translations_cache_path, TypeAdapter(dict[Lemma, Translation]))
def create_translations() -> dict[Lemma, Translation]:
    """Creates lemma->Translation mapping from dict.db.

    Queries the translations table for Greek lemmas (src='el')
    and collects English (dest='en') and Russian (dest='ru') translations.
    Caches to io/translations.json
    """
    if not db_path.exists():
        raise FileNotFoundError(f"Database not found at {db_path}")

    # Use SQLite in read-only mode
    # Group translations by lemma and language
    translations_by_lemma: dict[str, dict[str, list[str]]] = defaultdict(
        lambda: defaultdict(list)
    )

    # Query translations for Greek lemmas to English and Russian
    query = """
        SELECT src_lemma, dest, dest_lemma
        FROM translations
        WHERE src = 'el' AND dest IN ('en', 'ru')
        ORDER BY src_lemma, dest, dest_lemma
    """

    db_uri = f"file:{db_path}?mode=ro"
    with sqlite3.connect(db_uri, uri=True) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query)

        for row in cursor.fetchall():
            lemma = row["src_lemma"]
            dest_lang = row["dest"]
            dest_lemma = row["dest_lemma"]

            if dest_lemma:  # Skip empty translations
                translations_by_lemma[lemma][dest_lang].append(dest_lemma)

    # Convert to Translation objects
    result: dict[Lemma, Translation] = {}
    for lemma, lang_translations in translations_by_lemma.items():
        result[lemma] = Translation(
            en=lang_translations.get("en", []),
            ru=lang_translations.get("ru", []),
        )

    return result
