"use client";

import { TextArea } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { FormEventHandler, KeyboardEventHandler, useState } from "react";
import { deserializeItems, deserializeCache } from "@/sortState/serialization";
import { itemsQueryKey, cacheQueryKey } from "@/sortState/config";
import { heapSort } from "@/lib/interruptibleSort";
import styles from "@/components/FormLine.module.css";
import { useMetaKey } from "./useMetaKey";

export function VoteInput({
  onReceiveRanking,
}: {
  onReceiveRanking?: (ranking: string[]) => void;
}) {
  const [value, setValue] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const text = value.trim();
    const textArea = e.currentTarget.querySelector("textarea");
    if (!textArea) {
      return;
    }

    const pattern = /(.+\n.*|.*i=.*&c=.*)/;

    if (!pattern.test(text)) {
      textArea.setCustomValidity("Invalid input format");
      e.currentTarget.reportValidity();
      return;
    }

    if (text) {
      if (text.includes("\n")) {
        const ranking = text
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
        onReceiveRanking?.(ranking);
        textArea.setCustomValidity("");
      } else if (text.includes(itemsQueryKey)) {
        try {
          const url = new URL(text);
          const items = url.searchParams.get(itemsQueryKey);
          const cache = url.searchParams.get(cacheQueryKey);
          if (items && cache) {
            const deserializedItems = deserializeItems(items);
            const deserializedCache = deserializeCache(
              deserializedItems,
              cache
            );
            const { sorted, done } = heapSort(
              deserializedCache,
              deserializedItems
            );

            if (done) {
              onReceiveRanking?.(sorted);
              textArea.setCustomValidity("");
              return;
            } else {
              textArea.setCustomValidity("Incomplete SortStar ranking");
              e.currentTarget.reportValidity();
            }
          }
        } catch {
          textArea.setCustomValidity("Invalid SortStar URL");
          e.currentTarget.reportValidity();
        }
      } else {
        textArea.setCustomValidity("Invalid input format");
        e.currentTarget.reportValidity();
      }
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      (e.target as HTMLTextAreaElement).form?.requestSubmit();
    }
  };

  const metaKey = useMetaKey();

  return (
    <form onSubmit={onSubmit} className={styles.formline}>
      <TextArea
        placeholder="Paste completed SortStar URL, or list of sorted items"
        className="min-h-11"
        value={value}
        rows={1}
        onChange={(e) => {
          setValue(e.target.value);
          e.target.setCustomValidity("");
        }}
        onKeyDown={onKeyDown}
        required
      />
      <Button type="submit" className="flex flex-col">
        <div>Submit</div>
        <small className="opacity-80">
          {metaKey ? `(${metaKey} + Enter)` : <>&nbsp;</>}
        </small>
      </Button>
    </form>
  );
}
