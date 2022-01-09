import { produce } from "immer";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";
import {
  cacheWithUpdate,
  heapSort,
  SortCache,
  SortStatus,
} from "../lib/interruptibleSort";
import { withRemovedNode } from "../lib/interruptibleSort/graph";
import { cacheQueryKey, itemsQueryKey } from "./config";
import {
  deserializeCache,
  deserializeItems,
  serializeCache,
  serializeItems,
} from "./serialization";
import { useSortUrl } from "./useSortUrl";

type QueryState = { [cacheQueryKey]: string; [itemsQueryKey]: string };

type StateUpdate = { newCache?: SortCache; newItems?: readonly string[] };

type SortState = {
  query: QueryState;
  items: string[];
  cache: SortCache;
  status: SortStatus;
};

function sanitize(param: string | string[] | undefined) {
  return typeof param === "string" ? param : "";
}

/**
 * Swap the order of a comparison from the sorter if the same item appeared
 * in the same place twice. This improves the UX, by ensuring that the text
 * of the button you are looking at always changes when you press it.
 */
function swapComparisonIfNeeded(currStatus: SortStatus, newStatus: SortStatus) {
  if (
    !newStatus.done &&
    !currStatus.done &&
    (newStatus.comparison.a === currStatus.comparison.a ||
      newStatus.comparison.b === currStatus.comparison.b)
  ) {
    return {
      ...newStatus,
      comparison: { a: newStatus.comparison.b, b: newStatus.comparison.a },
    };
  }
  return newStatus;
}

const initialState: SortState = {
  query: { [cacheQueryKey]: "", [itemsQueryKey]: "" },
  items: [],
  cache: {},
  status: heapSort({}, []),
};

/**
 * This hook wraps the core 'heapSort' function to manage the app's state,
 * keeping it in sync with the current URL.
 */
export function useSortState() {
  const { query, isReady, replace } = useRouter();

  const [history, setHistory] = useState<QueryState[]>([query as QueryState]);

  const [{ cache, items, status }, setSortState] =
    useState<SortState>(initialState);

  // Compute the current app state as a function of the query path and the previous state

  useEffect(() => {
    setSortState((currentState) =>
      produce(currentState, (curr) => {
        // Deserialize the query parameters

        const queryItems = sanitize(query[itemsQueryKey]);
        const queryChanged = queryItems != curr.query?.[itemsQueryKey];
        if (queryChanged) {
          curr.query[itemsQueryKey] = queryItems;
          curr.items = deserializeItems(queryItems);
        }
        const queryCache = sanitize(query[cacheQueryKey]);
        const cacheChanged = queryCache != curr.query[itemsQueryKey];
        if (cacheChanged) {
          curr.query[itemsQueryKey] = queryCache;
          curr.cache = deserializeCache(curr.items, queryCache);
        }

        // Figure out what needs to be compared next

        if (queryChanged || cacheChanged) {
          const currStatus = curr.status;
          const newStatus = heapSort(curr.cache, curr.items);
          curr.status = swapComparisonIfNeeded(currStatus, newStatus);
        }
      })
    );
  }, [query]);

  // User interactions - these all act on the query path

  const { pick, addItem, removeItem, clearCache } = useMemo(() => {
    const setState = ({ newCache = cache, newItems = items }: StateUpdate) => {
      const newQuery = {
        [cacheQueryKey]: serializeCache(items, newCache),
        [itemsQueryKey]: serializeItems(newItems),
      };
      replace({ query: newQuery });
      setHistory((curr) => [...curr, newQuery]);
    };

    return {
      /** Called when the user clicks on the larger item */
      pick(larger: string) {
        if (status.done) return;
        const { a, b } = status.comparison;
        const smaller = larger === a ? b : a;
        setState({ newCache: cacheWithUpdate(cache, { larger, smaller }) });
      },
      /** Called when the user adds an item while sorting */
      addItem(item: string) {
        setState({ newItems: stringSetAdd(items, item) });
      },
      /** Called when the user removes an item while sorting */
      removeItem(item: string) {
        setState({
          newItems: stringSetRemove(items, item),
          // newCache: withRemovedNode(cache, item),
        });
      },
      /** Called when the user resets an item while sorting */
      clearCache(item: string) {
        setState({
          newCache: withRemovedNode(cache, item),
        });
      },
    };
  }, [cache, items, status, replace]);

  /** Called when the user clicks the undo button */
  const undo = useCallback(() => {
    if (history.length > 1) {
      replace({ query: history[history.length - 2] });
      setHistory((curr) => curr.slice(0, -1));
    }
  }, [history, replace]);

  return {
    status,
    isReady,
    canUndo: history.length > 1,
    restartLink: useSortUrl(items),
    undo,
    pick,
    addItem,
    removeItem,
    clearCache,
  };
}

export type SortAppState = ReturnType<typeof useSortState>;
