"use client";

import React from "react";
import Dialog from "./Dialog";
import { Button, SecondaryButton } from "./Button";

type DialogButton = {
  button: React.ReactNode;
  contents: React.ReactNode;
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
        <SecondaryButton onClick={onClick}>{button}</SecondaryButton>
      )}
      <Dialog ref={ref}>{contents}</Dialog>
    </>
  );
}
