"use client";
import { useState, useEffect } from "react";

export function useMetaKey() {
  const [metaKey, setMetaKey] = useState<string | null>(null);

  useEffect(() => {
    const isMac =
      typeof window !== "undefined"
        ? navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
        : false;
    setMetaKey(isMac ? "⌘" : "Ctrl");
  }, []);

  return metaKey;
}
