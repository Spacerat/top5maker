"use client";

import { TextArea, TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { FormEventHandler, KeyboardEventHandler } from "react";
import { deserializeItems, deserializeCache } from "@/sortState/serialization";
import { itemsQueryKey, cacheQueryKey } from "@/sortState/config";
import { heapSort } from "@/lib/interruptibleSort";
import { useMetaKey } from "./useMetaKey";
import { twMerge } from "tailwind-merge";

const VoteNameInput = ({ className }: { className?: string }) => (
  <TextInput
    name="name"
    placeholder="Voter name (optional)"
    className={className}
  />
);

const VoteItemInput = ({ className }: { className?: string }) => {
  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      (e.target as HTMLTextAreaElement).form?.requestSubmit();
    }
  };

  return (
    <TextArea
      name="item"
      placeholder="Paste completed SortStar URL, or list of sorted items"
      className={className}
      onKeyDown={onKeyDown}
      required
      onChange={(e) => e.currentTarget.setCustomValidity("")}
    />
  );
};

const VoteSubmitButton = ({ className }: { className?: string }) => {
  const metaKey = useMetaKey();

  return (
    <Button type="submit" className={twMerge("flex flex-row gap-2", className)}>
      <div>Submit</div>
      <small className="opacity-80">
        {metaKey ? `(${metaKey} + Enter)` : <>&nbsp;</>}
      </small>
    </Button>
  );
};

interface VoteFormProps {
  onReceiveRanking?: (ranking: string[], name: string) => void;
  children?: React.ReactNode;
  className?: string;
}

function VoteForm({ onReceiveRanking, children, className }: VoteFormProps) {
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = (formData.get("item") as string).trim();
    const name = formData.get("name") as string;
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
        if (new Set(ranking).size !== ranking.length) {
          textArea.setCustomValidity("Duplicate items in ranking");
          e.currentTarget.reportValidity();
          return;
        }
        onReceiveRanking?.(ranking, name);
        textArea.setCustomValidity("");
        e.currentTarget.reset();
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
              onReceiveRanking?.(sorted, name);
              textArea.setCustomValidity("");
              e.currentTarget.reset();
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

  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
}

export function VoteInput({ className, ...formProps }: VoteFormProps) {
  return (
    <VoteForm
      {...formProps}
      className={twMerge(className, "flex flex-col flex-wrap gap-4")}
    >
      <div className="min-w-30">
        <VoteItemInput className="min-h-11 w-full" />
      </div>
      <div className="flex flex-row items-center gap-4 flex-wrap max-w-lg">
        <VoteNameInput className="min-w-30" />
        <VoteSubmitButton />
      </div>
    </VoteForm>
  );
}
