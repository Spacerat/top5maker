import React from "react";
import { TextButton } from "./TextButton";

// TODO: use SVG icons which are actually the same everywhere 🙈

export function RemoveItemButton({
  item,
  onClick,
}: {
  item: string;
  onClick: (name: string) => void;
}) {
  return (
    <TextButton
      value={item}
      onClick={() => onClick(item)}
      aria-label={`Remove item: ${item}`}
      title="Remove item"
    >
      ✖
    </TextButton>
  );
}

export function RedoItemButton({
  item,
  onClick,
}: {
  item: string;
  onClick: (name: string) => void;
}) {
  return (
    <TextButton
      value={item}
      onClick={() => onClick(item)}
      aria-label={`Re-sort item: ${item}`}
      title="Re-sort item"
    >
      ⟳
    </TextButton>
  );
}
