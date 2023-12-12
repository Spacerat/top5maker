import React from "react";
import styles from "./text.module.css";
import Link, { LinkProps } from "next/link";

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
  <Link {...props} className={styles.brandLink}>
    <H1>{children}</H1>
  </Link>
);

export const H3 = ({ children }: React.PropsWithChildren) => (
  <h3 className={styles.h3}>{children}</h3>
);
