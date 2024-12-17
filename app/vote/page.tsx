import { Header } from "@/components/layout";
import React, { Suspense } from "react";
import { Vote } from "./vote";
import { TopNav } from "@/components/Nav";

export default async function Page() {
  return (
    <>
      <Header>
        <TopNav active="vote" />
      </Header>
      <Suspense>
        <Vote />
      </Suspense>
    </>
  );
}
