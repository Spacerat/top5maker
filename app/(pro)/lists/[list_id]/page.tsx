import { Page } from "@/components/layout";
import { H1 } from "@/components/text";
import { serverClient } from "@/utils/client";
import { checkDecodeId } from "@/utils/ids";
import { checkPostgresError } from "@/utils/errors";
import { ListBuilder } from "./ListBuilder";

type ListParams = {
  params: { list_id?: string };
};

export default async function List({ params: { list_id } }: ListParams) {
  const listId = checkDecodeId(list_id);

  const client = serverClient();

  const { data, error } = await client
    .from("List")
    .select("name, ListItem ( name, list_item_id, idempotencyKey )")
    .eq("list_id", listId)
    .single();

  checkPostgresError(data, error);

  return (
    <Page kind="main">
      <H1>{data.name}</H1>
      <ListBuilder listId={listId} items={data.ListItem} />
    </Page>
  );
}
