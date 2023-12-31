import styles from "./Button.module.css";
import { styled } from "./withStyle";

type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
};

export const Button = styled.button<ButtonProps>(
  ({ variant = "primary" }) => `${styles.button} ${styles[variant]}`
);

export const FullMobileButton = styled.button<ButtonProps>(
  ({ variant = "primary" }) => `${styles.fullMobileButton} ${styles[variant]}`
);
