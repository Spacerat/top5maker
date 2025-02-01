export type Comparison = {
  /** An item to compare */
  a: string;
  /** An item to compare */
  b: string;
};

export type NextComparison = {
  /** Indicates that more comparisons are needed */
  done: false;

  /** The next two values which need to be compared  */
  comparison: Comparison;
};

export type IncompleteSortState = {
  /** The current sort-order of the unsorted items */
  incompleteSorted: string[];
  notSorted: string[];
};

export type SortItemsState = IncompleteSortState & {
  /** The sorted items, if any */
  sorted: string[];
};

export type InProgressSortStatus = NextComparison & SortItemsState;
export type DoneSortStatus = { done: true; comparison: null } & SortItemsState;
export type SortStatus = InProgressSortStatus | DoneSortStatus;

export type CacheResult =
  | {
      /** True when the values were found in the cache */
      done: true;
      /** True when 'a' < 'b' */
      lessThan: boolean;
    }
  | NextComparison;
