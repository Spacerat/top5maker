import React, { InputHTMLAttributes } from "react";
import styles from "./TextInput.module.css";

export const TextInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return <input className={styles.textInput} {...props} />;
};
