import { Header } from "@/components/layout";
import React, { Suspense } from "react";
import { TopNav } from "@/components/Nav";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header>
        <TopNav active="vote" className="p-4" />
      </Header>
      <Suspense>{children}</Suspense>
    </>
  );
}
