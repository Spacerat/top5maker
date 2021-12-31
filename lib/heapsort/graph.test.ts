import { Graph, transitiveReduction } from "./graph";

describe("transitiveReduction", () => {
  test("reduces a simple graph", () => {
    const g: Graph = {
      a: ["b", "c", "d", "e"],
      b: ["d"],
      c: ["d", "e"],
      d: ["e"],
    };
    const result = transitiveReduction(g);
    console.log(result);
    expect(result).toEqual({ a: ["b", "c"], b: ["d"], c: ["d"], d: ["e"] });
  });
});