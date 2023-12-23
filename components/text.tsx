import React from "react";
import styles from "./text.module.css";
import Link, { LinkProps } from "next/link";

type Color = "secondaryLight" | "secondaryDark" | "primary1" | "primaryDark";

export const Text = ({
  children,
  color,
}: React.PropsWithChildren<{ color: Color }>) => (
  <span className={styles[color]}>{children}</span>
);

export const H1 = ({ children }: React.PropsWithChildren) => (
  <h1 className={styles.h1}>{children}</h1>
);

export const H2 = ({ children }: React.PropsWithChildren) => (
  <h2 className={styles.h2}>{children}</h2>
);

export const BrandLink = ({
  children,
  ...props
}: React.PropsWithChildren<LinkProps>) => (
  <Link {...props} className={styles.noStyleLink}>
    <H1>{children}</H1>
  </Link>
);

export const NavLink = ({
  children,
  ...props
}: React.PropsWithChildren<LinkProps>) => (
  <Link {...props} className={styles.noStyleLink}>
    <H3>{children}</H3>
  </Link>
);

export const H3 = ({ children }: React.PropsWithChildren) => (
  <h3 className={styles.h3}>{children}</h3>
);
