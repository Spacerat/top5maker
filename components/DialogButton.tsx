"use client";

import React from "react";
import Dialog from "./Dialog";
import { Button } from "./Button";

type DialogButton = {
  button: React.ReactNode;
  contents:
    | React.ReactNode
    | (({ close }: { close: () => void }) => React.ReactNode);
  kind?: "primary" | "secondary";
};

export default function DialogButton({
  button,
  contents,
  kind = "primary",
}: DialogButton) {
  const ref = React.useRef<HTMLDialogElement>(null);

  const onClick = () => {
    ref.current?.showModal();
  };

  return (
    <>
      {kind === "primary" ? (
        <Button onClick={onClick}>{button}</Button>
      ) : (
        <Button variant="secondary" onClick={onClick}>
          {button}
        </Button>
      )}
      <Dialog ref={ref}>
        {typeof contents === "function"
          ? contents({ close: () => ref.current?.close() })
          : contents}
      </Dialog>
    </>
  );
}
