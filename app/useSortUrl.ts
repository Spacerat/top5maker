import React from "react";
import { itemsQueryKey } from "./config";
import { serializeItems } from "./serialization";

export function useSortUrl(items: readonly string[]) {
  return React.useMemo(() => {
    return {
      query:
        items && items.length > 0
          ? { [itemsQueryKey]: serializeItems(items) }
          : {},
      pathname: "/sort",
    };
  }, [items]);
}
