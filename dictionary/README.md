# Dictionary

This subproject creates dictionary database.

Terminology:

**Word**: word form.

**Lemma**: dictionary form of a word.

**Lexeme**: set of all words with the same lemma.

## Setup

1. Update submodules (see superproject's README):

```bash
(cd .. && git submodule update --init --recursive)
```

2. Create source database

```bash
make create_source_db
```    
