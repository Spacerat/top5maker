import { Page } from "@/components/layout";
import { H1, NoStyleLink } from "@/components/text";
import { serverClient } from "@/utils/client";
import { checkAndAssertData } from "@/utils/errors";
import { checkDecodeId } from "@/utils/ids";
import { getSort } from "./sortState";
import { SortLayout } from "./SortLayout";

type ListParams = {
  params: { list_id?: string };
};

export default async function Sort({ params: { list_id } }: ListParams) {
  const listId = checkDecodeId(list_id);

  const client = serverClient();

  const { data: listData, error: listError } = await client
    .from("List")
    .select(
      `name,
      ListItem ( name, list_item_id ),
      Sort ( sort_id )
      `
    )
    .eq("list_id", listId)
    .limit(1, { referencedTable: "Sort" })
    .single();

  checkAndAssertData(listData, listError);

  if (listData.Sort.length != 1) {
    throw new Error("Expected exactly one Sort");
  }

  const sort = listData.Sort[0];

  const { data: decisionData, error: decisionError } = await client
    .from("Decision")
    .select("decision_id, greater_item_id, lesser_item_id")
    .eq("sort_id", sort.sort_id);
  checkAndAssertData(decisionData, decisionError);

  const sortState = getSort(listData.ListItem, decisionData);

  return (
    <Page kind="main">
      <H1>
        Sorting{": "}
        <NoStyleLink href={`/lists/${list_id}`}>{listData.name}</NoStyleLink>
      </H1>
      <SortLayout sortState={sortState} listId={listId} sortId={sort.sort_id} />
    </Page>
  );
}
