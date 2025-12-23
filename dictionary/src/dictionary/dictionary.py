from collections import defaultdict

from dictionary.config import dictionary_cache_path
from dictionary.data_types import Dictionary, PartOfSpeechEnglish, Word
from dictionary.lemmas import create_lemmas
from dictionary.utils import cache_to_file
from dictionary.words import create_words


@cache_to_file(dictionary_cache_path, Dictionary)
def create_dictionary() -> Dictionary:
    """Creates the Dictionary object

    - Enrich Word with lemma index.
    - Cache output to io/dictionary.json.
    """
    lemmas = create_lemmas()
    words = create_words()

    # Create mapping from (pos_en, lemma) to lemma index
    lemma_index_map: dict[tuple[PartOfSpeechEnglish, str], int] = {}
    for idx, lemma in enumerate(lemmas):
        lemma_index_map[(lemma.pos_en, lemma.lemma)] = idx

    # Enrich words with lemma_index
    enriched_words: list[Word] = []
    for word in words:
        lemma_index = lemma_index_map.get((word.pos_en, word.lemma), -1)
        enriched_word = word.model_copy(update={"lemma_index": lemma_index})
        enriched_words.append(enriched_word)

    # Create pos_lemma_index: map PartOfSpeechEnglish to list of lemma indices
    pos_lemma_index: dict[PartOfSpeechEnglish, list[int]] = defaultdict(list)
    for idx, lemma in enumerate(lemmas):
        pos_lemma_index[lemma.pos_en].append(idx)

    return Dictionary(
        lemmas=lemmas,
        words=enriched_words,
        pos_lemma_index=dict(pos_lemma_index),
    )


if __name__ == "__main__":
    create_dictionary()
