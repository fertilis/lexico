import enum

from pydantic import BaseModel, Field


class PartOfSpeechEnglish(enum.Enum):
    ADJ = "ADJ"
    ADP = "ADP"  # preposition
    ADV = "ADV"
    INTJ = "INTJ"
    NOUN = "NOUN"
    NUM = "NUM"
    PART = "PART"
    PRON = "PRON"
    PROPN = "PROPN"  # proper noun
    VERB = "VERB"


class PartOfSpeechGreek(enum.Enum):
    AOR_APAREMFATO = "AOR_APAREMFATO"
    AOR_A_ENIKO = "AOR_A_ENIKO"
    AOR_A_PL = "AOR_A_PL"
    AOR_B_ENIKO = "AOR_B_ENIKO"
    AOR_B_PL = "AOR_B_PL"
    AOR_G_ENIKO = "AOR_G_ENIKO"
    AOR_G_PL = "AOR_G_PL"
    AOR_YPOT_A_ENIKO = "AOR_YPOT_A_ENIKO"
    AOR_YPOT_A_PL = "AOR_YPOT_A_PL"
    AOR_YPOT_B_ENIKO = "AOR_YPOT_B_ENIKO"
    AOR_YPOT_B_PL = "AOR_YPOT_B_PL"
    AOR_YPOT_G_ENIKO = "AOR_YPOT_G_ENIKO"
    AOR_YPOT_G_PL = "AOR_YPOT_G_PL"
    ENEST_A_ENIKO = "ENEST_A_ENIKO"
    ENEST_A_PL = "ENEST_A_PL"
    ENEST_B_ENIKO = "ENEST_B_ENIKO"
    ENEST_B_PL = "ENEST_B_PL"
    ENEST_G_ENIKO = "ENEST_G_ENIKO"
    ENEST_G_PL = "ENEST_G_PL"
    METOXI = "METOXI"
    METOXI_EE = "METOXI_EE"
    METOXI_PE = "METOXI_PE"
    METOXI_PP = "METOXI_PP"
    PARATATIKOS_A_ENIKO = "PARATATIKOS_A_ENIKO"
    PARATATIKOS_A_PL = "PARATATIKOS_A_PL"
    PARATATIKOS_B_ENIKO = "PARATATIKOS_B_ENIKO"
    PARATATIKOS_B_PL = "PARATATIKOS_B_PL"
    PARATATIKOS_G_ENIKO = "PARATATIKOS_G_ENIKO"
    PARATATIKOS_G_PL = "PARATATIKOS_G_PL"
    PROST_AOR_B_ENIKO = "PROST_AOR_B_ENIKO"
    PROST_AOR_B_PL = "PROST_AOR_B_PL"
    PROST_ENEST_B_ENIKO = "PROST_ENEST_B_ENIKO"
    PROST_ENEST_B_PL = "PROST_ENEST_B_PL"


class Gender(enum.Enum):
    Masc = "Masc"
    Fem = "Fem"
    Neut = "Neut"


class Ptosi(enum.Enum):
    Nom = "Nom"
    Gen = "Gen"
    Acc = "Acc"
    Voc = "Voc"
    ERROR = "ERROR"


class Number(enum.Enum):
    Sing = "Sing"
    Plur = "Plur"
    ERROR = "ERROR"


class Person(enum.Enum):
    First = "1"
    Second = "2"
    Third = "3"


class Tense(enum.Enum):
    Past = "Past"
    Pres = "Pres"


class Aspect(enum.Enum):
    Imp = "Imp"
    Ind = "Ind"
    Perf = "Perf"


class Mood(enum.Enum):
    Imp = "Imp"
    Ind = "Ind"


class VerbForm(enum.Enum):
    Conv = "Conv"
    Fin = "Fin"
    Inf = "Inf"
    Part = "Part"


class Voice(enum.Enum):
    Act = "Act"
    Pass = "Pass"


class Degree(enum.Enum):
    Cmp = "Cmp"
    Sup = "Sup"


class Phrase(BaseModel):
    greek: str
    english: str


class Translation(BaseModel):
    en: list[str] = Field(default_factory=list)
    ru: list[str] = Field(default_factory=list)


class Word(BaseModel):
    form: str
    lemma: str
    lemma_index: int = -1
    frequency_rank: int | None = None
    pos_en: PartOfSpeechEnglish
    pos_el: PartOfSpeechGreek | None = None
    gender: Gender | None = None
    ptosi: Ptosi | None = None
    number: Number | None = None
    degree: Degree | None = None
    person: Person | None = None
    tense: Tense | None = None
    aspect: Aspect | None = None
    mood: Mood | None = None
    verbform: VerbForm | None = None
    voice: Voice | None = None
    tags: str | None = None

    _identity_fields = (
        "form",
        "lemma",
        "pos_en",
        "pos_el",
        "gender",
        "ptosi",
        "number",
        "degree",
        "person",
        "tense",
        "aspect",
        "mood",
        "verbform",
        "voice",
    )

    def _identity_tuple(self) -> tuple:
        return tuple(getattr(self, field) for field in self._identity_fields)

    def __eq__(self, other):
        return (
            isinstance(other, Word)
            and self._identity_tuple() == other._identity_tuple()
        )

    def __hash__(self):
        return hash(self._identity_tuple())

    def __str__(self):
        return f"{self.form} ({self.lemma})"


class WordCard(BaseModel):
    form: str
    phrases: list[Phrase]
    word_indices: list[
        int
    ]  # one word form may belong to multiple Word or Lemma objects due to part of speech ambiguity
    lemma_indices: list[int]


class Lemma(BaseModel):
    lemma: str
    pos_en: PartOfSpeechEnglish
    frequency_rank: int | None = None
    translation: Translation | None = None
    word_indices: list[int] = Field(default_factory=list)


class Dictionary(BaseModel):
    lemmas: list[Lemma]
    words: list[Word]
    pos_lemma_index: dict[PartOfSpeechEnglish, list[int]]
    word_cards: list[WordCard]
