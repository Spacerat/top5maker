import React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

const FormLine = styled.form`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;
type AddFormProps = {
  onAddItem: (name: string) => void;
  keepInView?: boolean;
};
export function AddForm({ onAddItem, keepInView }: AddFormProps) {
  const [value, setValue] = React.useState("");

  const textRef = React.useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    (e) => {
      e.preventDefault();
      onAddItem(value);
      setValue("");
      textRef.current?.focus();
      // HACK: keep the bottom of the list in view.
      // scrollIntoView doesn't seem to work well for this on mobile.
      // Is there a better way?
      if (keepInView) setTimeout(() => window.scrollBy(0, 52), 1);
      return false;
    },
    [onAddItem, value, keepInView]
  );

  return (
    <FormLine onSubmit={onSubmit}>
      <TextInput
        type="text"
        placeholder="Add your items to here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          if (text && text.includes("\n")) {
            const toAdd = text
              .split("\n")
              .map((x) => x.trim())
              .filter((x) => !!x);
            if (toAdd.length > 1) {
              toAdd.forEach(onAddItem);
              e.preventDefault();
            }
          }
        }}
        ref={textRef}
      />
      <Button type="submit" disabled={value.length === 0}>
        Add
      </Button>
    </FormLine>
  );
}
