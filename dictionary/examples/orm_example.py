"""Example demonstrating ORM functionality.

Selects random words from the 'words' table, converts them to Word objects,
and prints them as JSON.
"""

import json
import sqlite3

from dictionary.config import db_path
from dictionary.orm import word_from_record


def main():
    """Select random words from database and display as JSON."""
    if not db_path.exists():
        print(f"Error: Database not found at {db_path}")
        return

    # Use read-only mode (SQLite MCP read-only mode equivalent)
    db_uri = f"file:{db_path}?mode=ro"
    with sqlite3.connect(db_uri, uri=True) as conn:
        # Configure to return rows as dictionaries
        conn.row_factory = sqlite3.Row
        
        cursor = conn.cursor()
        # Select 5 random words
        cursor.execute("SELECT * FROM words ORDER BY RANDOM() LIMIT 5")
        
        print("Fetching random words from database...")
        print("=" * 60)
        
        words = []
        for row in cursor.fetchall():
            # Convert Row to dict
            record = dict(row)
            word = word_from_record(record)
            words.append(word)
        
        # Print as JSON (use mode='json' to serialize enums properly)
        print("\nWords as JSON:")
        print(json.dumps([word.model_dump(mode='json') for word in words], indent=2, ensure_ascii=False))
        
        print("\n" + "=" * 60)
        print(f"Total words: {len(words)}")


if __name__ == "__main__":
    main()

