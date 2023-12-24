"use client";

import { Button } from "@/components/Button";
import { Page } from "@/components/layout";
import { H1, H2 } from "@/components/text";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Page slim>
      <H2>:(</H2>
      <H1>An error occurred</H1>
      <Button onClick={reset}>Try again</Button>
    </Page>
  );
}
