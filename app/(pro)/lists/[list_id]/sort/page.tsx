import { Page } from "@/components/layout";
import { H1, NoStyleLink } from "@/components/text";
import { checkDecodeId } from "@/utils/ids";
import { getSort } from "./sortState";
import { SortLayout } from "./SortLayout";
import { getDecisions, getListAndsort } from "../../../queries";

type ListParams = {
  params: { list_id?: string };
};

export default async function Sort({ params: { list_id } }: ListParams) {
  const listId = checkDecodeId(list_id);

  const { list, sort } = await getListAndsort(listId);

  const decisions = await getDecisions(sort.sort_id);

  const sortState = getSort(list.ListItem, decisions);

  return (
    <Page kind="main">
      <H1>
        Sorting{": "}
        <NoStyleLink href={`/lists/${list_id}`}>{list.name}</NoStyleLink>
      </H1>
      <SortLayout sortState={sortState} listId={listId} sortId={sort.sort_id} />
    </Page>
  );
}
