"use server";

import { serverClient } from "@/utils/client";

export async function newList() {
  const client = serverClient();
  const result = await client
    .from("List")
    .insert({ name: "New List" })
    .select()
    .single();
  return result.data?.list_id;
}
