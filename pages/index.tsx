import Link from "next/link";
import React from "react";
import { AddForm } from "../components/AddItemInput";
import { Brand, TagLine } from "../components/Brand";
import { FullMobileButton } from "../components/Button";
import { RemoveItemButton } from "../components/IconButtons";
import { Header, Main, Page, Paper } from "../components/layout";
import { ListItem } from "../components/List";
import { H3 } from "../components/text";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";
import { serializeItems } from "../lib/serialization";

function SetupItems() {
  // TODO: proper app state management
  const [items, setItems] = React.useState<readonly string[]>([]);

  const addItem = React.useCallback((name: string) => {
    setItems((curItems) => stringSetAdd(curItems, name));
  }, []);

  const removeItem = (name: string) => {
    setItems((curItems) => stringSetRemove(curItems, name));
  };

  const itemsUrl = React.useMemo(
    () => (items.length > 2 ? serializeItems(items) : ""),
    [items]
  );

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
      <Link passHref href={`/sort?items=${itemsUrl}`}>
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
