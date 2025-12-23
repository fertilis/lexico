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
E.g. move by 10, 100, or 1000 articles or to the end of the queue. This reflects user's recall of the article.

There are several article queues maintained: one for words, one for full list of lemmas, and one for every list of lemmas by part of speech.

These queues are initialized by the order of items in the immutable database (from most frequent to least frequent).
As user progresses through the articles, the selected queue changes.

The user can switch between queues at any time.

Queues are stored locally (e.g. in browser's local storage).

This application works without a backend. The database is represented by JSON object downloaded at startup and stored locally.
This database is immutable. Python definitions used to created database JSON object can be found in `dictionary.py`.
Root object corresponds to `Dictionary' class.

The user can reload database to store locally the latest version.

## UI components

- Menu:
  + Reload database
  + Words (switches to the words queue)
  + Lemmas (switches to the lemmas queue)
  + Verbs (switches to the verb lemmas queue)
  + Nouns (switches to the noun lemmas queue)
  + Adjectives (switches to the adjective lemmas queue)
  + Adverbs (switches to the adverb lemmas queue)
  + Other (switches to the lemmas queue, representing other parts of speech)
  

- Position selector (select current position in the current queue):
  + Input with shift to front (negative values) or to back (positive values)
  + Slider to select the shift to front (negative values) or to back (positive values)
  
- Move selector (select offset for the next position of currently displayed article in the current queue):
  + Move by 10
  + Move by 100
  + Move by 1000
  + Move to the end

- Menue button

- Article display area (scrollable)

- Welcome screen

- Queue screen: queue name, reset button, current position selector

- Contextual control panel: next button, move selector

## Layout

Top row with menu button.

Bottom row with main display area to show:

- welcome screen
- menu
- queue screen
- article: top row the article itself, bottom row the contextual control panel

## Behavior

- At launch, check if the database is stored locally.
  If not, show the welcome screen.
  If yes, check if current queue is stored.
  + If not, show the menu.
  + If yes, display the article.

- Pressing menu button brings in the menu to the main display area. 
  Pressing again removes the menu and restores previous component.
  
- Welcome screen shows some text and single "Load database" button.
  Pressing the button downloads the database JSON object and stores it locally.
  Then shows the menu.
  While downloading, shows a progress indicator.
  
- Pressing "Reload database" in the menu, opens welcome screen in "progress" mode.

- Pressing other buttons of the menu:
  + marks selection of the current queue
  + opens the queue screen
    
- Queue screen: contains selector and OK button.
  + Changing the selector, changes current position in the current queue.
  + Pressing OK button, brings in article screen.
  
- Article screen:
  + Pressing "Next" button, progresses display of the article.
  + After the article is fully displayed, the contextual control panel shows the move selector.
    Changing the selector:
    * sets the next position of the article in the current queue
    * brings in the next article

## Development

```bash
npm run dev
```

