"""Example demonstrating accentless word mapping.

Selects random words from the database and shows:
- word -> lemma (from database)
- accentless -> lemma (from accentless database lookup)
- whether the lemmas match
"""

import sqlite3

from dictionary.accentless import create_accentless_database, drop_greek_accents
from dictionary.config import db_path


def main():
    """Select random words and display accentless mappings."""
    if not db_path.exists():
        print(f"Error: Database not found at {db_path}")
        return

    # Create the accentless database mapping
    accentless_db = create_accentless_database()

    # Use read-only mode
    db_uri = f"file:{db_path}?mode=ro"
    with sqlite3.connect(db_uri, uri=True) as conn:
        cursor = conn.cursor()
        # Select 10 random words
        cursor.execute("SELECT form, lemma FROM words ORDER BY RANDOM() LIMIT 10")

        print("Random words from database:\n")
        print(
            f"{'Word':<25} {'Lemma':<25} {'Accentless':<25} {'Accentless->Lemmas':<50} {'Match':<10}"
        )
        print("-" * 135)

        for form, lemma in cursor.fetchall():
            accentless_form = drop_greek_accents(form)
            # Look up the lemmas using the accentless form
            accentless_lemmas = accentless_db.get(accentless_form, ())
            lemma_matched = lemma in accentless_lemmas if accentless_lemmas else False

            # Format lemmas for display
            lemmas_str = ", ".join(accentless_lemmas) if accentless_lemmas else "N/A"
            # Truncate if too long
            if len(lemmas_str) > 48:
                lemmas_str = lemmas_str[:45] + "..."

            match_indicator = "✓" if lemma_matched else ""

            print(
                f"{form:<25} {lemma:<25} {accentless_form:<25} "
                f"{lemmas_str:<50} {match_indicator:<10}"
            )


if __name__ == "__main__":
    main()
