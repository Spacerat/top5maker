import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./Button.module.css";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = ({ children, ...props }: ButtonProps) => (
  <button className={`${styles.button} ${styles.primary}`} {...props}>
    {children}
  </button>
);

export const SecondaryButton = ({ children, ...props }: ButtonProps) => (
  <button className={`${styles.button} ${styles.secondary}`} {...props}>
    {children}
  </button>
);

export const FullMobileButton = ({ children, ...props }: ButtonProps) => (
  <button className={`${styles.fullMobileButton} ${styles.primary}`} {...props}>
    {children}
  </button>
);

export const FullMobileSecondaryButton = ({
  children,
  ...props
}: ButtonProps) => (
  <button
    className={`${styles.fullMobileButton} ${styles.secondary}`}
    {...props}
  >
    {children}
  </button>
);
