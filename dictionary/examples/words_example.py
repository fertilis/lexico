import argparse
import json
import random

from dictionary.words import create_words


def main(n):
    """Select random n words and display as JSON."""
    print(f"Loading words from phrases...")
    words = create_words()
    if not words:
        print("No words found!")
        return
    n = min(n, len(words))
    selected_words = random.sample(words, n)
    print("=" * 60)
    print(f"Selected {n} random words (out of {len(words)} total):")
    print("=" * 60)
    print("\nWords as JSON:")
    print(
        json.dumps(
            [word.model_dump(mode="json") for word in selected_words],
            indent=2,
            ensure_ascii=False,
        )
    )
    print("\n" + "=" * 60)
    print(f"Total words available: {len(words)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-n",
        "--number",
        type=int,
        default=5,
        help="Number of top words to display",
    )
    args = parser.parse_args()
    main(args.number)
