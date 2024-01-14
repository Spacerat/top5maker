"use client";

import Link from "next/link";
import React from "react";
import { MAX_ITEMS } from "@/sortState/config";
import { useSortUrl } from "@/sortState/useSortUrl";
import { AddForm } from "@/components/AddItemInput";
import { FullMobileButton } from "@/components/Button";
import { ItemList } from "@/components/List";
import { stringSetRemove, stringSetUnion } from "@/lib/immutableStringSet";
import { ident } from "@/utils/ident";

export function SetupItems() {
  const [items, setItems] = React.useState<readonly string[]>([]);

  const addItems = (names: readonly string[]) => {
    setItems((curItems) => stringSetUnion(curItems, names, MAX_ITEMS));
  };

  const removeItem = (name: string) => {
    setItems((curItems) => stringSetRemove(curItems, name));
  };

  const sortUrl = useSortUrl(items);

  return (
    <>
      <ItemList
        items={items}
        onRemove={removeItem}
        getKey={ident}
        getName={ident}
      />
      <AddForm
        onAddItems={addItems}
        keepInView
        disabled={items.length >= MAX_ITEMS}
      />
      <Link passHref href={sortUrl} legacyBehavior>
        <FullMobileButton disabled={items.length < 3}>
          Start Sorting
        </FullMobileButton>
      </Link>
    </>
  );
}
