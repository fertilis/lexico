from collections import defaultdict

from dictionary.accentless import (
    create_accentless_form_to_lemmas_mapping,
    drop_greek_accents,
)
from dictionary.config import greek_50k_path, lemma_ranking_cache_path
from dictionary.utils import cache_to_file
from pydantic import TypeAdapter


@cache_to_file(lemma_ranking_cache_path, TypeAdapter(dict[str, int]))
def create_lemma_ranking() -> dict[str, int]:
    """Lemmas sorted by frequency rank from the database (most frequent first).

    Lemma's rank is the maximum rank of its word forms.
    If word form maps to multiple lemmas, all lemmas receive its rank.
    Cached to io/lemma_ranking.json
    """
    if not greek_50k_path.exists():
        raise FileNotFoundError(f"Frequency file not found at {greek_50k_path}")
    accentless_form_lemmas = create_accentless_form_to_lemmas_mapping()
    lemma_ranks: dict[str, int] = defaultdict(int)
    with greek_50k_path.open("r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) < 2:
                continue
            word_form = parts[0]
            try:
                frequency_rank = int(parts[1])
            except ValueError:
                continue
            accentless_form = drop_greek_accents(word_form)
            lemmas = accentless_form_lemmas.get(accentless_form, [])
            for lemma in lemmas:
                lemma_ranks[lemma] = max(lemma_ranks[lemma], frequency_rank)
    return lemma_ranks
