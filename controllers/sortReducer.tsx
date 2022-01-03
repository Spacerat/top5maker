import { castDraft, produce } from "immer";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";
import {
  cacheWithUpdate,
  heapsort,
  initCache,
  SortCache,
  SortStatus,
} from "../lib/interruptibleSort";
import { withRemovedNode } from "../lib/interruptibleSort/graph";
import { safeCompressJSON, safeDecompressJSON } from "../lib/safe64encode";

type State = {
  cache: SortCache;
  status: SortStatus;
  items: readonly string[];
};

export enum ActionTypes {
  UPDATE = "u",
  SET_ITEMS = "s",
  ADD_ITEM = "a",
  REMOVE_ITEM = "r",
  CLEAR_CACHE = "c",
}

type Action =
  | { type: ActionTypes.UPDATE; larger: "a" | "b" }
  | { type: ActionTypes.SET_ITEMS; items: readonly string[] }
  | { type: ActionTypes.ADD_ITEM; item: string }
  | { type: ActionTypes.REMOVE_ITEM; item: string }
  | { type: ActionTypes.CLEAR_CACHE; item: string };

export function init(): State {
  const cache = initCache();
  return {
    cache,
    status: heapsort(cache, []),
    items: [],
  };
}

function swapComparison(lastStatus: SortStatus, newStatus: SortStatus) {
  if (lastStatus.done || newStatus.done) {
    return newStatus;
  }
  if (
    lastStatus.comparison.a === newStatus.comparison.a ||
    lastStatus.comparison.b === newStatus.comparison.b
  ) {
    return produce(newStatus, (status) => {
      [status.comparison.a, status.comparison.b] = [
        status.comparison.b,
        status.comparison.a,
      ];
    });
  }
  return newStatus;
}

function isValidActionRecord(x: unknown): x is Action[] {
  // TODO: validate the actions properly
  return x !== undefined;
}

export function encodeInitial(items: readonly string[]) {
  return safeCompressJSON([{ type: ActionTypes.SET_ITEMS, items }]);
}

export function encodeRecord(record: readonly Action[]) {
  return safeCompressJSON(record);
}

export function decodeRecord(record: string | string[] | undefined) {
  if (!(typeof record === "string")) return [];
  return safeDecompressJSON(record, isValidActionRecord) ?? [];
}

export function reducer(state: State, action: Action): State {
  return produce(state, (s) => {
    const status = s.status;
    switch (action.type) {
      case ActionTypes.UPDATE:
        if (status.done) return;
        const { a, b } = status.comparison;
        const larger = action.larger === "a" ? a : b;
        const smaller = action.larger === "a" ? b : a;

        s.cache = cacheWithUpdate(s.cache, { larger, smaller });
        s.status = swapComparison(s.status, heapsort(s.cache, s.items));

        return;
      case ActionTypes.ADD_ITEM:
        s.items = castDraft(stringSetAdd(s.items, action.item));
        s.status = heapsort(s.cache, s.items);

        return;
      case ActionTypes.REMOVE_ITEM:
        s.items = castDraft(stringSetRemove(s.items, action.item));
        s.status = heapsort(s.cache, s.items);

        return;
      case ActionTypes.CLEAR_CACHE:
        s.cache = withRemovedNode(s.cache, action.item);
        s.status = heapsort(s.cache, s.items);

        return;
      case ActionTypes.SET_ITEMS:
        s.items = castDraft(action.items);
        s.status = heapsort(s.cache, s.items);
        return;
    }
  });
}
