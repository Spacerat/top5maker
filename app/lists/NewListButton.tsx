"use client";

import { Button } from "@/components/Button";
import { newList } from "./actions";
import { useFormState } from "react-dom";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";

export function NewListButton() {
  const [state, action] = useFormState(newList, null);

  useEffect(() => {
    if (!!state) {
      redirect(`/lists/${state}`);
    }
  });
  return (
    <form className="contents" action={action}>
      <Button>+ New List</Button>
    </form>
  );
}
