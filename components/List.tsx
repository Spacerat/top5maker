import React from "react";
import styled from "styled-components";
import { RedoItemButton, RemoveItemButton } from "../components/IconButtons";
import { Paper } from "../components/layout";
import { Body } from "./text";

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px;
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

// TODO: this is a hack to make it easier for people to copy/paste the final list.
// The better solution would be to restructure the page itself so that the list elements
// are separate from the action button elements.
const NoSelect = styled.div`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export function ItemList({
  header,
  items,
  onRemove,
  onClear,
}: {
  header?: React.ReactNode;
  items: readonly string[];
  onRemove?: null | ((item: string) => void);
  onClear?: null | ((item: string) => void);
}) {
  const actions = (item: string) => (
    <NoSelect>
      {onClear && <RedoItemButton item={item} onClick={onClear} />}
      {onRemove && <RemoveItemButton item={item} onClick={onRemove} />}
    </NoSelect>
  );

  if (items.length === 0) return null;
  return (
    <>
      {header}
      <Paper>
        {items.map((item) => (
          <ListItem key={item} actions={actions(item)}>
            {item}
          </ListItem>
        ))}
      </Paper>
    </>
  );
}
