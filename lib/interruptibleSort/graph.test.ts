import {
  Graph,
  maxFamilialConnections,
  sumFamilialConnections,
  transitiveReduction,
  withRemovedNode,
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
