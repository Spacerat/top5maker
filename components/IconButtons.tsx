import React from "react";
import { CrossIcon, RedoIcon } from "./Icons";

import styles from "./IconButtons.module.css";

type IconButtonProps = {
  item: string;
  onClick: (name: string) => void;
};

export function RemoveItemButton({ item, onClick }: IconButtonProps) {
  return (
    <button
      className={styles.iconButton}
      value={item}
      onClick={() => onClick(item)}
      aria-label={`Remove item: ${item}`}
      title="Remove item"
    >
      <CrossIcon />
    </button>
  );
}

export function RedoItemButton({ item, onClick }: IconButtonProps) {
  return (
    <button
      className={styles.iconButton}
      value={item}
      onClick={() => onClick(item)}
      aria-label={`Re-sort item: ${item}`}
      title="Re-sort item"
    >
      <RedoIcon />
    </button>
  );
}
