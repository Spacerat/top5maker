import { SortCache, cacheWithUpdate, heapSort } from "@/lib/interruptibleSort";

export type Item = {
  name: string;
  list_item_id: string;
};

type Decision = {
  greater_item_id: string;
  lesser_item_id: string;
  decision_id: string;
};

export type Comparison = { a: Item; b: Item };
type DoneResult = { done: true; comparison: null };
type IncompleteResult = { done: false; comparison: Comparison };

export type SortResult = {
  sorted: Item[];
  incompleteSorted: Item[];
  lastDecision: { id: string; greater: Item; lesser: Item } | null;
} & (DoneResult | IncompleteResult);

export function getSort(items: Item[], decision: Decision[]): SortResult {
  // Sort using item IDs

  let cache: SortCache = {};
  for (const { greater_item_id, lesser_item_id } of decision) {
    // TODO: this is slow but probably not a huge deal for now
    cache = cacheWithUpdate(cache, {
      larger: greater_item_id,
      smaller: lesser_item_id,
    });
  }

  const allItemIds = items.map((items) => items.list_item_id);
  const sortStatus = heapSort(cache, allItemIds);

  // Create a map from item ID to item

  const itemMap = new Map(items.map((item) => [item.list_item_id, item]));

  // Map back to named items

  const sorted = sortStatus.sorted.map((id) => itemMap.get(id)!);
  const incompleteSorted = sortStatus.incompleteSorted.map(
    (id) => itemMap.get(id)!
  );

  const lastDecisionIds = decision[decision.length - 1];
  const lastDecision = lastDecisionIds
    ? {
        id: lastDecisionIds.decision_id,
        greater: itemMap.get(lastDecisionIds.greater_item_id)!,
        lesser: itemMap.get(lastDecisionIds.lesser_item_id)!,
      }
    : null;

  if (sortStatus.done) {
    return {
      sorted,
      incompleteSorted,
      lastDecision,
      done: sortStatus.done,
      comparison: null,
    };
  }
  return {
    sorted,
    incompleteSorted,
    lastDecision,
    done: sortStatus.done,
    comparison: {
      a: itemMap.get(sortStatus.comparison.a)!,
      b: itemMap.get(sortStatus.comparison.b)!,
    },
  };
}
