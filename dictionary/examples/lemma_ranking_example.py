"""Example demonstrating top N lemmas by frequency.

Shows the most frequent lemmas based on word form frequency ranks.
A lemma's rank is the maximum rank of its word forms.
"""

import argparse

from dictionary.lemma_ranking import create_lemma_ranking


def main(n: int | None = None):
    lemma_rank: dict[str, int] = create_lemma_ranking()
    lemma_rank = [
        (lemma, rank)
        for lemma, rank in sorted(
            lemma_rank.items(), key=lambda item: item[1], reverse=True
        )
    ]
    print(f"{'Rank':<8} {'Lemma':<30}")
    print("-" * 40)
    for i, (lemma, rank) in enumerate(lemma_rank):
        print(f"{i+1}: {rank:<8} {lemma:<30}")
        if n is not None and i + 1 >= n:
            break


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-n",
        "--number",
        type=int,
        default=None,
        help="Number of top lemmas to display",
    )
    args = parser.parse_args()
    main(args.number)
