from collections import defaultdict
from pydantic import TypeAdapter

from dictionary.config import lemmas_cache_path
from dictionary.data_types import Lemma, Word
from dictionary.lemma_ranking import create_lemma_ranking
from dictionary.translations import create_translations
from dictionary.utils import cache_to_file


@cache_to_file(lemmas_cache_path, TypeAdapter(list[Lemma]))
def create_lemmas() -> list[Lemma]:
    """Creates the list of lemmas.

    - Take all words
    - Group words by (pos_en, lemma)
    - For each group construct Lemma object
    - Enrich Lemma object with translation
    - Add frequency rank to the Lemma object from create_lemma_ranking().
    - Sort lemmas by frequency rank desc (most frequent first)
    - Cache output to io/lemmas.json.
    """
    from dictionary.words import create_words_stage_1

    words: list[Word] = create_words_stage_1()
    translations = create_translations()
    lemma_ranking = create_lemma_ranking()
    lemma_groups: dict[tuple, list[int]] = defaultdict(list)
    for idx, word in enumerate(words):
        if word.pos_en is None:
            continue
        key = (word.pos_en, word.lemma)
        lemma_groups[key].append(idx)

    lemmas: list[Lemma] = []
    for (pos_en, lemma), word_indices in lemma_groups.items():
        frequency_rank = lemma_ranking.get(lemma, 0)
        translation = translations.get(lemma)
        lemma_obj = Lemma(
            lemma=lemma,
            pos_en=pos_en,
            frequency_rank=frequency_rank,
            translation=translation,
            word_indices=word_indices,
        )
        lemmas.append(lemma_obj)
    lemmas.sort(key=lambda x: -x.frequency_rank)
    return lemmas
