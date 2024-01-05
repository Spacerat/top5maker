"use server";

import { serverClient } from "@/utils/client";
import { checkAndAssertData } from "@/utils/errors";

export type Decision = {
  decision_id: string;
  created_at: string;
  greater_item: { name: string; list_item_id: string };
  lesser_item: { name: string; list_item_id: string };
};

export async function getDecisions(sort_id: string) {
  const client = serverClient();

  const { data, error } = await client
    .from("Decision")
    .select(
      `
      decision_id,
      created_at,
      greater_item:greater_item_id(name, list_item_id),
      lesser_item:lesser_item_id(name, list_item_id)
      `
    )
    .eq("sort_id", sort_id)
    .returns<Decision[]>();
  checkAndAssertData(data, error);
  return data;
}

export async function getListAndsort(listId: string) {
  const client = serverClient();
  const { data: list, error: listError } = await client
    .from("List")
    .select(
      `name,
      ListItem ( name, list_item_id, deleted_at ),
      Sort ( sort_id )
      `
    )
    .eq("list_id", listId)
    .limit(1, { referencedTable: "Sort" })
    .single();

  checkAndAssertData(list, listError);

  if (list.Sort.length != 1) {
    throw new Error("Expected exactly one Sort");
  }

  const sort = list.Sort[0];

  return { list, sort };
}
