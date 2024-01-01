import React from "react";
import { CrossIcon, RedoIcon } from "./Icons";

import styles from "./IconButtons.module.css";

type IconButtonProps = {
  name: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export function RemoveItemButton({ name, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={onClick}
      aria-label={`Remove item: ${name}`}
      title="Remove item"
    >
      <CrossIcon />
    </button>
  );
}

export function RedoItemButton({ name, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={onClick}
      aria-label={`Re-sort item: ${name}`}
      title="Re-sort item"
    >
      <RedoIcon />
    </button>
  );
}
