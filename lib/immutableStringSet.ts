export function stringSetAdd(items: readonly string[], item: string) {
  if (items.includes(item) || item.length === 0) return items;
  return [...items, item];
}

export function stringSetUnion(
  items: readonly string[],
  newItems: readonly string[],
  maxSize: number
) {
  const set = new Set(items);
  for (const item of newItems) {
    if (item.length === 0) {
      continue;
    }
    set.add(item);
    if (set.size >= maxSize) {
      break;
    }
  }
  return Array.from(set);
}

export function stringSetRemove(items: readonly string[], item: string) {
  if (!items.includes(item)) return items;
  return items.filter((x) => x !== item);
}
