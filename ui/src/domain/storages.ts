const DICTIONARY_DB_NAME = "dictionary_db";
const DICTIONARY_STORE_NAME = "dictionary";
const DICTIONARY_KEY = "compressed_data";
const DICTIONARY_FILE_PATH = "dictionary.json.gz";
const DB_VERSION = 1;

let tauriCheckCache: boolean | null = null;

export interface BlobStorage {
  load(): Promise<ArrayBuffer | null>;
  save(data: ArrayBuffer): Promise<void>;
}

export interface KvStorage {
  load<T>(key: string): Promise<T | null>;
  save<T>(key: string, value: T): Promise<void>;
}

export function isSupportedPlatform(): boolean {
  return typeof window !== "undefined" || isTauri();
}

export async function createBlobStorage(): Promise<BlobStorage> {
  await initializeTauriCheck();
  if (isTauri()) {
    return new FileBlobStorage();
  } else {
    return new IndexedDbBlobStorage();
  }
}

export async function createKvStorage(): Promise<KvStorage> {
  await initializeTauriCheck();
  if (isTauri()) {
    return new TauriKvStorage();
  } else {
    return new WebKvStorage();
  }
}

export class IndexedDbBlobStorage implements BlobStorage {
  async load(): Promise<ArrayBuffer | null> {
    if (typeof window === "undefined" || !window.indexedDB) {
      return null;
    }
    try {
      const db = await this.openDatabase();
      const compressedData = await new Promise<ArrayBuffer | null>(
        (resolve, reject) => {
          const transaction = db.transaction([DICTIONARY_STORE_NAME], "readonly");
          const store = transaction.objectStore(DICTIONARY_STORE_NAME);
          const request = store.get(DICTIONARY_KEY);
          request.onerror = () => {
            reject(new Error(`Failed to read from IndexedDB: ${request.error}`));
          };
          request.onsuccess = () => {
            resolve(request.result || null);
          };
        }
      );
      return compressedData;
    } catch (error) {
      console.error("Failed to load dictionary from IndexedDB:", error);
      return null;
    }
  }

  async save(data: ArrayBuffer): Promise<void> {
    if (typeof window === "undefined" || !window.indexedDB) {
      throw new Error("IndexedDB not available");
    }
    const db = await this.openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([DICTIONARY_STORE_NAME], "readwrite");
      const store = transaction.objectStore(DICTIONARY_STORE_NAME);
      const request = store.put(data, DICTIONARY_KEY);
      request.onerror = () => {
        reject(new Error(`Failed to store in IndexedDB: ${request.error}`));
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        reject(new Error("IndexedDB not available"));
        return;
      }
      const request = indexedDB.open(DICTIONARY_DB_NAME, DB_VERSION);
      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error}`));
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(DICTIONARY_STORE_NAME)) {
          db.createObjectStore(DICTIONARY_STORE_NAME);
        }
      };
    });
  }
}

export class FileBlobStorage implements BlobStorage {
  async load(): Promise<ArrayBuffer | null> {
    if (!isTauri()) {
      return null;
    }
    try {
      // Using Tauri's fs API to read file
      const {readBinaryFile, BaseDirectory} = await importTauriFs();
      const data = await readBinaryFile(DICTIONARY_FILE_PATH, {
        dir: BaseDirectory.AppLocalData,
      });
      return data.buffer;
    } catch (error) {
      console.error("Failed to load dictionary from file:", error);
      return null;
    }
  }

  async save(data: ArrayBuffer): Promise<void> {
    if (!isTauri()) {
      throw new Error("File storage not available outside Tauri");
    }
    try {
      // Using Tauri's fs API to write file
      const {writeBinaryFile, BaseDirectory} = await importTauriFs();
      await writeBinaryFile(DICTIONARY_FILE_PATH, new Uint8Array(data), {
        dir: BaseDirectory.AppLocalData,
      });
    } catch (error) {
      throw new Error(
        `Failed to save dictionary to file: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

export class WebKvStorage implements KvStorage {
  async load<T>(key: string): Promise<T | null> {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to load key "${key}" from localStorage:`, error);
      return null;
    }
  }

  async save<T>(key: string, value: T): Promise<void> {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new Error("localStorage not available");
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(
        `Failed to save key "${key}" to localStorage: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TauriStore = any;

export class TauriKvStorage implements KvStorage {
  private store: TauriStore = null;

  private async getStore(): Promise<TauriStore> {
    if (this.store) {
      return this.store;
    }
    if (!isTauri()) {
      throw new Error("Tauri store not available outside Tauri");
    }
    try {
      // Using Tauri's store plugin
      const {Store} = await importTauriStore();
      this.store = new Store(".settings.dat");
      return this.store;
    } catch (error) {
      throw new Error(
        `Failed to initialize Tauri store: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async load<T>(key: string): Promise<T | null> {
    if (!isTauri()) {
      return null;
    }
    try {
      const store = await this.getStore();
      const value = (await store.get(key)) as T | undefined;
      return value ?? null;
    } catch (error) {
      console.error(`Failed to load key "${key}" from Tauri store:`, error);
      return null;
    }
  }

  async save<T>(key: string, value: T): Promise<void> {
    if (!isTauri()) {
      throw new Error("Tauri store not available outside Tauri");
    }
    try {
      const store = await this.getStore();
      await store.set(key, value);
      await store.save();
    } catch (error) {
      throw new Error(
        `Failed to save key "${key}" to Tauri store: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

export async function initializeTauriCheck(): Promise<void> {
  if (tauriCheckCache !== null) {
    return;
  }
  
  if (typeof window === "undefined") {
    tauriCheckCache = false;
    return;
  }

  try {
    const importFn = new Function("specifier", "return import(specifier)");
    const core = await importFn("@tauri-apps/api/core");
    tauriCheckCache = await core.isTauri();
  } catch (error) {
    tauriCheckCache = "__TAURI__" in window;
  }
}

export function isTauriInitialized(): boolean {
  return tauriCheckCache !== null;
}

function isTauri(): boolean {
  if (tauriCheckCache !== null) {
    return tauriCheckCache;
  }
  
  return typeof window !== "undefined" && "__TAURI__" in window;
}

// Helper to dynamically import Tauri modules only when needed
// Using Function constructor to prevent bundler from statically analyzing the imports
async function importTauriFs() {
  if (!isTauri()) {
    throw new Error("Tauri not available");
  }
  // Use Function constructor to create a truly dynamic import that prevents static analysis
  // This prevents Next.js/Turbopack from trying to resolve the module at build time
  const importFn = new Function("specifier", "return import(specifier)");
  return await importFn("@tauri-apps/api/fs");
}

async function importTauriStore() {
  if (!isTauri()) {
    throw new Error("Tauri not available");
  }
  // Use Function constructor to create a truly dynamic import that prevents static analysis
  // This prevents Next.js/Turbopack from trying to resolve the module at build time
  const importFn = new Function("specifier", "return import(specifier)");
  return await importFn("tauri-plugin-store-api");
}
