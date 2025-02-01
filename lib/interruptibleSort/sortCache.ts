import { Graph, isDescendant, transitiveReduction, withEdge } from "./graph";

export type SortCache = Graph;

/** Return the cache updated  */
export function cacheWithUpdate(
  cache: SortCache,
  { larger, smaller }: { larger: string; smaller: string }
): SortCache {
  if (larger === smaller) return cache;

  if (isDescendant(cache, { parent: larger, target: smaller })) {
    return cache;
  }
  return transitiveReduction(
    withEdge(cache, { parent: larger, child: smaller })
  );
}
