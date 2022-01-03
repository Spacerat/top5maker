import { compress, decompress } from "lzutf8";
import {
  decode as decode64fromSafe,
  encode as encode64toSafe,
  isUrlSafeBase64,
} from "url-safe-base64";

export function safeCompress(data: string) {
  return encode64toSafe(compress(data, { outputEncoding: "Base64" }));
}

export function safeCompressJSON(data: unknown) {
  return safeCompress(JSON.stringify(data));
}

export function safeDecompressJSON<T>(
  data: string,
  isValid: (obj: unknown) => obj is T
): T | null {
  if (!isUrlSafeBase64(data)) return null;
  const decompressed = decompress(decode64fromSafe(data), {
    inputEncoding: "Base64",
  });
  let obj: unknown;
  try {
    obj = JSON.parse(decompressed);
  } catch {
    return null;
  }
  if (isValid(obj)) {
    return obj;
  }
  return null;
}
