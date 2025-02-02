import { Graph, inverse, isDescendant, connectedNodes } from "./graph";
import { SortCache } from "./sortCache";

/* Sort the items as best as possible using the information available in the sort cache */
function bestPossibleSort(
  cache: SortCache,
  items: readonly string[],
  invertedCache?: Graph
): { incompleteSorted: string[]; notSorted: string[] } {
  const inverted = invertedCache ?? inverse(cache);

  // Split 'unsorted' into items which have at least some information, and items with none
  const unsorted = new Set(items);
  const notSorted = new Set<string>();
  for (const item of unsorted) {
    if (!inverted[item]?.length && !cache[item]?.length) {
      notSorted.add(item);
      unsorted.delete(item);
    }
  }

  const incompleteSorted = Array.from(unsorted);
  incompleteSorted
    .sort((a, b) => (a > b ? 1 : -1))
    .sort((a, b) => {
      if (isDescendant(cache, { parent: a, target: b })) return -1;
      if (isDescendant(cache, { parent: b, target: a })) return 1;
      return 0;
    });
  return { incompleteSorted, notSorted: Array.from(notSorted) };
}
/** Return:
 * - One sorted array of items where the final sort position is known
 * - Another array of best-effort sorted items for which the sort information is complete
 */
export function bestSorts(cache: SortCache, items: readonly string[]) {
  // Check if the graph is fully connected.
  if (connectedNodes(cache, items[0]).length !== items.length) {
    // If it's not fully connected, then there are no items with complete information
    return { sorted: [], ...bestPossibleSort(cache, items) };
  }
  const inverted = inverse(cache);

  // FIXME: THIS IS PROBABLY BROKEN
  // Check if there is only one item with no parents
  const top = items.find((item) => !inverted[item]);

  const unsorted = new Set(items);

  // If there is, start with that item and go down for as long as it only has single children
  const results: string[] = [];
  if (top) {
    let item = top;
    results.push(item);
    unsorted.delete(item);
    while ((cache[item] ?? []).length === 1) {
      item = cache[item][0];
      results.push(item);
      unsorted.delete(item);
    }
  }

  return {
    sorted: results,
    ...bestPossibleSort(cache, Array.from(unsorted), inverted),
  };
}
