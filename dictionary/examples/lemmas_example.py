import argparse
import json
import random

from dictionary.lemmas import create_lemmas


def main(n):
    """Select random n lemmas and display as JSON."""
    print(f"Loading lemmas from words...")
    lemmas = create_lemmas()
    if not lemmas:
        print("No lemmas found!")
        return

    n = min(n, len(lemmas))
    selected_lemmas = random.sample(lemmas, n)
    print("=" * 60)
    print(f"Selected {n} random lemmas (out of {len(lemmas)} total):")
    print("=" * 60)
    print("\nLemmas as JSON:")
    print(
        json.dumps(
            [lemma.model_dump(mode="json") for lemma in selected_lemmas],
            indent=2,
            ensure_ascii=False,
        )
    )
    print("\n" + "=" * 60)
    print(f"Total lemmas available: {len(lemmas)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-n",
        "--number",
        type=int,
        default=5,
        help="Number of random lemmas to display",
    )
    args = parser.parse_args()
    main(args.number)
