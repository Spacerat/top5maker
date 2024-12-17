import React from "react";
import styles from "./text.module.css";
import Link, { LinkProps } from "next/link";
import { styled } from "./withStyle";

type Color = "secondaryLight" | "secondaryDark" | "primary1" | "primaryDark";

export const Text = styled.span<{ color: Color }>((props) =>
  props.color ? styles[props.color] : ""
);
export const H1 = styled.h1(styles.h1);
export const H2 = styled.h2(styles.h2);
export const H3 = styled.h3(styles.h3);

export const NoStyleLink = ({
  children,
  ...props
}: React.PropsWithChildren<LinkProps>) => (
  <Link {...props} className={styles.noStyleLink}>
    {children}
  </Link>
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
}: React.PropsWithChildren<LinkProps & { active?: boolean }>) => (
  <Link
    {...props}
    className={styles.noStyleLink}
    data-active={props.active ? "true" : "false"}
  >
    <H3>{children}</H3>
  </Link>
);
