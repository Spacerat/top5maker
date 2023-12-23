import short from "short-uuid";
const translator = short();

export const encodeId = (id: string) => translator.fromUUID(id);
export const decodeId = (id: string) => translator.toUUID(id);
