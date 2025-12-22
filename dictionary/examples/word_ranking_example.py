"""Example demonstrating top N words by frequency.

Shows the most frequent accentless words based on word form frequency ranks.
A word's rank is the maximum rank of its word forms.
"""

import argparse

from dictionary.word_ranking import create_word_ranking


def main(n: int | None = None):
    word_rank: dict[str, int] = create_word_ranking()
    word_rank = [
        (word, rank)
        for word, rank in sorted(
            word_rank.items(), key=lambda item: item[1], reverse=True
        )
    ]
    print(f"{'Rank':<8} {'Word':<30}")
    print("-" * 40)
    for i, (word, rank) in enumerate(word_rank):
        print(f"{i+1}: {rank:<8} {word:<30}")
        if n is not None and i + 1 >= n:
            break


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-n",
        "--number",
        type=int,
        default=None,
        help="Number of top words to display",
    )
    args = parser.parse_args()
    main(args.number)

