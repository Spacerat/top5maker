import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Database } from "./types/supabase";

const protectedPaths = ["/account", "/list"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Calling this also makes sure that the session stays refreshed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login when trying to access protected pages
  if (
    !user &&
    protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}
