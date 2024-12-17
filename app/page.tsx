"use server";

import Link from "next/link";
import React from "react";
import { makeSortUrl } from "@/sortState/useSortUrl";
import { Brand, Footer, Illustration, TagLine } from "@/components/Brand";
import { Card, CardGrid, Header, Main, Page } from "@/components/layout";
import { H3 } from "@/components/text";
import { SetupItems } from "./SetupItems";

import styles from "./page.module.css";

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
    <Card elevation="low">
      <span>
        <Link href={example.url}>{example.name}</Link>, including:
        <ul className="list-disc list-inside">
          {example.display.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </span>
    </Card>
  );
}

export default async function Home() {
  return (
    <>
      <Header>
        <div className={styles.taglineContainer}>
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
    </>
  );
}
