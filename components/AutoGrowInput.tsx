import React, { InputHTMLAttributes, forwardRef, useRef } from "react";

import styles from "./AutoGrowInput.module.css";

export const AutoGrowInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function AutoGrowInput(props, inputRef) {
  const divRef = useRef<HTMLInputElement>(null);
  return (
    <div
      ref={divRef}
      className={styles["grow-wrap"]}
      data-replicated-value={props.defaultValue}
    >
      <input
        ref={inputRef}
        onInput={(e) => {
          divRef.current!.dataset.replicatedValue = e.currentTarget.value;
        }}
        {...props}
      />
    </div>
  );
});
