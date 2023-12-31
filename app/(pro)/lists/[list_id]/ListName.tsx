"use client";

import { H1 } from "@/components/text";
import { updateListName } from "../../actions";
import { useRef } from "react";
import { AutoGrowInput } from "@/components/AutoGrowInput";

export function ListName({ listId, name }: { listId: string; name: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const updateName = async (form: FormData) => {
    const newName = form.get("name") as string | null;
    if (newName) {
      await updateListName(listId, newName);
    }
  };

  return (
    <form action={updateName} className="overflow-hidden" ref={formRef}>
      <H1 className="overflow-hidden">
        <AutoGrowInput
          ref={inputRef}
          className="bg-transparent"
          onBlur={(e) => e.target.form?.requestSubmit()}
          defaultValue={name}
          name="name"
          data-1p-ignore
          maxLength={30}
        />
      </H1>
    </form>
  );
}
