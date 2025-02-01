import { SortCache } from "@/lib/interruptibleSort/sortCache";
import {
  DoneSortStatus,
  SortStatus,
} from "@/lib/interruptibleSort/interruptibleSort";
import { bestSorts } from "./bestSorts";
import { subgraphForNodes, findTopNodesWithGroups } from "./graph";

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

  // Return early if we're already done
  if (sorted.length === items.length) {
    return done(sorted);
  }

  // Otherwise we need to choose a comparison

  // First, create a subgraph of the items not fully sorted
  const sub = subgraphForNodes(cache, [...incompleteSorted, ...notSorted]);

  // Find all connected subgraphs, and their roots (largest items)
  const groups = findTopNodesWithGroups(sub).sort(
    (a, b) => a.connected.length - b.connected.length
  );

  if (groups.length < 2) {
    console.error("this should never happen");
    return done(sorted);
  }

  // 3. The roots of the two smallest groups are the next comparison
  return {
    done: false,
    comparison: { a: groups[0].root, b: groups[1].root },
    sorted,
    incompleteSorted,
    notSorted,
  };
}
