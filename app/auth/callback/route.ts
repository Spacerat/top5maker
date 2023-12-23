import { routeClient } from "@/utils/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const client = routeClient();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    await client.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/account", req.url));
}
