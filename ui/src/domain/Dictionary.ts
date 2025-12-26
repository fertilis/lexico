/**
 *  Use
 *  // Initialize (call once at app startup)
 *  await Dictionary.instance.init();
 *
 *  // Get word/article by index
 *  const word = Dictionary.instance.getWord(42);
 *  const lemma = Dictionary.instance.getLemma(10);
 *  const wordCard = Dictionary.instance.getWordCard(5);
 *
 *  // Navigate between word and lemma
 *  const wordLemma = word.getLemma();
 *  const lemmaWords = lemma.getWords();
 *  const wordCardWords = wordCard.getWords();
 *  const wordCardLemmas = wordCard.getLemmas();
 *
 *  // Get initial queue indices
 *  const wordQueue = Dictionary.instance.getInitialQueue(QueueType.Words);
 *  const verbQueue = Dictionary.instance.getInitialQueue(QueueType.Verbs);
 */
import pako from "pako";
import {
  StoredDictionary,
  StoredWord,
  StoredLemma,
  StoredWordCard,
  PartOfSpeechEnglish,
} from "./StoredDictionary";
import {QueueType} from "./Queues";
import {
  BlobStorage,
  createBlobStorage,
  isSupportedPlatform,
} from "./storages";

const DICTIONARY_URL = "/dictionary.json.gz";

export class Word {
  constructor(
    private readonly _storedData: StoredWord,
    private readonly dictionary: Dictionary
  ) {}

  get stored(): StoredWord {
    return this._storedData;
  }

  getLemma(): Lemma {
    return this.dictionary.getLemma(this._storedData.lemma_index);
  }
}

export class Lemma {
  constructor(
    private readonly _storedData: StoredLemma,
    private readonly dictionary: Dictionary
  ) {}

  get stored(): StoredLemma {
    return this._storedData;
  }

  getWords(): Word[] {
    return this._storedData.word_indices.map((index) =>
      this.dictionary.getWord(index)
    );
  }
}

export class WordCard {
  constructor(
    private readonly _storedData: StoredWordCard,
    private readonly dictionary: Dictionary
  ) {}

  get stored(): StoredWordCard {
    return this._storedData;
  }

  getWords(): Word[] {
    return this._storedData.word_indices.map((index) =>
      this.dictionary.getWord(index)
    );
  }

  getLemmas(): Lemma[] {
    return this._storedData.lemma_indices.map((index) =>
      this.dictionary.getLemma(index)
    );
  }
}

/**
 * Repository for accessing the static dictionary database.
 * Implements singleton pattern to ensure single instance across the application.
 */
export class Dictionary {
  private static _instance: Dictionary | null = null;
  private static storeLocally: boolean = false;
  private stored: StoredDictionary | null = null;
  private storage: BlobStorage | null = null;

  private constructor() {}

  static get instance(): Dictionary {
    if (!Dictionary._instance) {
      Dictionary._instance = new Dictionary();
    }
    return Dictionary._instance;
  }

  async init(): Promise<void> {
    if (Dictionary.storeLocally) {
      if (!this.storage) {
        this.storage = await createBlobStorage();
      }
      const storedData = await this.loadDictionary();
      if (storedData) {
        this.stored = storedData;
        return;
      }
      await this.reinit();
    } else {
      if (!isSupportedPlatform()) {
        throw new Error("Cannot download dictionary on server side");
      }
      try {
        const compressedData = await this.fetchDictionary();
        this.stored = this.decompressAndParse(compressedData);
      } catch (error) {
        console.error("Failed to download and load dictionary:", error);
        throw new Error(
          `Failed to initialize dictionary: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }

  async reinit(): Promise<void> {
    if (!isSupportedPlatform()) {
      throw new Error("Cannot download dictionary on server side");
    }
    try {
      const compressedData = await this.fetchDictionary();
      if (Dictionary.storeLocally) {
        if (!this.storage) {
          this.storage = await createBlobStorage();
        }
        await this.storage.save(compressedData);
        const storedData = await this.loadDictionary();
        if (storedData) {
          this.stored = storedData;
        }
      } else {
        // When not storing locally, parse directly
        this.stored = this.decompressAndParse(compressedData);
      }
    } catch (error) {
      console.error("Failed to download and load dictionary:", error);
      throw new Error(
        `Failed to initialize dictionary: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async loadDictionary(): Promise<StoredDictionary | null> {
    if (!Dictionary.storeLocally) {
      return null; // Storage not used when storeLocally is false
    }
    if (!isSupportedPlatform()) {
      return null; // Server-side rendering
    }
    if (!this.storage) {
      throw new Error("Storage not initialized");
    }
    try {
      const compressedData = await this.storage.load();
      if (!compressedData) {
        return null;
      }
      return this.decompressAndParse(compressedData);
    } catch (error) {
      console.error("Failed to load dictionary from storage:", error);
      return null;
    }
  }

  private decompressAndParse(compressedData: ArrayBuffer): StoredDictionary {
    const decompressedData = pako.inflate(new Uint8Array(compressedData), {
      to: "string",
    });
    const parsed = JSON.parse(decompressedData) as StoredDictionary;
    this.validateDictionary(parsed);
    return parsed;
  }

  private async fetchDictionary(): Promise<ArrayBuffer> {
    if (!isSupportedPlatform()) {
      throw new Error("Cannot download dictionary on server side");
    }
    try {
      const response = await fetch(DICTIONARY_URL);
      if (!response.ok) {
        throw new Error(`Failed to download dictionary: ${response.statusText}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error("Failed to download dictionary:", error);
      throw new Error(
        `Failed to initialize dictionary: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private validateDictionary(data: unknown): asserts data is StoredDictionary {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid dictionary: not an object");
    }

    const dict = data as Record<string, unknown>;
    if (!Array.isArray(dict.lemmas)) {
      throw new Error("Invalid dictionary: lemmas is not an array");
    }
    if (!Array.isArray(dict.words)) {
      throw new Error("Invalid dictionary: words is not an array");
    }
    if (!dict.pos_lemma_index || typeof dict.pos_lemma_index !== "object") {
      throw new Error("Invalid dictionary: pos_lemma_index is not an object");
    }
    // word_cards is optional to maintain backward compatibility with existing storage
    if (dict.word_cards !== undefined && !Array.isArray(dict.word_cards)) {
      throw new Error("Invalid dictionary: word_cards is not an array");
    }
  }

  private ensureInitialized(): void {
    if (!this.stored) {
      throw new Error(
        "Dictionary not initialized. Call Dictionary.instance.init() first."
      );
    }
  }

  isInitialized(): boolean {
    return this.stored !== null;
  }

  getWord(index: number): Word {
    this.ensureInitialized();
    if (index < 0 || index >= this.stored!.words.length) {
      throw new Error(`Word index out of bounds: ${index}`);
    }
    return new Word(this.stored!.words[index], this);
  }

  getLemma(index: number): Lemma {
    this.ensureInitialized();
    if (index < 0 || index >= this.stored!.lemmas.length) {
      throw new Error(`Lemma index out of bounds: ${index}`);
    }
    return new Lemma(this.stored!.lemmas[index], this);
  }

  getWords(indices: number[]): Word[] {
    return indices.map((index) => this.getWord(index));
  }

  getWordCard(index: number): WordCard {
    this.ensureInitialized();
    if (!this.stored!.word_cards) {
      throw new Error("Dictionary does not contain word cards");
    }
    if (index < 0 || index >= this.stored!.word_cards.length) {
      throw new Error(`WordCard index out of bounds: ${index}`);
    }
    return new WordCard(this.stored!.word_cards[index], this);
  }

  getInitialQueue(queueType: QueueType): number[] {
    this.ensureInitialized();
    const stored = this.stored!;

    switch (queueType) {
      case QueueType.WordsCards: {
        return Array.from({length: stored.word_cards.length}, (_, i) => i);
      }

      case QueueType.Lemmas: {
        return Array.from(
          {length: stored.lemmas.length},
          (_, i) => i
        );
      }

      case QueueType.Verbs: {
        return stored.pos_lemma_index[PartOfSpeechEnglish.VERB] || [];
      }

      case QueueType.Nouns: {
        return stored.pos_lemma_index[PartOfSpeechEnglish.NOUN] || [];
      }

      case QueueType.Adjectives: {
        return stored.pos_lemma_index[PartOfSpeechEnglish.ADJ] || [];
      }

      case QueueType.Adverbs: {
        return stored.pos_lemma_index[PartOfSpeechEnglish.ADV] || [];
      }

      case QueueType.Other: {
        // Get all lemmas not in VERB, NOUN, ADJ, ADV
        const excludedPos = new Set([
          PartOfSpeechEnglish.VERB,
          PartOfSpeechEnglish.NOUN,
          PartOfSpeechEnglish.ADJ,
          PartOfSpeechEnglish.ADV,
        ]);

        return Array.from(
          {length: stored.lemmas.length},
          (_, i) => i
        ).filter((idx) => !excludedPos.has(stored.lemmas[idx].pos_en));

      }

      default: {
        const _exhaustive: never = queueType;
        throw new Error(`Unknown queue type: ${_exhaustive}`);
      }
    }
  }
}
