import { Graph, transitiveReduction, withRemovedNode } from "./graph";

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
