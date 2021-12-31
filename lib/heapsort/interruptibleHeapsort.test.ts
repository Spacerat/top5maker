import {
  heapify,
  initCache,
  updatedCache,
  heapsort,
} from "./interruptibleHeapsort";

describe("heapify", () => {
  test("builds a small heap", () => {
    let cache = initCache();
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "4", b: "2" },
      done: false,
      progress: ["3", "4", "1", "2"],
    });
    cache = updatedCache(cache, { greater: "4", smaller: "2" });
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "4" },
      done: false,
      progress: ["3", "4", "1", "2"],
    });
    cache = updatedCache(cache, { greater: "4", smaller: "3" });
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "4", b: "1" },
      done: false,
      progress: ["3", "4", "1", "2"],
    });
    cache = updatedCache(cache, { greater: "4", smaller: "1" });
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "2" },
      done: false,
      progress: ["4", "3", "1", "2"],
    });
    cache = updatedCache(cache, { greater: "3", smaller: "2" });
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      done: true,
      progress: ["4", "3", "1", "2"],
    });
  });
});

describe("heapsort", () => {
  test("sorts a small array", () => {
    let cache = initCache();
    expect(heapsort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "4", b: "2" },
      done: false,
      sorted: [],
      progress: ["3", "4", "1", "2"],
    });
    cache = updatedCache(cache, { greater: "4", smaller: "2" });
    expect(heapsort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "4" },
      done: false,
      progress: ["3", "4", "1", "2"],
      sorted: [],
    });
    cache = updatedCache(cache, { greater: "4", smaller: "3" });
    expect(heapsort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "4", b: "1" },
      done: false,
      progress: ["3", "4", "1", "2"],
      sorted: [],
    });
    cache = updatedCache(cache, { greater: "4", smaller: "1" });
    expect(heapsort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "2" },
      done: false,
      progress: ["4", "3", "1", "2"],
      sorted: [],
    });
    cache = updatedCache(cache, { greater: "3", smaller: "2" });
    expect(heapsort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "1" },
      done: false,
      progress: ["2", "3", "1"],
      sorted: ["4"],
    });
    cache = updatedCache(cache, { greater: "3", smaller: "1" });
    expect(heapsort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "1", b: "2" },
      done: false,
      progress: ["1", "2"],
      sorted: ["4", "3"],
    });
    cache = updatedCache(cache, { greater: "2", smaller: "1" });
    expect(heapsort(cache, ["3", "4", "1", "2"])).toEqual({
      done: true,
      progress: [],
      sorted: ["4", "3", "2", "1"],
    });
    expect(cache).toEqual({ "2": ["1"], "3": ["2"], "4": ["3"] });
  });

  test("sorts a large array", () => {
    let data = [
      "1",
      "10",
      "7",
      "11",
      "2",
      "3",
      "4",
      "19",
      "8",
      "9",
      "12",
      "5",
      "6",
      "13",
    ];
    let cache = initCache();

    let result = heapsort(cache, data);
    let steps = 0;
    while (!result.done) {
      steps += 1;
      const { a, b } = result.comparison;
      const [greater, smaller] =
        parseInt(a, 10) > parseInt(b, 10) ? [a, b] : [b, a];

      cache = updatedCache(cache, { greater, smaller });
      result = heapsort(cache, data);

      if (result.sorted.length === 1) {
        expect([19, 20, 21]).toContain(steps);
      }
      if (result.sorted.length === 2) {
        expect([22, 23, 24, 25, 26, 27]).toContain(steps);
      }
    }

    expect(steps).toEqual(45);

    // The cache has been transitively reduced
    expect(cache).toEqual({
      "10": ["9"],
      "11": ["10"],
      "12": ["11"],
      "13": ["12"],
      "19": ["13"],
      "2": ["1"],
      "3": ["2"],
      "4": ["3"],
      "5": ["4"],
      "6": ["5"],
      "7": ["6"],
      "8": ["7"],
      "9": ["8"],
    });

    expect(result.sorted).toEqual([
      "19",
      "13",
      "12",
      "11",
      "10",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
      "1",
    ]);
  });

  test("sorts a sorted array", () => {
    let data = ["10", "9", "8", "7", "6", "5"];

    let cache = initCache();

    let result = heapsort(cache, data);
    let steps = 0;
    while (!result.done) {
      steps += 1;
      const { a, b } = result.comparison;
      const [greater, smaller] =
        parseInt(a, 10) > parseInt(b, 10) ? [a, b] : [b, a];

      cache = updatedCache(cache, { greater, smaller });
      result = heapsort(cache, data);
    }

    // TODO: Could we do better in the pre-sorted case?
    expect(steps).toEqual(11);

    expect(result.sorted).toEqual(["10", "9", "8", "7", "6", "5"]);
  });
});
