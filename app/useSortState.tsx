import { produce } from "immer";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { stringSetRemove, stringSetUnion } from "../lib/immutableStringSet";
import {
  cacheWithUpdate,
  heapSort,
  SortCache,
  SortStatus,
} from "../lib/interruptibleSort";
import {
  Graph,
  maxFamilialConnections,
  sumFamilialConnections,
  withRemovedNode,
} from "../lib/interruptibleSort/graph";
import { cacheQueryKey, itemsQueryKey, MAX_ITEMS } from "./config";
import {
  deserializeCache,
  deserializeItems,
  serializeCache,
  serializeItems,
} from "./serialization";
import { useSortUrl } from "./useSortUrl";

function getSortedness(cache: Graph, maxItems: number) {
  // TODO: think a bit more than this
  // The number of familial connections os O(N*2)
  // Whereas the the number of comparisons needed is O(N log N)
  // Therefore, this should rescale the metric to be linear in number of comaprisons...
  // ... I think?

  const scale = (n: number) => Math.sqrt(n); // * Math.log2(n);
  return (
    scale(sumFamilialConnections(cache)) /
    scale(maxFamilialConnections(maxItems))
  );
}

type QueryState = { [cacheQueryKey]: string; [itemsQueryKey]: string };

type StateUpdate = { newCache?: SortCache; newItems?: readonly string[] };

type SortState = {
  query: QueryState;
  items: string[];
  cache: SortCache;
  status: SortStatus;
  hydrated: boolean;
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

const initialState = (query: QueryState): SortState => {
  const items = deserializeItems(sanitize(query[itemsQueryKey]));
  return {
    query: sanitizeQuery(query),
    items,
    cache: {},
    status: heapSort({}, items),
    hydrated: false,
  };
};

function sanitizeQuery(query: ParsedUrlQuery): QueryState {
  return {
    [itemsQueryKey]: sanitize(query[itemsQueryKey]),
    [cacheQueryKey]: sanitize(query[cacheQueryKey]),
  };
}

/**
 * This hook wraps the core 'heapSort' function to manage the app's state,
 * keeping it in sync with the current URL.
 */
export function useSortState() {
  const { query, isReady, replace } = useRouter();

  const replaceQuery = React.useCallback(
    // Keep scroll position when updating app state in URL
    (query) => replace({ query }, undefined, { scroll: false }),
    [replace]
  );

  const [history, setHistory] = React.useState<QueryState[]>([]);

  const [{ cache, items, status, hydrated }, setSortState] =
    React.useState<SortState>(() => initialState(sanitizeQuery(query)));

  // Compute the current app state as a function of the query path and the previous state

  React.useEffect(() => {
    setSortState((currentState) => {
      if (!isReady) return currentState;
      // Set up the first history entry if needed
      if (currentState.hydrated == false) {
        setHistory((curr) =>
          curr.length === 0 ? [sanitizeQuery(query)] : curr
        );
      }
      return produce(currentState, (curr) => {
        // Deserialize the query parameters
        curr.hydrated = true;

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
      });
    });
  }, [query, isReady]);

  React.useEffect(() => {
    if (hydrated && items.length === 0) {
      replace("/");
    }
  }, [hydrated, items, replace]);

  // User interactions - these all act on the query path

  const { pick, addItems, removeItem, clearCache } = React.useMemo(() => {
    const setState = ({ newCache = cache, newItems = items }: StateUpdate) => {
      const newQuery = {
        [itemsQueryKey]: serializeItems(newItems),
        [cacheQueryKey]: serializeCache(newItems, newCache),
      };
      replaceQuery(newQuery);
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
      addItems(newItems: readonly string[]) {
        setState({ newItems: stringSetUnion(items, newItems, MAX_ITEMS) });
      },
      /** Called when the user removes an item while sorting */
      removeItem(item: string) {
        setState({
          newItems: stringSetRemove(items, item),
          newCache: withRemovedNode(cache, item),
        });
      },
      /** Called when the user resets an item while sorting */
      clearCache(item: string) {
        setState({
          newCache: withRemovedNode(cache, item),
        });
      },
    };
  }, [cache, items, status, replaceQuery]);

  /** Called when the user clicks the undo button */
  const undo = React.useCallback(() => {
    if (history.length > 1) {
      replaceQuery(history[history.length - 2]);
      setHistory((curr) => curr.slice(0, -1));
    }
  }, [history, replaceQuery]);

  return {
    progress: getSortedness(cache, items.length),
    status,
    isReady: hydrated,
    canUndo: history.length > 1,
    restartLink: useSortUrl(items),
    items,
    cache,
    undo,
    pick,
    addItems,
    removeItem: items.length > 3 ? removeItem : null,
    clearCache,
  };
}

export type SortAppState = ReturnType<typeof useSortState>;
