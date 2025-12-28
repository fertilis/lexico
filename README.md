# Lexico

Greek learning dictionary.

Two types of articles: 

- Word form with an example of use (a short sentence with translation).

- Lemma with word forms and grammatical annotations.

Articles are viewed one by one. The user controls repetition frequency by reordering articles.

To quickly scroll through the queue, press and hold left or right arrow. This will invoke a slider.

![Word form: stage 1](docs/1.png)

![Word form: stage 2](docs/2.png)

![Word form: stage 3](docs/3.png)

![Lemma preview](docs/4.png)

## Building for Android

```bash
git submodule update --init --recursive
make build_apk
```

Find .apk file in `tauriapp/dist/` directory.
