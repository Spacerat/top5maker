import Link from "next/link";
import React from "react";
import { useSortUrl } from "../app/useSortUrl";
import { AddForm } from "../components/AddItemInput";
import { Brand, TagLine } from "../components/Brand";
import { FullMobileButton } from "../components/Button";
import { RemoveItemButton } from "../components/IconButtons";
import { Header, Main, Page, Paper } from "../components/layout";
import { ListItem } from "../components/List";
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
      {items.length > 0 && (
        <Paper>
          {items.map((item) => (
            <ListItem
              key={item}
              actions={<RemoveItemButton item={item} onClick={removeItem} />}
            >
              {item}
            </ListItem>
          ))}
        </Paper>
      )}
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
