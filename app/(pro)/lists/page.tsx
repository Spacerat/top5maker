import { Card, CardGrid, Page } from "@/components/layout";
import { H1 } from "@/components/text";
import { serverClient } from "@/utils/client";
import { NewListButton } from "./NewListButton";
import Link from "next/link";
import { encodeId } from "@/utils/ids";
import { checkAndAssertData } from "@/utils/errors";

export const dynamic = "force-dynamic";

async function getLists() {
  return await serverClient()
    .from("List")
    .select("*, ListItem (name, list_item_id)")
    .is("ListItem.deleted_at", null)
    .order("created_at", { ascending: false })
    .order("list_item_id", { referencedTable: "ListItem", ascending: true })
    .limit(4, { referencedTable: "ListItem" });
}

export default async function Lists() {
  const { data, error } = await getLists();
  checkAndAssertData(data, error);

  return (
    <Page>
      <div className="flex flex-row gap-8">
        <H1>Your Lists</H1>
        <NewListButton />
      </div>
      <CardGrid>
        {data.map((list) => (
          <Card key={list.list_id} elevation="low">
            <Link href={`/lists/${encodeId(list.list_id)}`}>{list.name}</Link>
            <ul className="list-disc list-inside">
              {list.ListItem.slice(0, 3).map(({ name, list_item_id }) => (
                <li
                  key={list_item_id}
                  className="text-ellipsis text-nowrap overflow-hidden"
                >
                  {name}
                </li>
              ))}
              {list.ListItem.length > 3 && <li>...</li>}
            </ul>
          </Card>
        ))}
      </CardGrid>
    </Page>
  );
}
