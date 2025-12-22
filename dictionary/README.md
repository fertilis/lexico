# Dictionary

This subproject creates dictionary database.

Terminology:

**Word**: word form.

**Lemma**: dictionary form of a word.

**Lexeme**: set of all words with the same lemma.

## Use

```bash
make
```    

This creates `io/words.json.gz` file with `Word` objects sorted by `(occurance phrases.json, rank)`

`Word`s can be grouped into lexemes by common lemma.

`Word` array should be enough by itself to create any dictionary display.
