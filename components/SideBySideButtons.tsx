import React from "react";
import styles from "./SideBySideButtons.module.css";

export const SideBySideButtons = ({ children }: React.PropsWithChildren) => (
  <div className={styles.sideBySideButtons}>{children}</div>
);
