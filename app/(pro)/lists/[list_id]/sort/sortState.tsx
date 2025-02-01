import { Decision } from "@/app/(pro)/queries";
import {
  SortCache,
  cacheWithUpdate,
  interruptibleSort,
} from "@/lib/interruptibleSort";
import { withRemovedNode } from "@/lib/interruptibleSort/graph";

export type Item = {
  name: string;
  list_item_id: string;
  deleted_at: string | null;
};

export type Action =
  | {
      type: "delete";
      time: string;
      item: Item;
    }
  | {
      type: "decision";
      time: string;
      decision: Decision;
    };

function isDeletedItem(item: Item): item is Item & { deleted_at: string } {
  return item.deleted_at !== null;
}

export type Comparison = { a: Item; b: Item };
type DoneResult = { done: true; comparison: null };
type IncompleteResult = { done: false; comparison: Comparison };

export type SortResult = {
  sorted: Item[];
  incompleteSorted: Item[];
  lastAction: Action | null;
} & (DoneResult | IncompleteResult);

export function getSort(items: Item[], decision: Decision[]): SortResult {
  const filtered = items.filter((item) => !isDeletedItem(item));

  const deleteActions: Action[] = items.filter(isDeletedItem).map((item) => ({
    type: "delete" as const,
    time: item.deleted_at,
    item,
  }));

  const decisionAction = decision.map((decision) => ({
    type: "decision" as const,
    time: decision.created_at,
    decision,
  }));

  const allActions = [...deleteActions, ...decisionAction].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  // Sort using item IDs

  let cache: SortCache = {};
  for (const action of allActions) {
    if (action.type === "delete") {
      cache = withRemovedNode(cache, action.item.list_item_id);
    } else if (action.type === "decision") {
      const { greater_item, lesser_item } = action.decision;
      cache = cacheWithUpdate(cache, {
        larger: greater_item.list_item_id,
        smaller: lesser_item.list_item_id,
      });
    }
  }

  const allItemIds = filtered.map((item) => item.list_item_id);
  const sortStatus = interruptibleSort(cache, allItemIds);

  // Create a map from item ID to item

  const itemMap = new Map(filtered.map((item) => [item.list_item_id, item]));

  // Map back to named items

  const sorted = sortStatus.sorted.map((id) => itemMap.get(id)!);

  const incompleteSorted = sortStatus.incompleteSorted.map(
    (id) => itemMap.get(id)!
  );

  const lastAction = allActions.at(-1) ?? null;

  if (sortStatus.done) {
    return {
      sorted,
      incompleteSorted,
      lastAction,
      done: sortStatus.done,
      comparison: null,
    };
  }
  return {
    sorted,
    incompleteSorted,
    done: sortStatus.done,
    lastAction,
    comparison: {
      a: itemMap.get(sortStatus.comparison.a)!,
      b: itemMap.get(sortStatus.comparison.b)!,
    },
  };
}
