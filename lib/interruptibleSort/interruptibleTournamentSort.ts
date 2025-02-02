import { SortCache } from "@/lib/interruptibleSort/sortCache";
import {
  DoneSortStatus,
  SortStatus,
} from "@/lib/interruptibleSort/interruptibleSort";
import { bestSorts } from "./bestSorts";
import { findTopNodesWithGroups } from "./graph";
import { heapSort } from "./interruptibleHeapsort";

function done(items: string[]): DoneSortStatus {
  return {
    done: true,
    sorted: items,
    incompleteSorted: [],
    notSorted: [],
    comparison: null,
  };
}

export function tournamentSort(
  cache: SortCache,
  items: readonly string[]
): SortStatus {
  const { sorted, incompleteSorted, notSorted } = bestSorts(cache, items);

  // Return immediately if we're already done
  if (sorted.length === items.length) {
    return done(sorted);
  }

  // Otherwise we need to choose a comparison...

  // 1. Find all connected subgraphs, and their roots (usually the largest item)
  const groups = findTopNodesWithGroups(cache, [
    ...incompleteSorted,
    ...notSorted,
  ]).sort((a, b) => a.connected.length - b.connected.length);

  if (groups.length < 2) {
    // HACK: fall back to heapsort for now, until we're 100% confident this can't happen!
    console.error("this should never happen");
    return heapSort(cache, items);
  }

  const [smaller, larger] = [groups[0], groups[1]];

  if (larger.connected.length > 2 * smaller.connected.length) {
    // HACK?: fall back to heapsort if there's a large discrepancy between group sizes.
    //
    // Without this, the 'tournament sort' method ends up doing an insertion sort when you add
    // new items at the end of sorting.
    //
    // I think I can probably come up with something more elegant that's integrated into the
    // tournament method. For example, instead of comparing the top elements of groups, compare
    // the top of the smallest group to the middle of the next group's fully sorted elements.
    //
    // See the heapsort file for more details.
    return heapSort(cache, items);
  }

  // 2. The roots of the two smallest groups are the next comparison
  return {
    done: false,
    comparison: { a: smaller.root, b: larger.root },
    sorted,
    incompleteSorted,
    notSorted,
  };
}
