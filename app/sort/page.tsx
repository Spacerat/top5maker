import { Brand } from "@/components/Brand";
import { Header, Main } from "@/components/layout";
import React, { Suspense } from "react";
import { Sorter } from "./sort";

export default async function Sort() {
  return (
    <Main>
      <Header>
        <Brand />
      </Header>
      <Suspense>
        <Sorter />
      </Suspense>
    </Main>
  );
}
