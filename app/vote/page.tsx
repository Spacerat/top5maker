import { Brand } from "@/components/Brand";
import { Header, Main } from "@/components/layout";
import React, { Suspense } from "react";
import { Vote } from "./vote";

export default async function Page() {
  return (
    <Main>
      <Header>
        <Brand />
      </Header>
      <Suspense>
        <Vote />
      </Suspense>
    </Main>
  );
}
