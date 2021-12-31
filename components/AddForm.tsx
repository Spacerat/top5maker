import styled from "styled-components";
import React from "react";
import { TextInput } from "./TextInput";
import { Button } from "./Button";

const FormLine = styled.form`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;
type AddFormProps = {
  onAddItem: (name: string) => void;
};
export function AddForm({ onAddItem }: AddFormProps) {
  const [value, setValue] = React.useState("");

  const textRef = React.useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    (e) => {
      e.preventDefault();
      onAddItem(value);
      setValue("");
      textRef.current?.focus();
      return false;
    },
    [onAddItem, value]
  );

  return (
    <FormLine onSubmit={onSubmit}>
      <TextInput
        type="text"
        placeholder="Enter a name here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={textRef}
      />
      <Button type="submit" disabled={value.length === 0}>
        Add
      </Button>
    </FormLine>
  );
}
