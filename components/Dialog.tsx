"use client";

import React, { HTMLAttributes, useRef } from "react";
import { shareRef } from "./shareRef";

type DialogProps = HTMLAttributes<HTMLDialogElement> & {
  initialOpen?: boolean;
};

export default React.forwardRef<
  HTMLDialogElement,
  React.PropsWithChildren<DialogProps>
>(function Dialog({ children, initialOpen, ...rest }, forwardedRef) {
  const localRef = useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    if (initialOpen) {
      localRef.current?.showModal();
    }
  }, [initialOpen]);

  const onClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const rect = localRef.current?.getBoundingClientRect();
    if (
      rect &&
      (rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY)
    ) {
      localRef.current?.close();
    }
  };

  return (
    <dialog
      style={{ minWidth: "min(400px, 90vw)" }}
      autoFocus
      ref={shareRef(forwardedRef, localRef)}
      {...rest}
      onClick={onClick}
    >
      {children}
    </dialog>
  );
});
