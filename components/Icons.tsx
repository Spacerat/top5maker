import React from "react";

export const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
  >
    <path
      fill="currentColor"
      d="M23.707.293a1 1 0 0 0-1.414 0L12 10.586 1.707.293a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414L10.586 12 .293 22.293a1 1 0 0 0 0 1.414 1 1 0 0 0 1.414 0L12 13.414l10.293 10.293a1 1 0 0 0 1.414 0 1 1 0 0 0 0-1.414L13.414 12 23.707 1.707a1 1 0 0 0 0-1.414Z"
    />
  </svg>
);

export function RedoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M21.962 12.875A10.03 10.03 0 1 1 19.122 5H16a1 1 0 0 0-1 1 1 1 0 0 0 1 1h4.143A1.858 1.858 0 0 0 22 5.143V1a1 1 0 0 0-1-1 1 1 0 0 0-1 1v2.078A11.985 11.985 0 1 0 23.95 13.1a1.007 1.007 0 0 0-1-1.1.982.982 0 0 0-.988.875Z"
      />
    </svg>
  );
}

export const LeftButton = ({ title }: { title?: string }) => (
  <svg width="45" height="45" fill="none" xmlns="http://www.w3.org/2000/svg">
    {title && <title>{title}</title>}
    <rect
      x="1.5"
      y="1.5"
      width="42"
      height="42"
      rx="6.5"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M10.94 20.94a1.5 1.5 0 0 0 0 2.12l9.545 9.547a1.5 1.5 0 1 0 2.122-2.122L14.12 22l8.486-8.485a1.5 1.5 0 1 0-2.122-2.122L10.94 20.94ZM33 20.5H12v3h21v-3Z"
      fill="currentColor"
    />
  </svg>
);

export const RightButton = ({ title }: { title?: string }) => (
  <svg
    width="45"
    height="45"
    viewBox="0 0 45 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {title && <title>{title}</title>}
    <rect
      x="-1.5"
      y="1.5"
      width="42"
      height="42"
      rx="6.5"
      transform="matrix(-1 0 0 1 42 0)"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      d="M34.0607 20.9393C34.6464 21.5251 34.6464 22.4749 34.0607 23.0607L24.5147 32.6066C23.9289 33.1924 22.9792 33.1924 22.3934 32.6066C21.8076 32.0208 21.8076 31.0711 22.3934 30.4853L30.8787 22L22.3934 13.5147C21.8076 12.9289 21.8076 11.9792 22.3934 11.3934C22.9792 10.8076 23.9289 10.8076 24.5147 11.3934L34.0607 20.9393ZM12 20.5L33 20.5L33 23.5L12 23.5L12 20.5Z"
      fill="currentColor"
    />
  </svg>
);
