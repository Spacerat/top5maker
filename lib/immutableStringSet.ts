export function stringSetAdd(items: readonly string[], item: string) {
  if (items.includes(item) || item.length === 0) return items;
  return [...items, item];
}

export function stringSetRemove(items: readonly string[], item: string) {
  if (!items.includes(item)) return items;
  return items.filter((x) => x !== item);
}
