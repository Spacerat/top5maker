"use client";

import { Button } from "@/components/Button";
import DialogButton from "@/components/DialogButton";
import { Card } from "@/components/layout";
import { H3 } from "@/components/text";
import { removeList } from "../../actions";

export function DeleteListButton({ listId }: { listId: string }) {
  async function onDelete() {
    await removeList(listId);
  }
  return (
    <DialogButton
      button={"Delete"}
      variant="secondary"
      contents={({ close }) => (
        <Card elevation="high">
          <H3>Are you sure you want delete this list?</H3>
          <div className="flex flex-row justify-between">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button onClick={onDelete}>Delete list</Button>
          </div>
        </Card>
      )}
    />
  );
}
