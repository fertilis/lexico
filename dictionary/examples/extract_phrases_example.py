"""Example demonstrating phrase extraction.

Shows random form -> phrase mappings from the phrases database.
"""

import random

from dictionary.phrases import extract_phrases


def main(n: int = 10):
    """Display random form -> phrase mappings."""
    phrases_map = extract_phrases()

    if not phrases_map:
        print("No phrases found in the database.")
        return

    # Get random sample
    forms = list(phrases_map.keys())
    if n > len(forms):
        n = len(forms)

    selected_forms = random.sample(forms, n)

    print(f"Total number of word forms with phrases: {len(forms)}")
    print(f"Random {n} form -> phrase mappings:\n")
    print(f"{'Form':<25} {'Greek Phrase':<50} {'English Phrase':<50}")
    print("-" * 125)

    for form in selected_forms:
        phrase = phrases_map[form]
        # Truncate long phrases for display
        greek = phrase.greek[:48] + "..." if len(phrase.greek) > 50 else phrase.greek
        english = (
            phrase.english[:48] + "..." if len(phrase.english) > 50 else phrase.english
        )
        print(f"{form:<25} {greek:<50} {english:<50}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-n",
        "--number",
        type=int,
        default=10,
        help="Number of random phrases to display",
    )
    args = parser.parse_args()
    main(args.number)
