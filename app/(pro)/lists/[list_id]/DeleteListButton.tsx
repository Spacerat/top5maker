"use client";

import { Button } from "@/components/Button";
import DialogButton from "@/components/DialogButton";
import { Card } from "@/components/layout";
import { H3 } from "@/components/text";
import { removeList } from "../../actions";

export function DeleteListButton({ listId }: { listId: string }) {
  return (
    <DialogButton
      button={"Delete"}
      kind="secondary"
      contents={({ close }) => (
        <Card elevation="high">
          <H3>Are you sure you want delete this list?</H3>
          <div className="flex flex-row justify-between">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await removeList(listId);
              }}
            >
              Delete list
            </Button>
          </div>
        </Card>
      )}
    />
  );
}
