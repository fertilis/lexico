export enum PartOfSpeechEnglish {
  ADJ = "ADJ",
  ADP = "ADP", // preposition
  ADV = "ADV",
  INTJ = "INTJ",
  NOUN = "NOUN",
  NUM = "NUM",
  PART = "PART",
  PRON = "PRON",
  PROPN = "PROPN", // proper noun
  VERB = "VERB",
}

export enum PartOfSpeechGreek {
  AOR_APAREMFATO = "AOR_APAREMFATO",
  AOR_A_ENIKO = "AOR_A_ENIKO",
  AOR_A_PL = "AOR_A_PL",
  AOR_B_ENIKO = "AOR_B_ENIKO",
  AOR_B_PL = "AOR_B_PL",
  AOR_G_ENIKO = "AOR_G_ENIKO",
  AOR_G_PL = "AOR_G_PL",
  AOR_YPOT_A_ENIKO = "AOR_YPOT_A_ENIKO",
  AOR_YPOT_A_PL = "AOR_YPOT_A_PL",
  AOR_YPOT_B_ENIKO = "AOR_YPOT_B_ENIKO",
  AOR_YPOT_B_PL = "AOR_YPOT_B_PL",
  AOR_YPOT_G_ENIKO = "AOR_YPOT_G_ENIKO",
  AOR_YPOT_G_PL = "AOR_YPOT_G_PL",
  ENEST_A_ENIKO = "ENEST_A_ENIKO",
  ENEST_A_PL = "ENEST_A_PL",
  ENEST_B_ENIKO = "ENEST_B_ENIKO",
  ENEST_B_PL = "ENEST_B_PL",
  ENEST_G_ENIKO = "ENEST_G_ENIKO",
  ENEST_G_PL = "ENEST_G_PL",
  METOXI = "METOXI",
  METOXI_EE = "METOXI_EE",
  METOXI_PE = "METOXI_PE",
  METOXI_PP = "METOXI_PP",
  PARATATIKOS_A_ENIKO = "PARATATIKOS_A_ENIKO",
  PARATATIKOS_A_PL = "PARATATIKOS_A_PL",
  PARATATIKOS_B_ENIKO = "PARATATIKOS_B_ENIKO",
  PARATATIKOS_B_PL = "PARATATIKOS_B_PL",
  PARATATIKOS_G_ENIKO = "PARATATIKOS_G_ENIKO",
  PARATATIKOS_G_PL = "PARATATIKOS_G_PL",
  PROST_AOR_B_ENIKO = "PROST_AOR_B_ENIKO",
  PROST_AOR_B_PL = "PROST_AOR_B_PL",
  PROST_ENEST_B_ENIKO = "PROST_ENEST_B_ENIKO",
  PROST_ENEST_B_PL = "PROST_ENEST_B_PL",
}

export enum Gender {
  Masc = "Masc",
  Fem = "Fem",
  Neut = "Neut",
}

export enum Ptosi {
  Nom = "Nom",
  Gen = "Gen",
  Acc = "Acc",
  Voc = "Voc",
  ERROR = "ERROR",
}

export enum Number {
  Sing = "Sing",
  Plur = "Plur",
  ERROR = "ERROR",
}

export enum Person {
  First = "1",
  Second = "2",
  Third = "3",
}

export enum Tense {
  Past = "Past",
  Pres = "Pres",
}

export enum Aspect {
  Imp = "Imp",
  Ind = "Ind",
  Perf = "Perf",
}

export enum Mood {
  Imp = "Imp",
  Ind = "Ind",
}

export enum VerbForm {
  Conv = "Conv",
  Fin = "Fin",
  Inf = "Inf",
  Part = "Part",
}

export enum Voice {
  Act = "Act",
  Pass = "Pass",
}

export enum Degree {
  Cmp = "Cmp",
  Sup = "Sup",
}

export interface Phrase {
  greek: string;
  english: string;
}

export interface Translation {
  en: string[];
  ru: string[];
}

export interface StoredWord {
  form: string;
  lemma: string;
  lemma_index: number;
  frequency_rank: number | null;
  pos_en: PartOfSpeechEnglish;
  pos_el: PartOfSpeechGreek | null;
  gender: Gender | null;
  ptosi: Ptosi | null;
  number: Number | null;
  degree: Degree | null;
  person: Person | null;
  tense: Tense | null;
  aspect: Aspect | null;
  mood: Mood | null;
  verbform: VerbForm | null;
  voice: Voice | null;
}

export interface StoredLemma {
  lemma: string;
  pos_en: PartOfSpeechEnglish;
  frequency_rank: number | null;
  translation: Translation | null;
  word_indices: number[];
}

export interface StoredWordCard {
  form: string;
  phrases: Phrase[];
  word_indices: number[]; // one word form may belong to multiple Word or Lemma objects due to part of speech ambiguity
  lemma_indices: number[];
}

export interface StoredDictionary {
  lemmas: StoredLemma[];
  words: StoredWord[];
  pos_lemma_index: Record<PartOfSpeechEnglish, number[]>;
  word_cards: StoredWordCard[];
}

