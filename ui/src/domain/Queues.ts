import {createKvStorage, KvStorage} from "./storages";
import {Dictionary} from "./Dictionary";

export enum QueueType {
  WordsCards = "words",
  Lemmas = "lemmas",
  Verbs = "verbs",
  Nouns = "nouns",
  Adjectives = "adjectives",
  Adverbs = "adverbs",
  Other = "other",
}

export type RelativeQueueLength = number;

export enum MoveOffset {
  Offset_10 = "10",
  Offset_100 = "100",
  Offset_1000 = "1000",
  End = "end",
  Pop = "pop",
}

export class Queues {
  private static _instance: Queues | null = null;
  private storage: KvStorage;
  private queues: Map<QueueType, number[] | null>;
  private currentQueueType: QueueType | null | undefined = undefined;

  private constructor() {
    this.storage = createKvStorage();
    this.queues = new Map<QueueType, number[] | null>();
    for (const queueType of Object.values(QueueType)) {
      this.queues.set(queueType, null);
    }
  }

  static get instance(): Queues {
    if (!Queues._instance) {
      Queues._instance = new Queues();
    }
    return Queues._instance;
  }

  isInitialized(): boolean {
    for (const indices of this.queues.values()) {
      if (indices === null) {
        return false;
      }
    }
    if (this.currentQueueType === undefined) {
      return false;
    }
    return true;
  }

  async init(): Promise<void> {
    for (const queueType of Object.values(QueueType)) {
      const storageKey = getStorageKey(queueType);
      const storedIndices = await this.storage.load<number[]>(storageKey);
      if (storedIndices && storedIndices.length > 0) {
        this.queues.set(queueType, storedIndices);
      } else {
        const indices = Dictionary.instance.getInitialQueue(queueType);
        this.queues.set(queueType, indices);
      }
    }
    const storedCurrentQueueType = await this.storage.load<QueueType>(getCurrentQueueTypeStorageKey());
    if (storedCurrentQueueType) {
      this.currentQueueType = storedCurrentQueueType;
    }
  }

  reinit(): void {
    for (const queueType of Object.values(QueueType)) {
      const indices = Dictionary.instance.getInitialQueue(queueType);
      this.queues.set(queueType, indices);
    }
    this.currentQueueType = null;
    this.storage.save(getCurrentQueueTypeStorageKey(), null);
  }

  getFront(queueType: QueueType): number | null {
    const indices = this.queues.get(queueType);
    return indices && indices.length > 0 ? indices[0] : null;
  }

  getLength(queueType: QueueType): number {
    const indices = this.queues.get(queueType);
    return indices ? indices.length : 0;
  }

  frontToBack(queueType: QueueType): void {
    this.rotate(queueType, -1);
  }

  backToFront(queueType: QueueType): void {
    this.rotate(queueType, 1);
  }

  rotate(queueType: QueueType, n: number): void {
    const indices = this.queues.get(queueType);
    if (indices && indices.length > 0) {
      const len = indices.length;
      const k = ((n % len) + len) % len;
      indices.unshift(...indices.splice(len - k));
      this.queues.set(queueType, indices);
      this.storage.save(getStorageKey(queueType), indices);
    }
  }

  moveFrontByOffset(queueType: QueueType, offset: MoveOffset): void {
    const indices = this.queues.get(queueType);
    if (!indices || indices.length === 0) {
      return;
    }
    const frontIndex = indices[0];
    let newPosition: number;
    switch (offset) {
      case MoveOffset.Offset_10:
        newPosition = Math.min(10, indices.length - 1);
        break;
      case MoveOffset.Offset_100:
        newPosition = Math.min(100, indices.length - 1);
        break;
      case MoveOffset.Offset_1000:
        newPosition = Math.min(1000, indices.length - 1);
        break;
      case MoveOffset.End:
        newPosition = indices.length - 1;
        break;
      case MoveOffset.Pop:
        indices.splice(0, 1);
        this.queues.set(queueType, indices);
        return;
      default:
        return;
    }
    indices.splice(0, 1);
    indices.splice(newPosition, 0, frontIndex);
    this.queues.set(queueType, indices);
  }

  calculateFrontAfterRotation(queueType: QueueType, rotation: number): number | null {
    const indices = this.queues.get(queueType);
    if (!indices || indices.length === 0) {
      return null;
    }
    // Create a copy to simulate rotation without modifying the actual queue
    const copy = [...indices];
    const len = copy.length;
    const k = ((rotation % len) + len) % len;
    copy.unshift(...copy.splice(len - k));
    return copy[0];
  }

  getCurrentQueueType(): QueueType | null {
    return this.currentQueueType || null;
  }

  setCurrentQueueType(queueType: QueueType | null): void {
    this.currentQueueType = queueType;
    this.storage.save(getCurrentQueueTypeStorageKey(), queueType);
  }

}

function getStorageKey(queueType: QueueType): string {
  return `queue:${queueType}`;
}

function getCurrentQueueTypeStorageKey(): string {
  return `queue:currentQueueType`;
}
