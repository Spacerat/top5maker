import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";
import { cacheWithUpdate, heapSort, SortCache } from "../lib/interruptibleSort";
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

export function useSortState() {
  const { query, isReady, replace } = useRouter();

  const [history, setHistory] = useState<QueryState[]>(() => [
    query as QueryState,
  ]);

  const itemsData = query[itemsQueryKey];
  const cacheData = query[cacheQueryKey];

  // Decode the current list of items to sort from the URL

  const items = useMemo(() => deserializeItems(itemsData), [itemsData]);

  // Redirect to the home page if the list of items was empty or invalid

  useEffect(() => {
    if (items.length === 0) {
      replace("/");
    }
  }, [items, replace]);

  // Decode the current state of known sort-order from the URL

  const cache = useMemo(
    () => deserializeCache(items, cacheData),
    [items, cacheData]
  );

  // Sort the items (using the cache) to find out what comparison is needed next

  const status = useMemo(() => heapSort(cache, items), [cache, items]);

  // Actions

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
  }, [cache, items, replace, status]);

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
