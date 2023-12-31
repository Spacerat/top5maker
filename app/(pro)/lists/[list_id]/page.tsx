import { Page } from "@/components/layout";
import { serverClient } from "@/utils/client";
import { checkDecodeId } from "@/utils/ids";
import { checkAndAssertData } from "@/utils/errors";
import { ListBuilder } from "./ListBuilder";
import { DeleteListButton } from "./DeleteListButton";
import { ListName } from "./ListName";

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

  checkAndAssertData(data, error);

  return (
    <Page kind="main">
      <div className="justify-between flex flex-row">
        <ListName listId={listId} name={data.name} />
        <DeleteListButton listId={listId} />
      </div>
      <ListBuilder listId={listId} items={data.ListItem} />
    </Page>
  );
}
