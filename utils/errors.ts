import { PostgrestError } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export function checkPostgresError(error: PostgrestError | null) {
  if (error?.code === "PGRST116") {
    return notFound();
  }
  if (!!error) {
    throw new Error(`${error.code}: ${error.message}`);
  }
}

export function checkAndAssertData<T>(
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
