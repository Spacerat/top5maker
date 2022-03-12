export const itemsQueryKey = "i";
export const cacheQueryKey = "c";

// NOTE: There is a bug which causes exceptions when too many items are added,
// which results in the need for this limit. If the bug can be solved, perhaps
// the limit can be removed.
// https://github.com/Spacerat/top5maker/issues/3
//
// That being said, the UX for N=180 isn't great anyway - it takes a LONG time to sort so many items!
export const MAX_ITEMS = 180;
