import Head from "next/head";
import Link from "next/link";
import React from "react";
import { makeSortUrl, useSortUrl } from "../app/useSortUrl";
import { AddForm } from "../components/AddItemInput";
import { Brand, Footer, Illustration, TagLine } from "../components/Brand";
import { FullMobileButton } from "../components/Button";
import { Card, CardGrid, Header, Main, Page } from "../components/layout";
import { ItemList } from "../components/List";
import { H3 } from "../components/text";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";

// NOTE: There is a bug which causes exceptions when too many items are added,
// which results in the need for this limit. If the bug can be solved, perhaps
// the limit can be removed.
// https://github.com/Spacerat/top5maker/issues/3
//
// That being said, the UX for N=180 isn't great anyway - it takes a LONG time to sort so many items!
const MAX_ITEMS = 180;

function SetupItems() {
  const [items, setItems] = React.useState<readonly string[]>([]);

  const addItem = React.useCallback((name: string) => {
      setItems((curItems) => curItems.length <= MAX_ITEMS ? stringSetAdd(curItems, name) : curItems);
  }, []);

  const removeItem = (name: string) => {
    setItems((curItems) => stringSetRemove(curItems, name));
  };

  const sortUrl = useSortUrl(items);

  return (
    <>
      <ItemList items={items} onRemove={removeItem} />
      <AddForm onAddItem={addItem} keepInView disabled={items.length >= MAX_ITEMS} />
      <Link passHref href={sortUrl}>
        <FullMobileButton disabled={items.length < 3}>
          Start Sorting
        </FullMobileButton>
      </Link>
    </>
  );
}

function example(name: string, items: readonly string[]) {
  return { items, url: makeSortUrl(items), display: items.slice(0, 3), name };
}

type Example = ReturnType<typeof example>;

const powers = example("Super Powers", [
  "Invisibility",
  "Super Strength",
  "Time Travel",
  "Super Speed",
  "Telepathy",
  "X-Ray Vision",
  "Telekenisis",
]);

const business = example("Business Ideas", [
  "Design and sell t-shirts",
  "Open a fast food franchise",
  "Become a pet-sitter",
  "Sell homemade soap and candles",
  "Start a game streaming channel",
  "Create the next big social network",
]);

const foods = example("Fast Foods", [
  "Burgers",
  "Burritos",
  "Tacos",
  "Fries",
  "Kebabs",
  "Pizza",
  "Sandwiches",
  "Hot Dogs",
  "Poké",
  "Noodles",
]);

const names = example("Baby Names", [
  "Jessie",
  "Carter",
  "Tyler",
  "Ashley",
  "Jamie",
  "Skyler",
  "Charlie",
  "Trinity",
]);

function ExampleCard(example: Example) {
  return (
    <Card height="low">
      <Link href={example.url}>{example.name}</Link>, including:
      <ul>
        {example.display.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </Card>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Sort Star</title>
      </Head>
      <Main>
        <Header>
          <div>
            <Brand />
            <TagLine />
          </div>
          <Illustration />
        </Header>

        <Page>
          <H3>Add three or more items to get started</H3>
          You can add items one by one, or paste multiple lines
          <SetupItems />
        </Page>
        <Page kind="darker">
          <H3>Or try one of these examples</H3>
          <CardGrid>
            <ExampleCard {...foods} />
            <ExampleCard {...names} />
            <ExampleCard {...business} />
            <ExampleCard {...powers} />
          </CardGrid>
        </Page>

        <Footer />
      </Main>
    </>
  );
}
