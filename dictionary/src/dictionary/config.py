import pathlib

# Base directory (project root)
base_dir = pathlib.Path(__file__).parent.parent.parent

# IO directory
io_dir = base_dir / "io"

# Database paths
db_path = io_dir / "dict.db"

# Cache file paths
words_cache_path = io_dir / "words.json"
phrases_cache_path = io_dir / "phrases.json"
word_ranking_cache_path = io_dir / "word_ranking.json"
lemma_ranking_cache_path = io_dir / "lemma_ranking.json"
accentless_cache_path = io_dir / "accentless.json"
translations_cache_path = io_dir / "translations.json"

# Phrases directory
phrases_dir = io_dir / "phrases"
phrases_selected_path = phrases_dir / "phrases-selected.json"
greek_50k_path = phrases_dir / "greek-50k.txt"

