import pathlib

base_dir = pathlib.Path(__file__).parent.parent.parent
io_dir = base_dir / "io"
db_path = io_dir / "dict.db"
output_directory = io_dir / "output"

# Phrases directory
phrases_dir = io_dir / "phrases"
phrases_selected_path = phrases_dir / "phrases-selected.json"
greek_50k_path = phrases_dir / "greek-50k.txt"

# Cache file paths
words_cache_path = output_directory / "words.json"
phrases_cache_path = output_directory / "phrases.json"
word_ranking_cache_path = output_directory / "word_ranking.json"
lemma_ranking_cache_path = output_directory / "lemma_ranking.json"
lemmas_cache_path = output_directory / "lemmas.json"
accentless_cache_path = output_directory / "accentless.json"
translations_cache_path = output_directory / "translations.json"
dictionary_cache_path = output_directory / "dictionary.json"
