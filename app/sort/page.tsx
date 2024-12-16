import { Brand, Footer } from "@/components/Brand";
import { Header, Main } from "@/components/layout";
import React, { Suspense } from "react";
import { LoadingLayout, Sorter } from "./sort";

export default async function Sort() {
  return (
    <Main>
      <Header>
        <Brand />
      </Header>
      <Suspense fallback={<LoadingLayout />}>
        <Sorter />
      </Suspense>
      <Footer />
    </Main>
  );
}
