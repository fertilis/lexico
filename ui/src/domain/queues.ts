/**
 * Queue storage interfaces for managing article display queues.
 * 
 * Queues store ordered lists of article indices (references to the immutable dictionary).
 * Position updates are optimized to minimize local storage writes.
 */

/**
 * Type identifier for different queue types.
 * Enum used for exhaustive enumeration when matching menu items.
 */
export enum QueueType {
  Words = "words",
  Lemmas = "lemmas",
  Verbs = "verbs",
  Nouns = "nouns",
  Adjectives = "adjectives",
  Adverbs = "adverbs",
  Other = "other",
}

/**
 * Queue data structure storing the ordered list of article indices.
 * Indices reference either words[] or lemmas[] from the Dictionary.
 */
export interface QueueData {
  /** Ordered array of indices (word indices or lemma indices) */
  indices: number[];
}

/**
 * Current position state for a queue.
 * Stored separately to allow cheap position updates without rewriting the entire queue.
 */
export interface QueuePosition {
  /** Current position index in the queue (0-based) */
  position: number;
}

/**
 * Complete queue state combining data and position.
 * Used for in-memory operations.
 */
export interface QueueState {
  data: QueueData;
  position: QueuePosition;
}

/**
 * Storage key structure for local storage.
 * Each queue type has separate keys for data and position to enable cheap updates.
 */
export interface QueueStorageKeys {
  /** Key for storing queue indices array */
  dataKey: string;
  /** Key for storing current position */
  positionKey: string;
}

/**
 * Complete storage structure mapping queue types to their storage keys.
 */
export const QUEUE_STORAGE_KEYS: Record<QueueType, QueueStorageKeys> = {
  [QueueType.Words]: {
    dataKey: "queue:words:data",
    positionKey: "queue:words:position",
  },
  [QueueType.Lemmas]: {
    dataKey: "queue:lemmas:data",
    positionKey: "queue:lemmas:position",
  },
  [QueueType.Verbs]: {
    dataKey: "queue:verbs:data",
    positionKey: "queue:verbs:position",
  },
  [QueueType.Nouns]: {
    dataKey: "queue:nouns:data",
    positionKey: "queue:nouns:position",
  },
  [QueueType.Adjectives]: {
    dataKey: "queue:adjectives:data",
    positionKey: "queue:adjectives:position",
  },
  [QueueType.Adverbs]: {
    dataKey: "queue:adverbs:data",
    positionKey: "queue:adverbs:position",
  },
  [QueueType.Other]: {
    dataKey: "queue:other:data",
    positionKey: "queue:other:position",
  },
};

/**
 * Storage interface for queue operations.
 * Abstracts local storage operations to allow for easy testing and future migration.
 */
export interface QueueStorage {
  /**
   * Load queue data (indices array) for a given queue type.
   * Returns null if not found.
   */
  loadQueueData(queueType: QueueType): QueueData | null;

  /**
   * Save queue data (indices array) for a given queue type.
   * This is a relatively expensive operation as it writes the entire array.
   */
  saveQueueData(queueType: QueueType, data: QueueData): void;

  /**
   * Load current position for a given queue type.
   * Returns null if not found.
   */
  loadQueuePosition(queueType: QueueType): QueuePosition | null;

  /**
   * Save current position for a given queue type.
   * This is a cheap operation as it only writes a single number.
   */
  saveQueuePosition(queueType: QueueType, position: QueuePosition): void;

  /**
   * Load complete queue state (data + position).
   */
  loadQueueState(queueType: QueueType): QueueState | null;

  /**
   * Save complete queue state (data + position).
   */
  saveQueueState(queueType: QueueType, state: QueueState): void;
}

/**
 * Browser local storage implementation of QueueStorage.
 */
export class LocalStorageQueueStorage implements QueueStorage {
  loadQueueData(queueType: QueueType): QueueData | null {
    const key = QUEUE_STORAGE_KEYS[queueType].dataKey;
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      return {
        indices: parsed.indices || [],
      };
    } catch {
      return null;
    }
  }

  saveQueueData(queueType: QueueType, data: QueueData): void {
    const key = QUEUE_STORAGE_KEYS[queueType].dataKey;
    localStorage.setItem(key, JSON.stringify(data));
  }

  loadQueuePosition(queueType: QueueType): QueuePosition | null {
    const key = QUEUE_STORAGE_KEYS[queueType].positionKey;
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      return {
        position: parsed.position ?? 0,
      };
    } catch {
      return null;
    }
  }

  saveQueuePosition(queueType: QueueType, position: QueuePosition): void {
    const key = QUEUE_STORAGE_KEYS[queueType].positionKey;
    localStorage.setItem(key, JSON.stringify(position));
  }

  loadQueueState(queueType: QueueType): QueueState | null {
    const data = this.loadQueueData(queueType);
    const position = this.loadQueuePosition(queueType);

    if (!data || position === null) return null;

    return {data, position};
  }

  saveQueueState(queueType: QueueType, state: QueueState): void {
    this.saveQueueData(queueType, state.data);
    this.saveQueuePosition(queueType, state.position);
  }
}

/**
 * Helper function to move an article within a queue.
 * Removes the article from its current position and inserts it at a new position.
 * 
 * @param indices - The queue indices array (will be mutated)
 * @param currentIndex - Current position of the article
 * @param newIndex - New position for the article
 * @returns The updated indices array
 */
export function moveArticleInQueue(
  indices: number[],
  currentIndex: number,
  newIndex: number
): number[] {
  if (currentIndex < 0 || currentIndex >= indices.length) {
    throw new Error(`Invalid current index: ${currentIndex}`);
  }
  if (newIndex < 0 || newIndex > indices.length) {
    throw new Error(`Invalid new index: ${newIndex}`);
  }

  const articleId = indices[currentIndex];
  const updated = [...indices];
  updated.splice(currentIndex, 1);
  updated.splice(newIndex, 0, articleId);
  return updated;
}

/**
 * Calculate new position when moving an article by an offset.
 * 
 * @param currentPosition - Current position in queue
 * @param offset - Offset to move (positive = move back, negative = move forward)
 * @param queueLength - Total length of the queue
 * @returns New position (clamped to valid range)
 */
export function calculateNewPosition(
  currentPosition: number,
  offset: number,
  queueLength: number
): number {
  const newPosition = currentPosition + offset;
  return Math.max(0, Math.min(newPosition, queueLength - 1));
}

/**
 * Enum for move offset types.
 */
export enum MoveOffset {
  Offset_10 = "10",
  Offset_100 = "100",
  Offset_1000 = "1000",
  End = "end",
}

/**
 * Calculate position offset for common move operations.
 */
export function getMoveOffset(moveType: MoveOffset, queueLength: number): number {
  switch (moveType) {
    case MoveOffset.Offset_10:
      return 10;
    case MoveOffset.Offset_100:
      return 100;
    case MoveOffset.Offset_1000:
      return 1000;
    case MoveOffset.End:
      return queueLength; // Will be clamped by calculateNewPosition
    default:
      return 0;
  }
}

