from collections import defaultdict

from dictionary.config import dictionary_cache_path
from dictionary.data_types import Dictionary, PartOfSpeechEnglish, Word
from dictionary.lemmas import create_lemmas
from dictionary.utils import cache_to_file
from dictionary.words import create_words_stage_2
from dictionary.word_cards import create_word_cards


@cache_to_file(dictionary_cache_path, Dictionary)
def create_dictionary() -> Dictionary:
    """Creates the Dictionary object

    - Enrich Word with lemma index.
    - Cache output to io/dictionary.json.
    """
    lemmas = create_lemmas()
    words = create_words_stage_2()
    word_cards = create_word_cards()
    pos_lemma_index: dict[PartOfSpeechEnglish, list[int]] = defaultdict(list)
    for idx, lemma in enumerate(lemmas):
        pos_lemma_index[lemma.pos_en].append(idx)
    return Dictionary(
        lemmas=lemmas,
        words=words,
        pos_lemma_index=dict(pos_lemma_index),
        word_cards=word_cards,
    )


if __name__ == "__main__":
    create_dictionary()
