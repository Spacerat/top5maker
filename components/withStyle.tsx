import React, { PropsWithChildren } from "react";
import {
  ButtonProps,
  DivProps,
  FooterProps,
  H1Props,
  H2Props,
  H3Props,
  HeaderProps,
  InputProps,
  SpanProps,
  AProps,
  TextAreaProps,
} from "react-html-props";
import { twMerge } from "tailwind-merge";

type StyleProp<T> = string | ((props: T) => string);

export function withStyle<T>(element: string, style: StyleProp<T>) {
  const result = React.forwardRef(
    (
      {
        className,
        children,
        ...rest
      }: PropsWithChildren<T & { className?: string | undefined }>,
      ref
    ) =>
      React.createElement(
        element,
        {
          ...rest,
          ref,
          className: twMerge(
            typeof style === "function" ? style(rest as T) : style,
            className
          ),
        },
        children
      )
  );
  const styleName = typeof style === "function" ? "function" : style;
  result.displayName = `withStyle(${element}, ${styleName})`;
  return result;
}

export const styled = {
  h1<T>(style: StyleProp<T>) {
    return withStyle<H1Props & T>("h1", style);
  },
  h2<T>(style: StyleProp<T>) {
    return withStyle<H2Props & T>("h1", style);
  },
  h3<T>(style: StyleProp<T>) {
    return withStyle<H3Props & T>("h1", style);
  },
  span<T>(style: StyleProp<T>) {
    return withStyle<SpanProps & T>("span", style);
  },
  input<T>(style: StyleProp<T>) {
    return withStyle<InputProps & T>("input", style);
  },
  textarea<T>(style: StyleProp<T>) {
    return withStyle<TextAreaProps & T>("textarea", style);
  },
  div<T>(style: StyleProp<T>) {
    return withStyle<DivProps & T>("div", style);
  },
  header<T>(style: StyleProp<T>) {
    return withStyle<HeaderProps & T>("header", style);
  },
  footer<T>(style: StyleProp<T>) {
    return withStyle<FooterProps & T>("footer", style);
  },
  button<T>(style: StyleProp<T>) {
    return withStyle<ButtonProps & T>("button", style);
  },
  a<T>(style: StyleProp<T>) {
    return withStyle<AProps & T>("a", style);
  },
};
