import { routeClient } from "@/utils/client";
import { type NextRequest, NextResponse } from "next/server";

async function signout(req: NextRequest) {
  const supabase = routeClient();

  // Check if we have a session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/pro", req.url), {
    status: 302,
  });
}

export async function POST(req: NextRequest) {
  return signout(req);
}

export async function GET(req: NextRequest) {
  return signout(req);
}
