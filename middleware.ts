import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Database } from "./types/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Calling this also makes sure that the session stays refreshed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if user is signed in and the current path is / redirect the user to /account
  // if (user && req.nextUrl.pathname === "/") {
  //   return NextResponse.redirect(new URL("/account", req.url));
  // }

  if (!user && req.nextUrl.pathname === "/account") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}
