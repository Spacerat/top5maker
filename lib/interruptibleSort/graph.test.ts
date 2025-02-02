import {
  Graph,
  maxFamilialConnections,
  sumFamilialConnections,
  transitiveReduction,
  withRemovedNode,
  findTopNodesWithGroups,
  allDescendants,
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
  const items = ["a", "b", "c", "d"];
  test("groups independent chains into separate groups", () => {
    // Graph: two independent chains: a -> b and c -> d
    const graph: Graph = {
      a: ["b"],
      b: [],
      c: ["d"],
      d: [],
    };

    const groups = findTopNodesWithGroups(graph, items);
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

    const groups = findTopNodesWithGroups(graph, items);
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

    const groups = findTopNodesWithGroups(graph, items);
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

    const groups = findTopNodesWithGroups(graph, items);
    // Expect three groups: {a}, {b}, and {c, d}
    expect(groups.length).toBe(3);

    const roots = groups.map((group) => group.root);
    expect(new Set(roots)).toEqual(new Set(["a", "b", "c"]));

    // Verify connected groups
    const groupForC = groups.find((g) => g.root === "c");
    expect(groupForC).toBeDefined();
    expect(new Set(groupForC!.connected)).toEqual(new Set(["c", "d"]));
  });

  test("handles chain with different order input", () => {
    // Graph: b -> c -> d and an isolated a
    const graph: Graph = {
      b: ["c"],
      c: ["d"],
      d: [],
      a: [],
    };
    const groups = findTopNodesWithGroups(graph, ["b", "c", "d", "a"]);
    // Expect two groups: one rooted at b and one for isolated a.
    const groupForB = groups.find((g) => g.root === "b");
    expect(groupForB).toBeDefined();
    expect(new Set(groupForB!.connected)).toEqual(new Set(["b", "c", "d"]));
    const groupForA = groups.find((g) => g.root === "a");
    expect(groupForA).toBeDefined();
    expect(new Set(groupForA!.connected)).toEqual(new Set(["a"]));
  });
});

describe("allDescendants", () => {
  test("returns empty array when no children exist", () => {
    const graph: Graph = { a: [] };
    const descendants = allDescendants(graph, "a");
    expect(descendants).toEqual([]);
  });

  test("returns correct descendants for a linear chain", () => {
    // Graph: a -> b -> c -> d
    const graph: Graph = {
      a: ["b"],
      b: ["c"],
      c: ["d"],
      d: [],
    };
    const descendants = allDescendants(graph, "a");
    expect(new Set(descendants)).toEqual(new Set(["b", "c", "d"]));

    // Starting at "b"
    const descendantsB = allDescendants(graph, "b");
    expect(new Set(descendantsB)).toEqual(new Set(["c", "d"]));
    // Starting at "c"
    const descendantsC = allDescendants(graph, "c");
    expect(new Set(descendantsC)).toEqual(new Set(["d"]));
    // Starting at "d"
    const descendantsD = allDescendants(graph, "d");
    expect(descendantsD).toEqual([]);
  });

  test("returns correct descendants for a tree structure", () => {
    // Graph:
    //      a
    //     / \
    //    b   c
    //         \
    //          d
    const graph: Graph = {
      a: ["b", "c"],
      b: [],
      c: ["d"],
      d: [],
    };
    const descendants = allDescendants(graph, "a");
    expect(new Set(descendants)).toEqual(new Set(["b", "c", "d"]));

    // Starting at "b" (leaf)
    const descendantsB = allDescendants(graph, "b");
    expect(descendantsB).toEqual([]);
    // Starting at "c"
    const descendantsC = allDescendants(graph, "c");
    expect(new Set(descendantsC)).toEqual(new Set(["d"]));
    // Starting at "d" (leaf)
    const descendantsD = allDescendants(graph, "d");
    expect(descendantsD).toEqual([]);
  });

  test("handles diamond shaped graph", () => {
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
    const descendants = allDescendants(graph, "a");
    expect(new Set(descendants)).toEqual(new Set(["b", "c", "d"]));

    // Starting at "b"
    const descendantsB = allDescendants(graph, "b");
    expect(new Set(descendantsB)).toEqual(new Set(["d"]));
    // Starting at "c"
    const descendantsC = allDescendants(graph, "c");
    expect(new Set(descendantsC)).toEqual(new Set(["d"]));
    // Starting at "d"
    const descendantsD = allDescendants(graph, "d");
    expect(descendantsD).toEqual([]);
  });

  test("handles complex tree", () => {
    // Graph:
    //      a
    //     / \
    //    b   c
    //        /\
    //      e   d
    const graph: Graph = {
      a: ["b", "c"],
      b: [],
      c: ["e", "d"],
      e: [],
      d: [],
    };
    const descendantsOfA = allDescendants(graph, "a");
    expect(new Set(descendantsOfA)).toEqual(new Set(["b", "c", "e", "d"]));

    // Starting at "b"
    const descendantsB = allDescendants(graph, "b");
    expect(descendantsB).toEqual([]);
    // Starting at "c"
    const descendantsC = allDescendants(graph, "c");
    expect(new Set(descendantsC)).toEqual(new Set(["e", "d"]));
    // Starting at "e"
    const descendantsE = allDescendants(graph, "e");
    expect(descendantsE).toEqual([]);
    // Starting at "d"
    const descendantsD = allDescendants(graph, "d");
    expect(descendantsD).toEqual([]);
  });
});
