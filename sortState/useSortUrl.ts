import React from "react";
import { itemsQueryKeyOld } from "./config";
import { serializeItems } from "./serialization";

/** Generate a sort-page URL for a list of items */
export function makeSortUrl(items: readonly string[]) {
  return {
    query:
      items && items.length > 0
        ? { [itemsQueryKeyOld]: serializeItems(items) }
        : {},
    pathname: "/sort",
  };
}

/** Use a dynamically generate a sort-page URL for a list of items in a React component */
export function useSortUrl(items: readonly string[]) {
  return React.useMemo(() => makeSortUrl(items), [items]);
}
