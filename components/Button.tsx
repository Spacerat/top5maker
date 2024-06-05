import styles from "./Button.module.css";
import { styled } from "./withStyle";

export type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  variant?: ButtonVariant;
};

export const Button = styled.button<ButtonProps>(
  ({ variant = "primary" }) => `${styles.button} ${styles[variant]}`
);

export const LinkButton = styled.a<ButtonProps>(
  ({ variant = "primary" }) => `${styles.button} ${styles[variant]}`
);

export const FullMobileButton = styled.button<ButtonProps>(
  ({ variant = "primary" }) => `${styles.fullMobileButton} ${styles[variant]}`
);
