import React from "react";
import { CrossIcon, RedoIcon } from "./Icons";

import styles from "./IconButtons.module.css";
import { twMerge } from "tailwind-merge";

type IconButtonProps = {
  name?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export function RemoveItemButton({
  name,
  onClick,
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(styles.iconButton, className)}
      onClick={onClick}
      aria-label={name ? `Remove item: ${name}` : "Remove item"}
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
