import { redirect } from "next/navigation";
import short from "short-uuid";
const translator = short();

export const encodeId = (id: string) => translator.fromUUID(id);
export const decodeId = (id: string) => translator.toUUID(id);

export function checkDecodeId(id: string | null | undefined): string {
  if (!id) {
    redirect("/lists");
  }
  return decodeId(id);
}
