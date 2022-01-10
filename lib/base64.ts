/* eslint-disable @typescript-eslint/no-var-requires */
import {
  decode as decode64fromSafe,
  encode as encode64toSafe,
  isUrlSafeBase64,
} from "url-safe-base64";

/** Encode a string as base64 - supports nodeJS & browser */
const base64encode: (str: string) => string =
  typeof btoa === "undefined"
    ? (str: string) =>
        new (require("buffer").Buffer)(str, "binary").toString("base64")
    : btoa;

/** Decode a string from base64 - supports nodeJS & browser */
const base64decode: (str: string) => string =
  typeof atob === "undefined"
    ? (b64encoded: string) =>
        new (require("buffer").Buffer)(b64encoded, "base64").toString("binary")
    : atob;

/** Encode a string as URL-safe base64 */
export function safe64encode(data: string) {
  return encode64toSafe(base64encode(data));
}
/** Decode a string from URL-safe base64 */
export function safe64decode(data: string) {
  return base64decode(decode64fromSafe(data));
}

/** Return true if the object is a URL-safe base64 string */
export function isSafeBase64(data: unknown): data is string {
  return typeof data === "string" && !!isUrlSafeBase64(data);
}
