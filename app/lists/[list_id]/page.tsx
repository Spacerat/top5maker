import { Brand } from "@/components/Brand";
import { Header, Main, Page } from "@/components/layout";
import { H1 } from "@/components/text";
import { notFound } from "next/navigation";

import { serverClient } from "@/utils/client";
import { decodeId } from "@/utils/ids";

export default async function List({
  params: { list_id },
}: {
  params: { list_id?: string };
}) {
  const client = serverClient();
  if (!list_id) {
    notFound();
  }
  const list = await client
    .from("List")
    .select("*, ListItem (*)")
    .eq("list_id", decodeId(list_id) + "!")
    .single();

  return (
    <Main>
      <Header>
        <Brand />
      </Header>
      <Page kind="darker">
        <H1>{list.data?.name}</H1>
        <pre>{JSON.stringify(list, null, 2)}</pre>
      </Page>
    </Main>
  );
}
