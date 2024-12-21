import { isSafeBase64, safe64decode, safe64encode } from "@/lib/base64";
import { Graph } from "@/lib/interruptibleSort/graph";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

type Data = string | string[] | undefined;

const DEFAULT_TYPE = "old";
type SerializationType = "compressed" | "old";

function isString(t: unknown): t is string {
  return typeof t === "string";
}

export function serializeItemsOld(items: readonly string[]): string {
  return safe64encode(JSON.stringify(items));
}

export function serializeItemsCompressed(items: readonly string[]): string {
  return compressToEncodedURIComponent(JSON.stringify(items));
}

export function serializeItems(
  items: readonly string[],
  type: SerializationType = DEFAULT_TYPE
): string {
  if (type === "old") {
    return serializeItemsOld(items);
  } else {
    return serializeItemsCompressed(items);
  }
}

function writeCacheRepr(items: readonly string[], cache: Graph): string {
  const indexMap = new Map(
    items.map((item, index) => [item, String.fromCharCode(index + 65)])
  );
  return Object.entries(cache)
    .map(
      ([k, v]) =>
        `${indexMap.get(k) || ""}${v
          .map((c) => indexMap.get(c) || "")
          .join("")}`
    )
    .join(",");
}

export function serializeCacheOld(items: readonly string[], cache: Graph) {
  const compressedCache = writeCacheRepr(items, cache);
  return safe64encode(compressedCache);
}

export function serializeCacheCompressed(
  items: readonly string[],
  cache: Graph
) {
  const compressedCache = writeCacheRepr(items, cache);
  return compressToEncodedURIComponent(compressedCache);
}

export function serializeCache(
  items: readonly string[],
  cache: Graph,
  type: SerializationType = DEFAULT_TYPE
): string {
  if (type === "old") {
    return serializeCacheOld(items, cache);
  } else {
    return serializeCacheCompressed(items, cache);
  }
}

function readCacheRepr(items: readonly string[], decoded: string): Graph {
  const nameMap = new Map(
    items.map((item, index) => [String.fromCharCode(index + 65), item])
  );

  console.log({ decoded, nameMap });

  return Object.fromEntries(
    (decoded ?? "")
      .split(",")
      .map((s) => [
        nameMap.get(s[0]) || "",
        s
          .slice(1)
          .split("")
          .map((n) => nameMap.get(n) || ""),
      ])
      .filter((entry) => entry[0].length > 0)
  );
}

export function deserializeCacheOld(
  items: readonly string[],
  data: Data
): Graph {
  if (!isSafeBase64(data)) {
    return {};
  }
  const decoded = safe64decode(data);
  return readCacheRepr(items, decoded);
}

export function deserializeCacheCompressed(
  items: readonly string[],
  data: Data
): Graph {
  if (!isSafeBase64(data)) {
    return {};
  }
  const decoded = decompressFromEncodedURIComponent(data);
  return readCacheRepr(items, decoded);
}

export function deserializeCache(
  items: readonly string[],
  data: Data,
  type: SerializationType = DEFAULT_TYPE
): Graph {
  if (type === "old") {
    return deserializeCacheOld(items, data);
  } else {
    return deserializeCacheCompressed(items, data);
  }
}

export function deserializeItemsOld(data: Data) {
  if (!isSafeBase64(data)) {
    return [];
  }
  let result: unknown;
  try {
    result = JSON.parse(safe64decode(data));
  } catch {
    return [];
  }

  if (Array.isArray(result) && result.every(isString)) {
    return result;
  }

  return [];
}

export function deserializeItemsCompressed(data: Data) {
  if (!isSafeBase64(data)) {
    return [];
  }
  let result: unknown;
  try {
    result = JSON.parse(decompressFromEncodedURIComponent(data));
  } catch {
    return [];
  }

  if (Array.isArray(result) && result.every(isString)) {
    return result;
  }

  return [];
}

export function deserializeItems(
  data: Data,
  type: SerializationType = DEFAULT_TYPE
) {
  if (type === "old") {
    return deserializeItemsOld(data);
  } else {
    return deserializeItemsCompressed(data);
  }
}
