import { Graph, withEdge, transitiveReduction, isDescendant } from "./graph";

export type Comparison = {
  a: string;
  b: string;
};

type NextComparison = {
  done: false;
  comparison: Comparison;
  progress: string[];
};

type GetComparisonResult = ({ done: true } | NextComparison) & {
  sorted: string[];
  progress: string[];
};

type CacheResult = { done: true; lessThan: boolean } | NextComparison;

type IntermediateResult =
  | {
      done: true;
      progress: string[];
    }
  | NextComparison;

const parentIdx = (idx: number) => Math.floor((idx - 1) / 2);
const childIndices = (idx: number): [number, number] => [
  2 * idx + 1,
  2 * idx + 2,
];

export function initCache(): Graph {
  return {};
}

export function updatedCache(
  cache: Graph,
  { greater, smaller }: { greater: string; smaller: string }
): Graph {
  return transitiveReduction(withEdge(cache, greater, smaller));
}

function getCachedLessThan(
  cache: Graph,
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

function swap<T>(arr: T[], a: number, b: number) {
  [arr[a], arr[b]] = [arr[b], arr[a]];
}

export function heapsort(
  cache: Graph,
  items: readonly string[]
): GetComparisonResult {
  // Create a random heap
  let heap = [...items];

  // Heapify
  const heapifyResult = heapify(cache, items);
  if (!heapifyResult.done) {
    return { ...heapifyResult, sorted: [] };
  }
  heap = heapifyResult.progress;

  // Pop the top off until there's nothing left
  let sorted: string[] = [];

  while (heap.length > 0) {
    swap(heap, 0, heap.length - 1);
    sorted.push(heap.pop() as string);
    const downShiftResult = downHeap(cache, heap, 0);
    if (!downShiftResult.done) {
      return { ...downShiftResult, progress: heap, sorted };
    }
    heap = downShiftResult.progress;
  }

  return { done: true, sorted, progress: heap };
}

export function heapify(
  cache: Graph,
  items: readonly string[]
): IntermediateResult {
  let heap = [...items];

  for (let idx = parentIdx(heap.length - 1); idx >= 0; idx--) {
    const result = downHeap(cache, heap, idx);
    if (!result.done) return result;
    heap = result.progress;
  }

  return { done: true, progress: heap };
}

function downHeap(
  cache: Graph,
  inHeap: readonly string[],
  start: number
): IntermediateResult {
  let heap = [...inHeap];

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

    if (swapWith === root) {
      return { done: true, progress: heap };
    }

    swap(heap, root, swapWith);
    root = swapWith;

    [leftChild, rightChild] = childIndices(root);
  }
  return { done: true, progress: heap };
}
