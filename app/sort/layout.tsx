import { Footer } from "@/components/Brand";
import { Header } from "@/components/layout";
import React, { Suspense } from "react";
import { LoadingLayout } from "./sort";
import { TopNav } from "@/components/Nav";

export default async function Sort({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header>
        <TopNav active="sort" className="p-4" />
      </Header>
      <Suspense fallback={<LoadingLayout />}>{children}</Suspense>
      <Footer />
    </>
  );
}
