import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { RedoItemButton, RemoveItemButton } from "@/components/IconButtons";
import { Paper } from "@/components/layout";

const ItemContainer = styled.div<{ draggedOver: boolean }>`
  display: flex;
  flex-direction: row;
  padding: 20px;
  align-items: center;
  ${({ draggedOver }) => (draggedOver ? `` : "")}
  &:not(:last-child) {
    border-bottom: thin ${({ theme }) => theme.colors.primary3} solid;
  }
`;
const ItemTextContainer = styled.div`
  flex: 1;
  overflow: auto;
  overflow-wrap: break-word;
  user-select: text;
`;

const DragBar = styled.div`
  // background-color: blue;
  // height: 3px;
  outline: thin blue solid;
`;

type ListItemProps = {
  actions?: React.ReactNode;
  isDraggedOver: boolean;
  currentlyDragging: boolean;
  onDragEnter?: () => void | undefined;
  onDragStart?: () => void | undefined;
  onDragEnd?: () => void | undefined;
};

export function ListItem({
  children,
  actions,
  isDraggedOver,
  onDragEnter,
  onDragStart,
  onDragEnd,
}: React.PropsWithChildren<ListItemProps>) {
  const draggable = !!(onDragEnter && onDragEnd && onDragStart);
  return (
    <>
      <ItemContainer
        draggable={draggable}
        draggedOver={isDraggedOver}
        onDragOver={draggable ? (e) => e.preventDefault() : undefined}
        onDragEnter={draggable ? onDragEnter : undefined}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <ItemTextContainer>{children}</ItemTextContainer>
        {actions}
      </ItemContainer>
      {isDraggedOver && <DragBar></DragBar>}
    </>
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

function useDragState() {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const onDragStart = useCallback(() => {
    setDragging(true);
  }, []);
  const onDragEnter = useCallback(
    (item: string) => {
      if (dragging) setDraggedItem(item);
    },
    [dragging]
  );
  const onDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragging(false);
  }, []);

  return { onDragEnter, onDragEnd, onDragStart, dragging, draggedItem };
}

type ItemListProps = {
  header?: React.ReactNode;
  items: readonly string[];
  onRemove?: null | ((item: string) => void);
  onClear?: null | ((item: string) => void);
  onReorder?: null | ((dragged: string, target: string) => void);
};

export function ItemList({
  header,
  items,
  onRemove,
  onClear,
  onReorder,
}: ItemListProps) {
  const { onDragEnter, onDragEnd, onDragStart, dragging, draggedItem } =
    useDragState();

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
      <Paper elevation="high">
        {items.map((item) => (
          <ListItem
            key={item}
            actions={actions(item)}
            currentlyDragging={dragging}
            onDragEnter={onReorder ? () => onDragEnter(item) : undefined}
            onDragStart={onDragStart}
            onDragEnd={
              onReorder
                ? () => {
                    onDragEnd();
                    onReorder && draggedItem && onReorder(item, draggedItem);
                  }
                : undefined
            }
            isDraggedOver={draggedItem === item}
          >
            {item}
          </ListItem>
        ))}
      </Paper>
    </>
  );
}
