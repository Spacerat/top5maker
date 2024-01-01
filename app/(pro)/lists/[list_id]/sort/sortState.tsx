import { SortCache, cacheWithUpdate, heapSort } from "@/lib/interruptibleSort";

type Item = {
  name: string;
  list_item_id: string;
};

type Decision = {
  greater_item_id: string;
  lesser_item_id: string;
};

type DoneResult = { done: true; comparison: null };
type IncompleteResult = { done: false; comparison: { a: Item; b: Item } };

export type SortResult = {
  sorted: Item[];
  incompleteSorted: Item[];
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

  if (sortStatus.done) {
    return {
      sorted,
      incompleteSorted,
      done: sortStatus.done,
      comparison: null,
    };
  }
  return {
    sorted,
    incompleteSorted,
    done: sortStatus.done,
    comparison: {
      a: itemMap.get(sortStatus.comparison.a)!,
      b: itemMap.get(sortStatus.comparison.b)!,
    },
  };
}
