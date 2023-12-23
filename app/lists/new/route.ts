import { routeClient } from "@/utils/client";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const client = routeClient();

  const result = await client
    .from("List")
    .insert({ name: "" })
    .select()
    .single();

  if (result.data?.list_id) {
    return NextResponse.redirect(
      new URL(`/list/${result.data?.list_id}`, req.url)
    );
  } else {
    // return error code
    // in correct NextJS way
    return NextResponse.error();
  }
}
