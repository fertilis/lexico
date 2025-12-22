"""Example demonstrating create_translations() functionality.

Loads translations from create_translations(), selects random n lemmas,
and prints their translations.
"""

import argparse
import json
import random
import sys

from dictionary.translations import create_translations


def main(n):
    """Select random n lemmas and display their translations."""
    print(f"Loading translations from database...")
    translations = create_translations()

    if not translations:
        print("No translations found!")
        return

    # Select random n lemmas
    lemmas = list(translations.keys())
    n = min(n, len(lemmas))
    selected_lemmas = random.sample(lemmas, n)

    print("=" * 60)
    print(f"Selected {n} random lemmas (out of {len(lemmas)} total):")
    print("=" * 60)

    # Print translations
    print("\nTranslations:")
    for lemma in selected_lemmas:
        translation = translations[lemma]
        print(f"\nLemma: {lemma}")
        if translation.en:
            print(f"  English: {', '.join(translation.en)}")
        if translation.ru:
            print(f"  Russian: {', '.join(translation.ru)}")
        if not translation.en and not translation.ru:
            print("  (No translations)")

    print("\n" + "=" * 60)
    print(f"Total lemmas with translations: {len(translations)}")
    
    # Show statistics
    lemmas_with_en = sum(1 for t in translations.values() if t.en)
    lemmas_with_ru = sum(1 for t in translations.values() if t.ru)
    print(f"Lemmas with English translations: {lemmas_with_en}")
    print(f"Lemmas with Russian translations: {lemmas_with_ru}")


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

