"use server";

import Link from "next/link";
import React from "react";
import { makeSortUrl } from "@/sortState/useSortUrl";
import { Footer, Illustration, TagLine } from "@/components/Brand";
import {
  Card,
  CardGrid,
  Header,
  Page,
  TaglineContainer,
} from "@/components/layout";
import { H3 } from "@/components/text";
import { SetupItems } from "./SetupItems";

import { TopNav } from "@/components/Nav";

function example(name: string, items: readonly string[]) {
  return { items, url: makeSortUrl(items), display: items.slice(0, 3), name };
}

type Example = ReturnType<typeof example>;

const tasks = example("Project features", [
  "Sorting lists of items",
  "Social sharing links",
  "Cute redesign",
  "Dark mode",
  "Saved lists",
  "Ranked voting",
]);

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
        <Link href={example.url}>{example.name}</Link>:
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
        <TaglineContainer className="p-4">
          <TopNav active="sort" />
          <TagLine />
        </TaglineContainer>
        <Illustration />
      </Header>

      <Page>
        <p>
          If you can choose between two things, you can sort any list with Sort
          Star!
        </p>
        <SetupItems />
      </Page>
      <Page kind="darker">
        <H3>Or try one of these examples</H3>
        <CardGrid>
          <ExampleCard {...foods} />
          <ExampleCard {...names} />
          <ExampleCard {...business} />
          <ExampleCard {...powers} />
          <ExampleCard {...tasks} />
        </CardGrid>
      </Page>
      <Footer />
    </>
  );
}
