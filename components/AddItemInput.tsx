import React, { ClipboardEventHandler } from "react";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
import styles from "./AddItemInput.module.css";

type AddFormProps = {
  onAddItems: (names: string[]) => void;
  keepInView?: boolean;
  disabled?: boolean;
};

export function AddForm({ onAddItems, keepInView, disabled }: AddFormProps) {
  const [value, setValue] = React.useState("");

  const textRef = React.useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
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
  };

  const onPaste: ClipboardEventHandler = (e) => {
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
  };

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
