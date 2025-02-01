import { isDescendant } from "./graph";
import { SortCache } from "./sortCache";
import { CacheResult, NextComparison, SortStatus } from "./interruptibleSort";
import { bestSorts } from "./bestSorts";

/** Compute the index of the parent of a node in an array-heap */
const parentIdx = (idx: number) => Math.floor((idx - 1) / 2);

/** Compute the indices of the children of a node in an array-heap */
const childIndices = (idx: number): [number, number] => [
  2 * idx + 1,
  2 * idx + 2,
];

/**
 * Return true or false if it is known that a < b or b < a;
 * Otherwise return a NextComparison object
 */
function getCachedLessThan(
  cache: SortCache,
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
  };
}

/** Mutate an array, swapping the items at indices a and b */
function swap<T>(arr: T[], a: number, b: number) {
  [arr[a], arr[b]] = [arr[b], arr[a]];
}

/**
 * Produce the next step of heapsort on the list of items, given a set of known relationships
 *
 * @param cache The cache of known order relationships
 * @param items The items to sort
 * @returns Either another comparison which needs to be added to the cache, or a results object with the sorted items.
 */
export function heapSort(
  cache: SortCache,
  items: readonly string[]
): SortStatus {
  // Create a random heap
  let heap = [...items];

  // Heapify
  const heapifyResult = heapify(cache, items);
  if (!heapifyResult.done) {
    const { sorted, incompleteSorted, notSorted } = bestSorts(cache, items);
    return {
      done: false,
      comparison: heapifyResult.comparison,
      sorted,
      incompleteSorted,
      notSorted,
    };
  }
  heap = heapifyResult.heap;

  // Pop the top off until there's nothing left
  const popped: string[] = [];

  while (heap.length > 0) {
    swap(heap, 0, heap.length - 1);
    popped.push(heap.pop() as string);
    const downShiftResult = downHeap(cache, heap, 0);
    const { sorted, incompleteSorted, notSorted } = bestSorts(cache, items);

    if (!downShiftResult.done) {
      return {
        done: false,
        comparison: downShiftResult.comparison,
        incompleteSorted,
        notSorted,
        sorted,
      };
    }
    heap = downShiftResult.heap;
  }

  return {
    done: true,
    sorted: popped,
    incompleteSorted: [],
    notSorted: [],
    comparison: null,
  };
}

/**
 * The result of a step of the sorting algorithm.
 * Either the step is done, or another comparison is needed
 */
type SortStep = {
  /* The new state of the heap */
  heap: string[];
} & (
  | {
      /** True when the sort step is done */
      done: true;
      comparison: null;
    }
  | NextComparison
);

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
    heap = result.heap;
  }

  return { done: true, heap, comparison: null };
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
      heap[swapWith],
      heap[leftChild]
    );
    if (!leftChildComparison.done) {
      return { ...leftChildComparison, heap };
    }
    if (leftChildComparison.lessThan === true) {
      swapWith = leftChild;
    }

    // Then figure out if it should actually swap with the right child
    if (rightChild < heap.length) {
      const rightChildComparison = getCachedLessThan(
        cache,
        heap[swapWith],
        heap[rightChild]
      );
      if (!rightChildComparison.done) {
        return { ...rightChildComparison, heap };
      }
      if (rightChildComparison.lessThan === true) {
        swapWith = rightChild;
      }
    }

    // If there's no swap needed, the item is in the correct place
    if (swapWith === root) {
      return { done: true, heap, comparison: null };
    }

    // Otherwise do the swap
    swap(heap, root, swapWith);
    root = swapWith;

    [leftChild, rightChild] = childIndices(root);
  }
  return { done: true, heap, comparison: null };
}
