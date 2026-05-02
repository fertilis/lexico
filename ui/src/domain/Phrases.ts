import pako from "pako";
import type {Phrase} from "./StoredDictionary";
import {
  createKvStorage,
  createPhrasesBlobStorage,
  isSupportedPlatform,
  type BlobStorage,
  type KvStorage,
} from "./storages";

export class Phrases {
  private static _instance: Phrases | null = null;
  private list: Phrase[] = [];
  private _initialized = false;
  private kv: KvStorage | null = null;
  private blob: BlobStorage | null = null;

  private constructor() {}

  static get instance(): Phrases {
    if (!Phrases._instance) {
      Phrases._instance = new Phrases();
    }
    return Phrases._instance;
  }

  isInitialized(): boolean {
    return this._initialized;
  }

  getLength(): number {
    return this.list.length;
  }

  getPhrase(index: number): Phrase {
    if (index < 0 || index >= this.list.length) {
      throw new Error(`Phrase index out of bounds: ${index}`);
    }
    return this.list[index];
  }

  getInitialIndices(): number[] {
    return Array.from({length: this.list.length}, (_, i) => i);
  }

  async init(): Promise<void> {
    if (!isSupportedPlatform()) {
      this._initialized = true;
      return;
    }
    if (!this.kv) {
      this.kv = await createKvStorage();
    }
    if (!this.blob) {
      this.blob = await createPhrasesBlobStorage();
    }

    const localFilename = await this.kv.load<string>(KV_ARTIFACT_KEY);
    const localGz = await this.blob.load();

    let phrases: Phrase[] = [];
    let localParseOk = false;
    if (localGz && localGz.byteLength > 0) {
      try {
        phrases = decompressPhrasesGzip(localGz);
        localParseOk = true;
      } catch (e) {
        console.error("Failed to parse local phrases artifact:", e);
        phrases = [];
      }
    }

    const baseUrl = getPhrasesBaseUrl();
    if (baseUrl) {
      try {
        // Avoid stale manifest/payload when GitHub Pages or the browser HTTP cache
        // still serves an old phrases-current.txt (curl shows the real current file).
        const manifestRes = await fetch(`${baseUrl}/${MANIFEST_NAME}`, {
          cache: "no-store",
        });
        if (manifestRes.ok) {
          const manifestText = await manifestRes.text();
          const remoteFilename = parseManifestLine(manifestText);
          if (remoteFilename) {
            if (remoteFilename === localFilename && localParseOk) {
              this.list = phrases;
              this._initialized = true;
              return;
            }
            const payloadRes = await fetch(`${baseUrl}/${remoteFilename}`, {
              cache: "no-store",
            });
            if (payloadRes.ok) {
              const buf = await payloadRes.arrayBuffer();
              const nextPhrases = decompressPhrasesGzip(buf);
              await this.blob.save(buf);
              await this.kv.save(KV_ARTIFACT_KEY, remoteFilename);
              phrases = nextPhrases;
            }
          }
        }
      } catch (e) {
        console.warn("Phrases remote sync skipped:", e);
      }
    }

    this.list = phrases;
    this._initialized = true;
  }
}


const MANIFEST_NAME = "phrases-current.txt";
const KV_ARTIFACT_KEY = "phrases:artifactFilename";

function getPhrasesBaseUrl(): string | null {
  return "https://fertilis.github.io/lexico-phrases/phrases/";
  //  const raw = process.env.NEXT_PUBLIC_PHRASES_BASE_URL?.trim();
  //  if (!raw) {
  //    return null;
  //  }
  //  return raw.replace(/\/+$/, "");
}

function parseManifestLine(text: string): string | null {
  for (const line of text.split(/\n/)) {
    const t = line.trim();
    if (t.length > 0) {
      return t;
    }
  }
  return null;
}

function isPhrasesPayload(data: unknown): data is {phrases: Phrase[]} {
  if (!data || typeof data !== "object") {
    return false;
  }
  const rec = data as Record<string, unknown>;
  if (!Array.isArray(rec.phrases)) {
    return false;
  }
  for (const item of rec.phrases) {
    if (!item || typeof item !== "object") {
      return false;
    }
    const o = item as Record<string, unknown>;
    if (typeof o.greek !== "string" || typeof o.english !== "string") {
      return false;
    }
  }
  return true;
}

function decompressPhrasesGzip(buf: ArrayBuffer): Phrase[] {
  const decompressed = pako.inflate(new Uint8Array(buf), {to: "string"});
  const parsed: unknown = JSON.parse(decompressed);
  if (!isPhrasesPayload(parsed)) {
    throw new Error("Invalid phrases JSON shape");
  }
  return parsed.phrases;
}
