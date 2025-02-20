import { produce } from "immer";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React from "react";
import { stringSetRemove, stringSetUnion } from "@/lib/immutableStringSet";
import {
  cacheWithUpdate,
  interruptibleSort,
  SortCache,
  SortStatus,
} from "@/lib/interruptibleSort";
import { withRemovedNode } from "@/lib/interruptibleSort/graph";
import { cacheQueryKey, itemsQueryKey, MAX_ITEMS } from "./config";
import {
  deserializeCache,
  deserializeItems,
  serializeCache,
  serializeItems,
} from "./serialization";
import { useSortUrl } from "./useSortUrl";
import { getSortedness } from "@/lib/interruptibleSort/graph";

type QueryParams = {
  [itemsQueryKey]: string;
  [cacheQueryKey]: string;
};

type QueryState = { [cacheQueryKey]: string; [itemsQueryKey]: string };

type StateUpdate = { newCache?: SortCache; newItems?: readonly string[] };

type SortState = {
  query: QueryState;
  items: string[];
  cache: SortCache;
  status: SortStatus;
  hydrated: boolean;
};

function sanitize(param: unknown) {
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
    query: sanitizeQueryObject(query),
    items,
    cache: {},
    status: interruptibleSort({}, items),
    hydrated: false,
  };
};

function sanitizeQuery(query: ReadonlyURLSearchParams): QueryState {
  return {
    [itemsQueryKey]: sanitize(query.get(itemsQueryKey)),
    [cacheQueryKey]: sanitize(query.get(cacheQueryKey)),
  };
}

function sanitizeQueryObject(query: Record<string, unknown>): QueryState {
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
  const { replace } = useRouter();
  const query = useSearchParams();

  function replaceQuery(newQuery: QueryParams) {
    const queryString = new URLSearchParams(newQuery).toString();
    replace(`sort?${queryString}`, {
      // Keep scroll position when updating app state in URL
      scroll: false,
    });
  }

  const [history, setHistory] = React.useState<QueryState[]>([]);

  const [{ cache, items, status, hydrated }, setSortState] =
    React.useState<SortState>(() => initialState(sanitizeQuery(query)));

  // Compute the current app state as a function of the query path and the previous state

  React.useEffect(() => {
    setSortState((currentState) => {
      // Set up the first history entry if needed
      if (currentState.hydrated == false) {
        setHistory((curr) =>
          curr.length === 0 ? [sanitizeQuery(query)] : curr
        );
      }
      return produce(currentState, (curr) => {
        // Deserialize the query parameters
        curr.hydrated = true;

        const queryItems = sanitize(query.get(itemsQueryKey));
        const queryChanged = queryItems != curr.query?.[itemsQueryKey];
        if (queryChanged) {
          curr.query[itemsQueryKey] = queryItems;
          curr.items = deserializeItems(queryItems);
        }
        const queryCache = sanitize(query.get(cacheQueryKey));
        const cacheChanged = queryCache != curr.query[itemsQueryKey];
        if (cacheChanged) {
          curr.query[itemsQueryKey] = queryCache;
          curr.cache = deserializeCache(curr.items, queryCache);
        }

        // Figure out what needs to be compared next

        if (queryChanged || cacheChanged) {
          const currStatus = curr.status;
          const newStatus = interruptibleSort(curr.cache, curr.items);
          curr.status = swapComparisonIfNeeded(currStatus, newStatus);
        }
      });
    });
  }, [query]);

  React.useEffect(() => {
    if (hydrated && items.length === 0) {
      replace("/");
    }
  }, [hydrated, items, replace]);

  function setState({ newCache = cache, newItems = items }: StateUpdate) {
    const newQuery = {
      [itemsQueryKey]: serializeItems(newItems),
      [cacheQueryKey]: serializeCache(newItems, newCache),
    };
    replaceQuery(newQuery);
    setHistory((curr) => [...curr, newQuery]);
  }

  /** Called when the user clicks on the larger item */
  function pick(larger: string) {
    if (status.done) return;
    const { a, b } = status.comparison;
    const smaller = larger === a ? b : a;
    setState({ newCache: cacheWithUpdate(cache, { larger, smaller }) });
  }
  function insertBelow(item: string, insertingBelow: string) {
    if (item === insertingBelow) return;
    // NOTE: this is probably only valid for a fully sorted graph
    //       it was written with that usecase in mind specifically
    // NOTE: this is inefficient because each 'cacheWithUpdate'
    //       does another transitive reduction. Instead it could be done at the end.

    let newCache = withRemovedNode(cache, item);

    for (const child of newCache[insertingBelow] ?? []) {
      newCache = cacheWithUpdate(newCache, {
        larger: item,
        smaller: child,
      });
    }

    newCache = cacheWithUpdate(newCache, {
      larger: insertingBelow,
      smaller: item,
    });

    setState({ newCache });
  }
  /** Called when the user adds an item while sorting */
  function addItems(newItems: readonly string[]) {
    const updatedItems = stringSetUnion(items, newItems, MAX_ITEMS);
    if (updatedItems.length > items.length) {
      setState({ newItems: updatedItems });
    }
  }
  /** Called when the user removes an item while sorting */
  function removeItem(item: string) {
    setState({
      newItems: stringSetRemove(items, item),
      newCache: withRemovedNode(cache, item),
    });
  }
  /** Called when the user resets an item while sorting */
  function clearCache(item: string) {
    setState({
      newCache: withRemovedNode(cache, item),
    });
  }

  /** Called when the user clicks the undo button */
  function undo() {
    if (history.length > 1) {
      replaceQuery(history[history.length - 2]);
      setHistory((curr) => curr.slice(0, -1));
    }
  }

  return {
    progress: getSortedness(cache, items.length),
    status,
    isReady: hydrated,
    restartLink: useSortUrl(items),
    items,
    cache,
    undo: history.length > 1 ? undo : null,
    pick,
    addItems,
    insertBelow,
    removeItem: items.length > 3 ? removeItem : null,
    clearCache,
  };
}

export type SortAppState = ReturnType<typeof useSortState>;
