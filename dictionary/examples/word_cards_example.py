"""Example demonstrating word cards.

Shows word cards with their associated phrases and word indices.
"""

import json
import random

from dictionary.word_cards import create_word_cards


def main(n: int = 10):
    """Display random word cards."""
    print("Loading word cards...")
    word_cards = create_word_cards()
    if not word_cards:
        print("No word cards found in the database.")
        return
    if n > len(word_cards):
        n = len(word_cards)

    selected_cards = random.sample(word_cards, n)
    print(f"Random {n} word cards:\n")
    print(
        json.dumps(
            [card.model_dump(mode="json") for card in selected_cards],
            indent=2,
            ensure_ascii=False,
        )
    )
    print("=" * 80)
    print(f"Total number of word cards: {len(word_cards)}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-n",
        "--number",
        type=int,
        default=10,
        help="Number of random word cards to display",
    )
    args = parser.parse_args()
    main(args.number)
