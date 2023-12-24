"use client";

import { Button } from "@/components/Button";
import { newList } from "../actions";
import React from "react";
import { redirect } from "next/navigation";
import { encodeId } from "@/utils/ids";

export function NewListButton() {
  return (
    <form
      className="contents"
      action={async () => {
        const newId = await newList();
        redirect(`/lists/${encodeId(newId)}`);
      }}
    >
      <Button>+ New List</Button>
    </form>
  );
}
