import { heapify, heapSort } from "./interruptibleHeapsort";
import { cacheWithUpdate } from "./sortCache";

describe("heapify", () => {
  test("builds a small heap", () => {
    let cache = {};
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "4", b: "2" },
      done: false,
      heap: ["3", "4", "1", "2"],
    });
    cache = cacheWithUpdate(cache, { larger: "4", smaller: "2" });
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "4" },
      done: false,
      heap: ["3", "4", "1", "2"],
    });
    cache = cacheWithUpdate(cache, { larger: "4", smaller: "3" });
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "4", b: "1" },
      done: false,
      heap: ["3", "4", "1", "2"],
    });
    cache = cacheWithUpdate(cache, { larger: "4", smaller: "1" });
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "2" },
      done: false,
      heap: ["4", "3", "1", "2"],
    });
    cache = cacheWithUpdate(cache, { larger: "3", smaller: "2" });
    expect(heapify(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: null,
      done: true,
      heap: ["4", "3", "1", "2"],
    });
  });
});

describe("heapsort", () => {
  test("sorts a small array", () => {
    let cache = {};

    expect(heapSort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "4", b: "2" },
      done: false,
      incompleteSorted: [],
      notSorted: ["3", "4", "1", "2"],
      sorted: [],
    });
    cache = cacheWithUpdate(cache, { larger: "4", smaller: "2" });
    expect(heapSort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "4" },
      done: false,
      incompleteSorted: ["4", "2"],
      notSorted: ["3", "1"],
      sorted: [],
    });
    cache = cacheWithUpdate(cache, { larger: "4", smaller: "3" });
    expect(heapSort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "4", b: "1" },
      done: false,
      incompleteSorted: ["4", "2", "3"],
      notSorted: ["1"],
      sorted: [],
    });
    cache = cacheWithUpdate(cache, { larger: "4", smaller: "1" });
    expect(heapSort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "2" },
      done: false,
      incompleteSorted: ["1", "2", "3"],
      notSorted: [],
      sorted: ["4"],
    });
    cache = cacheWithUpdate(cache, { larger: "3", smaller: "2" });
    expect(heapSort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "3", b: "1" },
      done: false,
      incompleteSorted: ["1", "3", "2"],
      notSorted: [],
      sorted: ["4"],
    });
    cache = cacheWithUpdate(cache, { larger: "3", smaller: "1" });
    expect(heapSort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: { a: "1", b: "2" },
      done: false,
      incompleteSorted: ["1", "2"],
      notSorted: [],
      sorted: ["4", "3"],
    });
    cache = cacheWithUpdate(cache, { larger: "2", smaller: "1" });
    expect(heapSort(cache, ["3", "4", "1", "2"])).toEqual({
      comparison: null,
      done: true,
      incompleteSorted: [],
      notSorted: [],
      sorted: ["4", "3", "2", "1"],
    });
    expect(cache).toEqual({ "2": ["1"], "3": ["2"], "4": ["3"] });
  });

  test("sorts a large array", () => {
    const data = [
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
    let cache = {};

    let result = heapSort(cache, data);
    let steps = 0;
    while (!result.done) {
      steps += 1;
      const { a, b } = result.comparison;
      const [greater, smaller] =
        parseInt(a, 10) > parseInt(b, 10) ? [a, b] : [b, a];

      cache = cacheWithUpdate(cache, { larger: greater, smaller });
      result = heapSort(cache, data);

      if (result.sorted.length === 1) {
        expect([16, 17, 18, 19, 20]).toContain(steps);
      }
      if (result.sorted.length === 2) {
        expect([21, 22, 23, 24, 25, 26, 27]).toContain(steps);
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
    const data = ["10", "9", "8", "7", "6", "5"];

    let cache = {};

    let result = heapSort(cache, data);
    let steps = 0;
    while (!result.done) {
      steps += 1;
      const { a, b } = result.comparison;
      const [greater, smaller] =
        parseInt(a, 10) > parseInt(b, 10) ? [a, b] : [b, a];

      cache = cacheWithUpdate(cache, { larger: greater, smaller });
      result = heapSort(cache, data);
    }

    // TODO: Could we do better in the pre-sorted case?
    expect(steps).toEqual(11);

    expect(result.sorted).toEqual(["10", "9", "8", "7", "6", "5"]);
  });
});
