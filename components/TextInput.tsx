import styles from "./TextInput.module.css";
import { styled } from "./withStyle";

export const TextInput = styled.input(styles.textInput);
export const TextArea = styled.textarea(styles.textInput);
