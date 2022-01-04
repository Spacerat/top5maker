import {
  decode as decode64fromSafe,
  encode as encode64toSafe,
  isUrlSafeBase64,
} from "url-safe-base64";
import { Graph } from "../lib/interruptibleSort/graph";

function isString(t: unknown): t is string {
  return typeof t === "string";
}

function safe64encode(data: string) {
  return encode64toSafe(btoa(data));
}

function safe64decode(data: string) {
  return atob(decode64fromSafe(data));
}

export function serializeItems(items: readonly string[]): string {
  return safe64encode(JSON.stringify(items));
}

export function serializeCache(items: readonly string[], cache: Graph) {
  const indexMap = new Map(
    items.map((item, index) => [item, String.fromCharCode(index + 65)])
  );
  const compressedCache = Object.entries(cache)
    .map(
      ([k, v]) =>
        `${indexMap.get(k) || ""}${v
          .map((c) => indexMap.get(c) || "")
          .join("")}`
    )
    .join(",");

  return safe64encode(compressedCache);
}

export function deserializeCache(
  items: readonly string[],
  data: string | string[] | undefined
): Graph {
  if (!isString(data) || !isUrlSafeBase64(data)) {
    return {};
  }
  const decoded = safe64decode(data);

  const nameMap = new Map(
    items.map((item, index) => [String.fromCharCode(index + 65), item])
  );

  const cache = Object.fromEntries(
    decoded.split(",").map((s) => [
      nameMap.get(s[0]) || "",
      s
        .slice(1)
        .split("")
        .map((n) => nameMap.get(n) || ""),
    ])
  );
  return cache;
}

export function deserializeItems(data: string | string[] | undefined) {
  if (!isString(data) || !isUrlSafeBase64(data)) {
    return [];
  }
  const result = JSON.parse(safe64decode(data));

  if (Array.isArray(result) && result.every(isString)) {
    return result;
  }

  return [];
}
