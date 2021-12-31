import {
  encode as encode64toSafe,
  decode as decode64fromSafe,
  isUrlSafeBase64,
} from "url-safe-base64";

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

export function deserializeItems(data: string) {
  if (!isUrlSafeBase64(data)) {
    return [];
  }
  const result = JSON.parse(safe64decode(data));

  if (Array.isArray(result) && result.every(isString)) {
    return result;
  }

  return [];
}
