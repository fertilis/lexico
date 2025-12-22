SHELL := /bin/bash

extract_source_db:
	@mkdir -p io/source-db-sql
	@unzip -o lib/gsoc2019-greek-morpho/data/morph-dict-v0.2.zip -d io/source-db-sql
	@sqlite3 io/dict.db < io/source-db-sql/dict.sql
	@rm -rf io/source-db-sql
	
extract_word_frequencies_and_phrases:
	@rm -rf io/phrases
	@mkdir -p io/phrases
	@tar xzf lib/greek-phrases-static/data.tar.gz -C io/phrases
	@mv io/phrases/data/* io/phrases/
	@rmdir io/phrases/data
