import {
  Graph,
  maxFamilialConnections,
  sumFamilialConnections,
  transitiveReduction,
  withRemovedNode,
  findTopNodesWithGroups,
} from "./graph";

describe("transitiveReduction", () => {
  test("reduces a simple graph", () => {
    const g: Graph = {
      a: ["b", "c", "d", "e"],
      b: ["d"],
      c: ["d", "e"],
      d: ["e"],
    };
    const result = transitiveReduction(g);

    expect(result).toEqual({ a: ["b", "c"], b: ["d"], c: ["d"], d: ["e"] });
  });
});

describe("withRemoveNode", () => {
  test("reconnects parent connected nodes", () => {
    const g: Graph = {
      a: ["b"],
      b: ["c"],
      c: ["d"],
      d: ["e"],
    };
    const result = withRemovedNode(g, "b");

    expect(result).toEqual({ a: ["c"], c: ["d"], d: ["e"] });
  });
});

describe("familial connections", () => {
  test("empty graph is zero", () => {
    const result = sumFamilialConnections({});
    expect(result).toEqual(0);
  });
  test("no connections is zero", () => {
    const g: Graph = { a: [], b: [], c: [] };
    const result = sumFamilialConnections(g);
    expect(result).toEqual(0);
  });
  test("complete sort", () => {
    const g: Graph = { a: ["b"], b: ["c"] };
    const result = sumFamilialConnections(g);
    expect(result).toEqual(6);
  });
  test("incomplete sort", () => {
    const g: Graph = { a: ["b", "c"] };
    const result = sumFamilialConnections(g);
    expect(result).toEqual(4);
  });
  test("diamond", () => {
    const g: Graph = { a: ["b", "c"], b: ["d"], c: ["d"] };
    const result = sumFamilialConnections(g);
    expect(result).toEqual(10);
  });

  test("max familial connections", () => {
    expect(maxFamilialConnections(3)).toEqual(6);
    expect(maxFamilialConnections(0)).toBeCloseTo(0);
  });
});

describe("findTopNodesWithGroups", () => {
  test("groups independent chains into separate groups", () => {
    // Graph: two independent chains: a -> b and c -> d
    const graph: Graph = {
      a: ["b"],
      b: [],
      c: ["d"],
      d: [],
    };

    const groups = findTopNodesWithGroups(graph);
    expect(groups.length).toBe(2);

    // Normalize groups: sort by root name for consistency.
    const sortedGroups = groups.sort((g1, g2) =>
      g1.root.localeCompare(g2.root)
    );

    expect(new Set(sortedGroups[0].connected)).toEqual(new Set(["a", "b"]));
    expect(new Set(sortedGroups[1].connected)).toEqual(new Set(["c", "d"]));
  });

  test("chains are correctly grouped in a linear graph", () => {
    // Graph: a -> b -> c -> d
    const graph: Graph = {
      a: ["b"],
      b: ["c"],
      c: ["d"],
      d: [],
    };

    const groups = findTopNodesWithGroups(graph);
    expect(groups.length).toBe(1);
    expect(new Set(groups[0].connected)).toEqual(new Set(["a", "b", "c", "d"]));
    expect(groups[0].root).toBe("a");
  });

  test("handles diamond shaped graphs", () => {
    // Graph:
    //      a
    //     / \
    //    b   c
    //     \ /
    //      d
    const graph: Graph = {
      a: ["b", "c"],
      b: ["d"],
      c: ["d"],
      d: [],
    };

    const groups = findTopNodesWithGroups(graph);
    // Only one connected component expected.
    expect(groups.length).toBe(1);
    expect(new Set(groups[0].connected)).toEqual(new Set(["a", "b", "c", "d"]));
    expect(groups[0].root).toBe("a");
  });

  test("handles graph with isolated nodes", () => {
    // Graph: isolated nodes: a, b, and edge chain c -> d
    const graph: Graph = {
      a: [],
      b: [],
      c: ["d"],
      d: [],
    };

    const groups = findTopNodesWithGroups(graph);
    // Expect three groups: {a}, {b}, and {c, d}
    expect(groups.length).toBe(3);

    const roots = groups.map((group) => group.root);
    expect(new Set(roots)).toEqual(new Set(["a", "b", "c"]));

    // Verify connected groups
    const groupForC = groups.find((g) => g.root === "c");
    expect(groupForC).toBeDefined();
    expect(new Set(groupForC!.connected)).toEqual(new Set(["c", "d"]));
  });
});
