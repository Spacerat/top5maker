import { Database } from "@/types/supabase";
import {
  createRouteHandlerClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function serverClient() {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}

export function routeClient() {
  const cookieStore = cookies();
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore });
}
