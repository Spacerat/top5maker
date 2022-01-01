import React from "react";
import styled from "styled-components";
import { Body } from "./text";

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  /* padding-top: 12px;
  padding-bottom: 12px; */
  padding: 12px;
  &:not(:last-child) {
    border-bottom: thin ${({ theme }) => theme.colors.primary3} solid;
  }
`;
const ItemTextContainer = styled.div`
  flex: 1;
`;

export function ListItem({
  children,
  actions,
}: React.PropsWithChildren<{ actions?: React.ReactNode }>) {
  return (
    <ItemContainer>
      <ItemTextContainer>
        <Body>{children}</Body>
      </ItemTextContainer>
      {actions}
    </ItemContainer>
  );
}
