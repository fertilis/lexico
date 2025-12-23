SHELL := /bin/bash

.PHONY: all clean create_words

all: create_dictionary

create_dictionary: clean io/output/dictionary.json.gz
	
io/output/dictionary.json: io/dict.db io/phrases | io/output
	@echo "Creating dictionary..."
	@uv run python -m dictionary.dictionary

io/output/dictionary.json.gz: io/output/dictionary.json
	@echo "Compressing dictionary..."
	@gzip -k -f $<
	
io/dict.db: lib/gsoc2019-greek-morpho/data/morph-dict-v0.2.zip | io
	@echo "Extracting source database..."
	@rm -rf io/source-db-sql
	@mkdir -p io/source-db-sql
	@unzip -o $< -d io/source-db-sql
	@sqlite3 $@ < io/source-db-sql/dict.sql
	@rm -rf io/source-db-sql
	
io/phrases: lib/greek-phrases-static/data.tar.gz | io
	@echo "Extracting word frequencies and phrases..."
	@rm -rf $@
	@mkdir -p $@
	@tar xzf $< -C $@
	@mv $@/data/* $@
	@rmdir $@/data
	@touch $@
	
io/output: | io
	@mkdir -p io/output
io:
	mkdir -p io
clean:
	@echo "Cleaning output..."
	@rm -rf io/output
