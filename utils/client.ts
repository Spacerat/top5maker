import { Database } from "@/types/supabase";
import {
  createRouteHandlerClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function serverClient() {
  return createServerComponentClient<Database>({ cookies });
}

export function routeClient() {
  return createRouteHandlerClient<Database>({ cookies });
}
