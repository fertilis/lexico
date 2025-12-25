from collections import defaultdict

from dictionary.config import word_cards_cache_path
from dictionary.data_types import Phrase, WordCard
from dictionary.phrases import extract_phrases
from dictionary.utils import cache_to_file
from dictionary.words import create_words_stage_2
from pydantic import TypeAdapter


@cache_to_file(word_cards_cache_path, TypeAdapter(list[WordCard]))
def create_word_cards() -> list[WordCard]:
    """Create one WordCard per form in form->phrase mapping"""
    form_phrase: dict[str, Phrase] = extract_phrases()
    words = create_words_stage_2()
    form_to_indices: dict[str, list[int]] = defaultdict(list)
    for idx, word in enumerate(words):
        form_to_indices[word.form].append(idx)

    word_cards: list[WordCard] = []
    for form, phrase in form_phrase.items():
        word_indices = form_to_indices.get(form, None)
        if word_indices is None:
            continue
        lemma_indices = set()
        for word_idx in word_indices:
            lemma_idx = words[word_idx].lemma_index
            if lemma_idx != -1:
                lemma_indices.add(lemma_idx)
        lemma_indices_list = sorted(lemma_indices)

        word_card = WordCard(
            form=form,
            phrases=[phrase],
            word_indices=word_indices,
            lemma_indices=lemma_indices_list,
        )
        word_cards.append(word_card)

    return word_cards
