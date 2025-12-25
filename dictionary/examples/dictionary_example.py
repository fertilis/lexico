import json
from collections import defaultdict

from dictionary.data_types import PartOfSpeechEnglish
from dictionary.dictionary import create_dictionary


def main():
    """Sample top and bottom lemmas and words, print as JSON.
    Print top/bottom lemmas (as string) by part of speech.
    """
    print("Loading dictionary...")
    dictionary = create_dictionary()

    lemmas = dictionary.lemmas
    words = dictionary.words

    print("=" * 60)
    print(f"Total lemmas: {len(lemmas)}")
    print(f"Total words: {len(words)}")
    print("=" * 60)

    # Sample top and bottom lemmas
    n_samples = 5
    top_lemmas = lemmas[:n_samples] if len(lemmas) >= n_samples else lemmas
    bottom_lemmas = lemmas[-n_samples:] if len(lemmas) >= n_samples else lemmas

    print("\n" + "=" * 60)
    print(f"Top {len(top_lemmas)} lemmas (by frequency rank):")
    print("=" * 60)
    print(
        json.dumps(
            [lemma.model_dump(mode="json") for lemma in top_lemmas],
            indent=2,
            ensure_ascii=False,
        )
    )

    print("\n" + "=" * 60)
    print(f"Bottom {len(bottom_lemmas)} lemmas (by frequency rank):")
    print("=" * 60)
    print(
        json.dumps(
            [lemma.model_dump(mode="json") for lemma in bottom_lemmas],
            indent=2,
            ensure_ascii=False,
        )
    )

    # Sample top and bottom words
    top_words = words[:n_samples] if len(words) >= n_samples else words
    bottom_words = words[-n_samples:] if len(words) >= n_samples else words

    print("\n" + "=" * 60)
    print(f"Top {len(top_words)} words:")
    print("=" * 60)
    print(
        json.dumps(
            [word.model_dump(mode="json") for word in top_words],
            indent=2,
            ensure_ascii=False,
        )
    )

    print("\n" + "=" * 60)
    print(f"Bottom {len(bottom_words)} words:")
    print("=" * 60)
    print(
        json.dumps(
            [word.model_dump(mode="json") for word in bottom_words],
            indent=2,
            ensure_ascii=False,
        )
    )

    # Print top/bottom lemmas by part of speech
    print("\n" + "=" * 60)
    print("Top and bottom lemmas by part of speech:")
    print("=" * 60)

    # Group lemmas by part of speech
    lemmas_by_pos: dict[PartOfSpeechEnglish, list] = defaultdict(list)
    for lemma in lemmas:
        lemmas_by_pos[lemma.pos_en].append(lemma)

    # Sort lemmas within each POS by frequency rank
    for pos in lemmas_by_pos:
        lemmas_by_pos[pos].sort(key=lambda x: -(x.frequency_rank or 0))

    for pos in sorted(lemmas_by_pos.keys(), key=lambda x: x.value):
        pos_lemmas = lemmas_by_pos[pos]
        if not pos_lemmas:
            continue

        print(f"\n{pos.value}:")
        print(f"  Total: {len(pos_lemmas)}")

        # Top lemmas for this POS
        top_n = min(3, len(pos_lemmas))
        if top_n > 0:
            print(f"  Top {top_n} lemmas:")
            for lemma in pos_lemmas[:top_n]:
                rank_str = (
                    f" (rank: {lemma.frequency_rank})"
                    if lemma.frequency_rank is not None
                    else ""
                )
                translation_str = (
                    f" - {lemma.translation.en[0]}"
                    if lemma.translation and lemma.translation.en
                    else ""
                )
                print(f"    - {lemma.lemma}{rank_str}{translation_str}")

        # Bottom lemmas for this POS
        bottom_n = min(3, len(pos_lemmas))
        if bottom_n > 0 and len(pos_lemmas) > bottom_n:
            print(f"  Bottom {bottom_n} lemmas:")
            for lemma in pos_lemmas[-bottom_n:]:
                rank_str = (
                    f" (rank: {lemma.frequency_rank})"
                    if lemma.frequency_rank is not None
                    else ""
                )
                translation_str = (
                    f" - {lemma.translation.en[0]}"
                    if lemma.translation and lemma.translation.en
                    else ""
                )
                print(f"    - {lemma.lemma}{rank_str}{translation_str}")

    # Sample word cards
    word_cards = dictionary.word_cards
    top_word_cards = word_cards[:n_samples] if len(word_cards) >= n_samples else word_cards
    bottom_word_cards = word_cards[-n_samples:] if len(word_cards) >= n_samples else word_cards

    print("\n" + "=" * 60)
    print(f"Top {len(top_word_cards)} word cards:")
    print("=" * 60)
    print(
        json.dumps(
            [card.model_dump(mode="json") for card in top_word_cards],
            indent=2,
            ensure_ascii=False,
        )
    )

    print("\n" + "=" * 60)
    print(f"Bottom {len(bottom_word_cards)} word cards:")
    print("=" * 60)
    print(
        json.dumps(
            [card.model_dump(mode="json") for card in bottom_word_cards],
            indent=2,
            ensure_ascii=False,
        )
    )

    # Print statistics summary
    print("\n" + "=" * 60)
    print("Statistics:")
    print("=" * 60)

    # Number of lemmas by POS
    print("\nNumber of lemmas by part of speech:")
    for pos in sorted(lemmas_by_pos.keys(), key=lambda x: x.value):
        count = len(lemmas_by_pos[pos])
        print(f"  {pos.value}: {count}")

    # Total lemmas, words, and word cards
    print(f"\nTotal lemmas: {len(lemmas)}")
    print(f"Total words: {len(words)}")
    print(f"Total word cards: {len(word_cards)}")


if __name__ == "__main__":
    main()
