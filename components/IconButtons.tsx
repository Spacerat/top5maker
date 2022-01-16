import React from "react";
import styled from "styled-components";

export const IconButton = styled.button`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-family: ${({ theme }) => theme.fonts.roboto};
  font-weight: 500;
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: ${({ theme }) => theme.border.radius};
  border: 1px ${({ theme }) => theme.colors.primary1} solid;
  color: ${({ theme }) => theme.colors.primary1};
  & svg {
    vertical-align: middle;
  }
  // Mobile-chrome workaround - not all unicode can be coloured
  text-shadow: 0 0 0 ${({ theme }) => theme.colors.primary1};
  background: none;
  border: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary2};
  }
  &:active {
    color: ${({ theme }) => theme.colors.primaryPressed};
  }
  &:focus-visible {
    outline: 1px ${({ theme }) => theme.colors.link} solid;
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.primary3};
  }
`;

export function RemoveItemButton({
  item,
  onClick,
}: {
  item: string;
  onClick: (name: string) => void;
}) {
  return (
    <IconButton
      value={item}
      onClick={() => onClick(item)}
      aria-label={`Remove item: ${item}`}
      title="Remove item"
    >
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
    </IconButton>
  );
}

export function RedoItemButton({
  item,
  onClick,
}: {
  item: string;
  onClick: (name: string) => void;
}) {
  return (
    <IconButton
      value={item}
      onClick={() => onClick(item)}
      aria-label={`Re-sort item: ${item}`}
      title="Re-sort item"
    >
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
    </IconButton>
  );
}
