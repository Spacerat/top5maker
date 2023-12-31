"use server";

import { serverClient } from "@/utils/client";
import { checkAndAssertData, checkPostgresError } from "@/utils/errors";
import { encodeId } from "@/utils/ids";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function newList() {
  const client = serverClient();
  const { data, error } = await client
    .from("List")
    .insert({ name: "New List" })
    .select()
    .single();

  checkAndAssertData(data, error);

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

export async function removeListItem(listId: string, listItemId: string) {
  const client = serverClient();

  const { data, error } = await client
    .from("ListItem")
    .delete()
    .eq("list_item_id", listItemId)
    .select("name, list_item_id, idempotencyKey")
    .single();

  checkPostgresError(error);

  revalidatePath(`/lists/${encodeId(listId)}`);

  return data?.list_item_id;
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
