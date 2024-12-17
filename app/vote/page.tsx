import { Brand } from "@/components/Brand";
import { Header } from "@/components/layout";
import React, { Suspense } from "react";
import { Vote } from "./vote";

export default async function Page() {
  return (
    <>
      <Header>
        <Brand />
      </Header>
      <Suspense>
        <Vote />
      </Suspense>
    </>
  );
}
