import { PostgrestError } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export function checkPostgresError<T>(
  data: T | null,
  error: PostgrestError | null
): asserts data {
  if (error?.code === "PGRST116") {
    return notFound();
  }
  if (!!error) {
    throw new Error(`${error.code}: ${error.message}`);
  }
  if (!data) {
    throw new Error("No data");
  }
}
