# Lexico

Greek learning dictionary.

Two types of articles: 

- Word form with example use (short sentence with translation).

- Lemma with word forms and grammatical annotations.

Articles are viewed one by one. The user controls repetition frequency by placing the current article 
to the end or somewhere in the middle of the queue.

![Word form: stage 1](docs/1.png)

![Word form: stage 2](docs/2.png)

![Word form: stage 3](docs/3.png)

![Lemma preview](docs/4.png)


## Building for Android

```bash
git submodule update --init --recursive
make build_apk
```

Find .apk file in [tauriapp/dist/](tauriapp/dist/) folder.
