import Link from "next/link";
import React from "react";
import { useSortUrl } from "../app/useSortUrl";
import { AddForm } from "../components/AddItemInput";
import { Brand, TagLine } from "../components/Brand";
import { FullMobileButton } from "../components/Button";
import { Header, Main, Page } from "../components/layout";
import { ItemList } from "../components/List";
import { H3 } from "../components/text";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";

function SetupItems() {
  // TODO: proper app state management
  const [items, setItems] = React.useState<readonly string[]>([]);

  const addItem = React.useCallback((name: string) => {
    setItems((curItems) => stringSetAdd(curItems, name));
  }, []);

  const removeItem = (name: string) => {
    setItems((curItems) => stringSetRemove(curItems, name));
  };

  const sortUrl = useSortUrl(items);

  return (
    <>
      <H3>Add three or more items to get started</H3>
      <ItemList items={items} onRemove={removeItem} />
      <AddForm onAddItem={addItem} />
      <Link passHref href={sortUrl}>
        <FullMobileButton disabled={items.length < 3}>
          Start Sorting
        </FullMobileButton>
      </Link>
    </>
  );
}

export default function Home() {
  return (
    <Main>
      <Header>
        <Brand />
        <TagLine />
      </Header>
      <Page>
        <SetupItems />
      </Page>
    </Main>
  );
}
