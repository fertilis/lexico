# User Interface of Learning Greek Dictionary

The unit of display ("page", "screen") is called an "article" (dictionary article).

There are two kinds of articles: 

**Lemma articles**: display lemma and all word forms with grammatical information 
as well as one or many use examples (short sentences with English translation).

**Word articles**: display word form, grammatical information, and one use example.

Different parts of the article are displayed sequencially as the user presses the "Next" button.

For lemma articles, such parts are: lemma, translation, use examples, all word forms with grammatical information.

For word articles, such parts are: word form, grammatical information, use example.

After the artcle is fully displayed, the use chooses the next position of this article in the display queue.
E.g. move by 10, 100, or 1000 articles or pop from the queue. This reflects user's recall of the article.

There are several article queues maintained: one for words, one for full list of lemmas, and one for every list of lemmas by part of speech.

These queues are initialized by the order of items in the immutable database (from most frequent to least frequent).
As user progresses through the articles, the selected queue changes.

The user can switch between queues at any time.

Queues are stored locally (e.g. in browser's local storage).

This application works without a backend. The database is represented by JSON object downloaded at startup and optionally stored locally.
This database is immutable. Python definitions used to created database JSON object can be found in `dictionary.py`.
Root object corresponds to `Dictionary' class.

The user can reload database to get the latest version.
Reloading database invalidates stored queues.

## Development

```bash
npm run dev
