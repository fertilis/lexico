from collections import defaultdict

from dictionary.accentless import drop_greek_accents
from dictionary.config import greek_50k_path, word_ranking_cache_path
from dictionary.utils import cache_to_file
from pydantic import TypeAdapter


@cache_to_file(word_ranking_cache_path, TypeAdapter(dict[str, int]))
def create_word_ranking() -> dict[str, int]:
    """Accentless words sorted by frequency rank from the database (most frequent first).

    Word's rank is the maximum rank of its word forms.
    If multiple word forms map to the same accentless word, the accentless word
    receives the maximum rank.
    Cached to io/word_ranking.json
    """
    if not greek_50k_path.exists():
        raise FileNotFoundError(f"Frequency file not found at {greek_50k_path}")
    word_ranks: dict[str, int] = defaultdict(int)
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
            word_ranks[accentless_form] = max(word_ranks[accentless_form], frequency_rank)
    return word_ranks

