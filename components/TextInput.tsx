import React, { InputHTMLAttributes } from "react";
import styles from "./TextInput.module.css";

export const TextInput = (
  props: React.DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  return <input className={styles.textInput} {...props} />;
};
