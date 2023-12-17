import type { MutableRefObject, RefCallback } from "react";

type RefType<T> = MutableRefObject<T> | RefCallback<T> | null;

export const shareRef =
  <T>(refA: RefType<T | null>, refB: RefType<T | null>): RefCallback<T> =>
  (instance) => {
    if (typeof refA === "function") {
      refA(instance);
    } else if (refA) {
      refA.current = instance;
    }
    if (typeof refB === "function") {
      refB(instance);
    } else if (refB) {
      refB.current = instance;
    }
  };
