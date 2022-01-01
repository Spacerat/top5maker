import { Graph, isDescendant, transitiveReduction, withEdge } from "./graph";

export type SortCache = Graph;

/** A comparison which needs to be made to continue the sort process */
export type Comparison = {
  /** An item to compare */
  a: string;
  /** An item to compare */
  b: string;
};

type NextComparison = {
  /** Indicates that more comparisons are needed */
  done: false;

  /** The next two values which need to be compared  */
  comparison: Comparison;

  /** The current sort-order of the unsorted items */
  progress: string[];
};

export type SortStatus = ({ done: true } | NextComparison) & {
  /** The sorted items, if any */
  sorted: string[];
  /** The current sort-order of the unsorted items */
  progress: string[];
};

/** Compute the index of the parent of a node in an array-heap */
const parentIdx = (idx: number) => Math.floor((idx - 1) / 2);

/** Compute the indices of the children of a node in an array-heap */
const childIndices = (idx: number): [number, number] => [
  2 * idx + 1,
  2 * idx + 2,
];

/** Create an empty cache (with the appropriate type) */
export function initCache(): SortCache {
  return {};
}

/** Return the cache updated  */
export function cacheWithUpdate(
  cache: SortCache,
  { larger, smaller }: { larger: string; smaller: string }
): SortCache {
  if (isDescendant(cache, { parent: larger, target: smaller })) {
    return cache;
  }
  return transitiveReduction(
    withEdge(cache, { parent: larger, child: smaller })
  );
}

type CacheResult =
  | {
      /** True when the values were found in the cache */
      done: true;
      /** True when 'a' < 'b' */
      lessThan: boolean;
    }
  | NextComparison;

/**
 * Return true or false if it is known that a < b or b < a;
 * Otherwise return a NextComparison object
 */
function getCachedLessThan(
  cache: SortCache,
  heap: string[],
  a: string,
  b: string
): CacheResult {
  if (isDescendant(cache, { parent: a, target: b })) {
    return { done: true, lessThan: false };
  }
  if (isDescendant(cache, { parent: b, target: a })) {
    return { done: true, lessThan: true };
  }
  return {
    comparison: { a, b },
    done: false,
    progress: heap,
  };
}

/** Mutate an array, swapping the items at indices a and b */
function swap<T>(arr: T[], a: number, b: number) {
  [arr[a], arr[b]] = [arr[b], arr[a]];
}

function bestPossibleSort(cache: SortCache, items: readonly string[]) {
  const copy = [...items];
  copy.sort((a, b) => {
    if (isDescendant(cache, { parent: a, target: b })) return -1;
    if (isDescendant(cache, { parent: b, target: a })) return 1;
    return 0;
  });
  return copy;
}

/**
 * Produce the next step of heapsort on the list of items, given a set of known relationships
 *
 * @param cache The cache of known order relationships
 * @param items The items to sort
 * @returns Either another comparison which needs to be added to the cache, or a results object with the sorted items.
 */
export function heapsort(
  cache: SortCache,
  items: readonly string[]
): SortStatus {
  // Create a random heap
  let heap = [...items];

  // Heapify
  const heapifyResult = heapify(cache, items);
  if (!heapifyResult.done) {
    return {
      ...heapifyResult,
      sorted: [],
      progress: bestPossibleSort(cache, heapifyResult.progress),
    };
  }
  heap = heapifyResult.progress;

  // Pop the top off until there's nothing left
  const sorted: string[] = [];

  while (heap.length > 0) {
    swap(heap, 0, heap.length - 1);
    sorted.push(heap.pop() as string);
    const downShiftResult = downHeap(cache, heap, 0);
    if (!downShiftResult.done) {
      return {
        ...downShiftResult,
        progress: bestPossibleSort(cache, heap),
        sorted,
      };
    }
    heap = downShiftResult.progress;
  }

  return { done: true, sorted, progress: heap };
}

/**
 * The result of a step of the sorting algorithm.
 * Either the step is done, or another comparison is needed
 */
type SortStep =
  | {
      /** True when the sort step is done */
      done: true;

      /** The updated state of the heap */
      progress: string[];
    }
  | NextComparison;

/**
 * Produce the next step of building a heap of the list of items, given a set of known relationships.
 *
 * @param cache The cache of known order relationships
 * @param items The items to heapify
 * @returns Either another comparison which needs to be added to the cache, or a results object with the completed heap.
 */
export function heapify(cache: SortCache, items: readonly string[]): SortStep {
  let heap = [...items];

  for (let idx = parentIdx(heap.length - 1); idx >= 0; idx--) {
    const result = downHeap(cache, heap, idx);
    if (!result.done) return result;
    heap = result.progress;
  }

  return { done: true, progress: heap };
}

/**
 * Produce the next step of pushing down an item in a heap, given a set of known relationships.
 *
 * @param cache The cache of known order relationships
 * @param inHeap The start state of the heap
 * @param start The initial index of the item to push down
 * @returns Either another comparison which needs to eb added to the cache, or a results object with the item in a valid position
 */
function downHeap(
  cache: SortCache,
  inHeap: readonly string[],
  start: number
): SortStep {
  const heap = [...inHeap];

  let root = start;
  let [leftChild, rightChild] = childIndices(start);

  while (leftChild < heap.length) {
    let swapWith = root;

    // First figure out if the root should swap
    // with the left child
    const leftChildComparison = getCachedLessThan(
      cache,
      heap,
      heap[swapWith],
      heap[leftChild]
    );
    if (!leftChildComparison.done) {
      return leftChildComparison;
    }
    if (leftChildComparison.lessThan === true) {
      swapWith = leftChild;
    }

    // Then figure out if it should actually swap with the right child
    if (rightChild < heap.length) {
      const rightChildComparison = getCachedLessThan(
        cache,
        heap,
        heap[swapWith],
        heap[rightChild]
      );
      if (!rightChildComparison.done) {
        return rightChildComparison;
      }
      if (rightChildComparison.lessThan === true) {
        swapWith = rightChild;
      }
    }

    // If there's no swap needed, the item is in the correct place
    if (swapWith === root) {
      return { done: true, progress: heap };
    }

    // Otherwise do the swap
    swap(heap, root, swapWith);
    root = swapWith;

    [leftChild, rightChild] = childIndices(root);
  }
  return { done: true, progress: heap };
}
