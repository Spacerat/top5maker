import { Page } from "@/components/layout";
import { serverClient } from "@/utils/client";
import { checkDecodeId } from "@/utils/ids";
import { checkAndAssertData } from "@/utils/errors";
import { ListBuilder } from "./ListBuilder";
import { DeleteListButton } from "./DeleteListButton";
import { ListName } from "./ListName";
import { FullMobileButton } from "@/components/Button";
import Link from "next/link";

type ListParams = {
  params: { list_id?: string };
};

export default async function List({ params: { list_id } }: ListParams) {
  const listId = checkDecodeId(list_id);

  const client = serverClient();

  const { data, error } = await client
    .from("List")
    .select("name, ListItem ( name, list_item_id, idempotencyKey )")
    .order("list_item_id", { ascending: true, referencedTable: "ListItem" })
    .eq("list_id", listId)
    .single();

  checkAndAssertData(data, error);

  return (
    <Page kind="main">
      <div className="justify-between flex flex-row items-center">
        <ListName listId={listId} name={data.name} />
        <DeleteListButton listId={listId} />
      </div>
      <ListBuilder listId={listId} items={data.ListItem} />
      <Link href={`/lists/${list_id}/sort`} className="contents">
        <FullMobileButton type="button">Start Sorting</FullMobileButton>
      </Link>
    </Page>
  );
}
