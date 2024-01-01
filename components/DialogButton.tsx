"use client";

import React from "react";
import Dialog from "./Dialog";
import { Button, ButtonVariant } from "./Button";

type DialogButton = {
  button: React.ReactNode;
  contents:
    | React.ReactNode
    | (({ close }: { close: () => void }) => React.ReactNode);
  variant?: ButtonVariant;
};

export default function DialogButton({
  button,
  contents,
  variant = "primary",
}: DialogButton) {
  const ref = React.useRef<HTMLDialogElement>(null);

  const onClick = () => {
    ref.current?.showModal();
  };

  return (
    <>
      <Button onClick={onClick} variant={variant}>
        {button}
      </Button>

      <Dialog ref={ref}>
        {typeof contents === "function"
          ? contents({ close: () => ref.current?.close() })
          : contents}
      </Dialog>
    </>
  );
}
