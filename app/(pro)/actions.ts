"use server";

import { serverClient } from "@/utils/client";
import { checkAndAssertData, checkPostgresError } from "@/utils/errors";
import { encodeId } from "@/utils/ids";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Action } from "./lists/[list_id]/sort/sortState";

export async function newList() {
  const client = serverClient();
  const { data, error } = await client
    .from("List")
    .insert({ name: "New List" })
    .select()
    .single();

  checkAndAssertData(data, error);

  const { data: sortData, error: sortError } = await client
    .from("Sort")
    .insert({ list_id: data.list_id })
    .select()
    .single();

  checkAndAssertData(sortData, sortError);
  return data.list_id;
}

export type ListItem = {
  list_item_id: string;
  idempotencyKey: string | null;
  name: string;
  loading?: boolean;
};

export async function addListItems(
  listId: string,
  items: { name: string; idempotencyKey: string }[]
): Promise<ListItem[]> {
  const client = serverClient();

  const { data, error } = await client
    .from("ListItem")
    .insert(items.map((item) => ({ ...item, list_id: listId })))
    .select();

  checkAndAssertData(data, error);
  revalidatePath(`/lists/${encodeId(listId)}`);

  return data;
}

export async function updateListName(
  listId: string,
  name: string
): Promise<string> {
  const client = serverClient();

  const { data, error } = await client
    .from("List")
    .update({ name })
    .eq("list_id", listId)
    .select("name")
    .single();

  checkAndAssertData(data, error);
  revalidatePath(`/lists/${encodeId(listId)}`);

  return data.name;
}

export async function deleteListItem(listId: string, listItemId: string) {
  const client = serverClient();

  const { data, error } = await client
    .from("ListItem")
    .update({ deleted_at: "now()" })
    .eq("list_item_id", listItemId)
    .select("list_item_id")
    .single();

  checkAndAssertData(data, error);

  revalidatePath(`/lists/${encodeId(listId)}`);

  return data.list_item_id;
}

export async function undeleteListItem(listId: string, listItemId: string) {
  const client = serverClient();

  const { error } = await client
    .from("ListItem")
    .update({ deleted_at: null })
    .eq("list_item_id", listItemId);

  checkPostgresError(error);

  revalidatePath(`/lists/${encodeId(listId)}`);
}

export async function removeList(listId: string) {
  const client = serverClient();

  const { data, error } = await client
    .from("List")
    .delete()
    .eq("list_id", listId)
    .select("list_id")
    .maybeSingle();

  console.log({ data, error });

  checkPostgresError(error);

  revalidatePath(`/lists/${encodeId(listId)}`);

  redirect("/lists");

  return data?.list_id;
}

export async function newDecision(
  list_id: string,
  sort_id: string,
  greater_item_id: string,
  lesser_item_id: string
) {
  const client = serverClient();
  const { data, error } = await client
    .from("Decision")
    .insert({ sort_id, greater_item_id, lesser_item_id })
    .select()
    .single();

  checkAndAssertData(data, error);

  // TODO: for now, assume sort/list are 1:1
  revalidatePath(`/lists/${encodeId(list_id)}`);

  return data;
}

export async function deleteDecision(list_id: string, decision_id: string) {
  const client = serverClient();
  const { error } = await client
    .from("Decision")
    .delete()
    .eq("decision_id", decision_id)
    .select("decision_id")
    .single();

  revalidatePath(`/lists/${encodeId(list_id)}`);
  revalidatePath(`/lists/${encodeId(list_id)}/sort`);

  checkPostgresError(error);
}

export async function undo(list_id: string, action: Action) {
  if (action.type === "decision") {
    await deleteDecision(list_id, action.decision.decision_id);
  } else if (action.type === "delete") {
    await undeleteListItem(list_id, action.item.list_item_id);
  }
}

export async function resetListItem(list_id: string, item_id: string) {
  const client = serverClient();

  // TODO: delete using a single OR condition
  // for some reason .or didn't work for me.
  const { error: errorGreater } = await client
    .from("Decision")
    .delete()
    .eq("greater_item_id", item_id)
    .select("decision_id");

  checkPostgresError(errorGreater);

  const { error: errorLesser } = await client
    .from("Decision")
    .delete()
    .eq("lesser_item_id", item_id)
    .select("decision_id");

  checkPostgresError(errorLesser);

  revalidatePath(`/lists/${encodeId(list_id)}`);
  revalidatePath(`/lists/${encodeId(list_id)}/sort`);
}
