"use server";

import { serverClient } from "@/utils/client";
import { checkPostgresError } from "@/utils/errors";
import { encodeId } from "@/utils/ids";
import { revalidatePath } from "next/cache";

export async function newList() {
  const client = serverClient();
  const { data, error } = await client
    .from("List")
    .insert({ name: "New List" })
    .select()
    .single();

  checkPostgresError(data, error);

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

  checkPostgresError(data, error);
  revalidatePath(`/lists/${encodeId(listId)}`);

  return data;
}

export async function removeListItem(listId: string, id: string) {
  const client = serverClient();

  const { data, error } = await client
    .from("ListItem")
    .delete()
    .eq("list_item_id", id)
    .select("name, list_item_id, idempotencyKey")
    .single();

  checkPostgresError(data, error);

  revalidatePath(`/lists/${encodeId(listId)}`);

  return data.list_item_id;
}
