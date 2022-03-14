import React from "react";
import styled from "styled-components";
import { CrossIcon, RedoIcon } from "./Icons";

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
      <CrossIcon />
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
      <RedoIcon />
    </IconButton>
  );
}
