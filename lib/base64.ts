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
  return encode64toSafe(base64encode(toBinary(data)));
}
/** Decode a string from URL-safe base64 */
export function safe64decode(data: string) {
  return fromBinary(base64decode(decode64fromSafe(data)));
}

/** Return true if the object is a URL-safe base64 string */
export function isSafeBase64(data: unknown): data is string {
  return typeof data === "string" && !!isUrlSafeBase64(data);
}

// From: https://developer.mozilla.org/en-US/docs/Web/API/btoa
function toBinary(string: string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  const charCodes = new Uint8Array(codeUnits.buffer);
  let result = "";
  for (let i = 0; i < charCodes.byteLength; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

// From: https://developer.mozilla.org/en-US/docs/Web/API/btoa
function fromBinary(binary: string) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const charCodes = new Uint16Array(bytes.buffer);
  let result = "";
  for (let i = 0; i < charCodes.length; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}
