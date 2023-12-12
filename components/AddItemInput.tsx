import React, { ClipboardEventHandler, useCallback } from "react";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
// import the formline class from additeminput.module.css
import styles from "./additeminput.module.css";

type AddFormProps = {
  onAddItems: (names: string[]) => void;
  keepInView?: boolean;
  disabled?: boolean;
};

export function AddForm({ onAddItems, keepInView, disabled }: AddFormProps) {
  const [value, setValue] = React.useState("");

  const textRef = React.useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    (e) => {
      e.preventDefault();
      if (value.length > 0) {
        onAddItems([value]);
        setValue("");
        textRef.current?.focus();
        // HACK: keep the bottom of the list in view.
        // scrollIntoView doesn't seem to work well for this on mobile.
        // Is there a better way?
        if (keepInView) setTimeout(() => window.scrollBy(0, 52), 1);
      }
    },
    [onAddItems, value, keepInView]
  );

  const onPaste: ClipboardEventHandler = useCallback(
    (e) => {
      const text = e.clipboardData?.getData("text");
      if (text && text.includes("\n")) {
        const toAdd = text
          .split("\n")
          .map((x) => x.trim())
          .filter((x) => !!x);
        if (toAdd.length > 1) {
          onAddItems(toAdd);
          e.preventDefault();
        }
      }
    },
    [onAddItems]
  );

  return (
    <form onSubmit={onSubmit} className={styles.formline}>
      <TextInput
        type="text"
        placeholder="Add your items to here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={onPaste}
        ref={textRef}
      />
      <Button type="submit" disabled={disabled || value.length === 0}>
        Add
      </Button>
    </form>
  );
}
