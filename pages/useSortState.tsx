import { useRouter } from "next/router";
import React from "react";
import { cacheQueryKey, itemsQueryKey } from "../app/config";
import {
  deserializeCache,
  deserializeItems,
  serializeCache,
  serializeItems,
} from "../app/serialization";
import { useSortUrl } from "../app/useSortUrl";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";
import { cacheWithUpdate, heapSort, SortCache } from "../lib/interruptibleSort";
import { withRemovedNode } from "../lib/interruptibleSort/graph";

type QueryState = { [cacheQueryKey]: string; [itemsQueryKey]: string };

export function useSortState() {
  const { query, isReady, replace } = useRouter();
  const itemsData = query[itemsQueryKey];
  const cacheData = query[cacheQueryKey];

  const [history, setHistory] = React.useState<QueryState[]>([]);

  const items = React.useMemo(() => deserializeItems(itemsData), [itemsData]);

  const cache = React.useMemo(
    () => deserializeCache(items, cacheData),
    [items, cacheData]
  );

  const status = React.useMemo(() => heapSort(cache, items), [cache, items]);

  const setState = React.useCallback(
    ({
      newCache = cache,
      newItems = items,
    }: {
      newCache?: SortCache;
      newItems?: readonly string[];
    }) => {
      const newQuery = {
        [cacheQueryKey]: serializeCache(items, newCache),
        [itemsQueryKey]: serializeItems(newItems),
      };
      replace({ query: newQuery });
      setHistory((curr) => [...curr, newQuery]);
    },
    [cache, items, replace]
  );

  const pick = React.useCallback(
    (larger: string) => {
      if (status.done) return;
      const { a, b } = status.comparison;
      const smaller = larger === a ? b : a;
      setState({ newCache: cacheWithUpdate(cache, { larger, smaller }) });
    },
    [cache, setState, status]
  );

  const addItem = React.useCallback(
    (item: string) => {
      setState({ newItems: stringSetAdd(items, item) });
    },
    [setState, items]
  );

  const removeItem = React.useCallback(
    (item: string) => {
      setState({
        newItems: stringSetRemove(items, item),
        // newCache: withRemovedNode(cache, item),
      });
    },
    [setState, items]
  );

  const clearCache = React.useCallback(
    (item: string) => {
      setState({
        newCache: withRemovedNode(cache, item),
      });
    },
    [setState, cache]
  );

  const undo = React.useCallback(() => {
    if (history.length > 0) {
      setHistory((curr) => curr.slice(0, -1));
      replace({ query: history[history.length - 1] });
    }
  }, [history, replace]);

  const restartLink = useSortUrl(items);

  return {
    status,
    isReady,
    canUndo: history.length > 0,
    restartLink,
    undo,
    pick,
    addItem,
    removeItem,
    clearCache,
  };
}

export type SortAppState = ReturnType<typeof useSortState>;
