import { tournamentSort } from "./interruptibleTournamentSort";
import { cacheWithUpdate } from "./sortCache";

describe("tournamentSort", () => {
  test("sorts a small array", () => {
    let cache = {};
    const items = ["3", "4", "1", "2"];

    expect(tournamentSort(cache, items)).toEqual({
      comparison: { a: "1", b: "2" },
      done: false,
      incompleteSorted: [],
      notSorted: ["3", "4", "1", "2"],
      sorted: [],
    });

    cache = cacheWithUpdate(cache, { larger: "2", smaller: "1" });
    expect(tournamentSort(cache, items)).toEqual({
      comparison: { a: "3", b: "4" },
      done: false,
      incompleteSorted: ["2", "1"],
      notSorted: ["3", "4"],
      sorted: [],
    });

    cache = cacheWithUpdate(cache, { larger: "4", smaller: "3" });
    expect(tournamentSort(cache, items)).toEqual({
      comparison: { a: "2", b: "4" },
      done: false,
      incompleteSorted: ["2", "1", "4", "3"],
      notSorted: [],
      sorted: [],
    });

    cache = cacheWithUpdate(cache, { larger: "4", smaller: "2" });
    expect(tournamentSort(cache, items)).toEqual({
      comparison: { a: "3", b: "2" },
      done: false,
      incompleteSorted: ["2", "1", "3"],
      notSorted: [],
      sorted: ["4"],
    });

    cache = cacheWithUpdate(cache, { larger: "3", smaller: "2" });
    expect(tournamentSort(cache, items)).toEqual({
      comparison: null,
      done: true,
      incompleteSorted: [],
      notSorted: [],
      sorted: ["4", "3", "2", "1"],
    });
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

    let result = tournamentSort(cache, data);
    let steps = 0;
    while (!result.done) {
      steps += 1;
      const { a, b } = result.comparison;
      const [greater, smaller] =
        parseInt(a, 10) > parseInt(b, 10) ? [a, b] : [b, a];

      cache = cacheWithUpdate(cache, { larger: greater, smaller });
      result = tournamentSort(cache, data);

      if (result.sorted.length === 1) {
        expect([13, 14]).toContain(steps);
      }
      if (result.sorted.length === 2) {
        expect([15, 22, 23, 24, 25, 26, 27]).toContain(steps);
      }
    }

    expect(steps).toEqual(31);

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

    let result = tournamentSort(cache, data);
    let steps = 0;
    while (!result.done) {
      steps += 1;
      const { a, b } = result.comparison;
      const [greater, smaller] =
        parseInt(a, 10) > parseInt(b, 10) ? [a, b] : [b, a];

      cache = cacheWithUpdate(cache, { larger: greater, smaller });
      result = tournamentSort(cache, data);
    }

    expect(steps).toEqual(8);

    expect(result.sorted).toEqual(["10", "9", "8", "7", "6", "5"]);
  });
});
