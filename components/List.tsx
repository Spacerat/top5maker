"use client";

import React, { useState } from "react";
import { RedoItemButton, RemoveItemButton } from "@/components/IconButtons";
import { Paper } from "@/components/layout";
import styles from "./List.module.css";
import { styled } from "./withStyle";

type ListItemProps = {
  actions?: React.ReactNode;
  isDraggedOver?: boolean;
  currentlyDragging?: boolean;
  loading?: boolean;
  onDragEnter?: () => void | undefined;
  onDragStart?: () => void | undefined;
  onDragEnd?: () => void | undefined;
};

export const ListItemContainer = styled.div(styles.itemContainer);
export const ListItemTextContainer = styled.div(styles.itemTextContainer);

export function ListItem({
  children,
  actions,
  isDraggedOver,
  loading,
  onDragEnter,
  onDragStart,
  onDragEnd,
}: React.PropsWithChildren<ListItemProps>) {
  const draggable = !!(onDragEnter && onDragEnd && onDragStart);
  return (
    <>
      <ListItemContainer
        className={`${styles.itemContainer} ${loading && "opacity-50"}`}
        draggable={draggable}
        onDragOver={draggable ? (e) => e.preventDefault() : undefined}
        onDragEnter={draggable ? onDragEnter : undefined}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <ListItemTextContainer className={styles.itemTextContainer}>
          {children}
        </ListItemTextContainer>
        {actions}
      </ListItemContainer>
      {isDraggedOver && <div className={styles.dragBar}> </div>}
    </>
  );
}

function useDragState<T>() {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [dragging, setDragging] = useState(false);

  const dragStart = () => {
    setDragging(true);
  };

  const dragEnter = (item: T) => {
    if (dragging) setDraggedItem(item);
  };

  const resetDrag = () => {
    setDraggedItem(null);
    setDragging(false);
  };

  return { dragEnter, resetDrag, dragStart, dragging, draggedItem };
}

type ItemListProps<T> = {
  header?: React.ReactNode;
  items: readonly T[];
  getName: (item: T) => string;
  getKey: (item: T) => string;
  onRemove?: null | ((item: T) => void);
  onClear?: null | ((item: T) => void);
  onReorder?: null | ((dragged: T, target: T) => void);
};

export function ItemList<T>({
  header,
  items,
  getName,
  getKey,
  onRemove,
  onClear,
  onReorder,
}: ItemListProps<T>) {
  const { dragEnter, resetDrag, dragStart, dragging, draggedItem } =
    useDragState<T>();

  if (items.length === 0) return null;
  return (
    <>
      {header}
      <Paper elevation="high">
        {items.map((item) => {
          const name = getName(item);
          const key = getKey(item);
          return (
            <ListItem
              key={key}
              actions={
                <div className={styles.noSelect}>
                  {onClear && (
                    <RedoItemButton name={name} onClick={() => onClear(item)} />
                  )}
                  {onRemove && (
                    <RemoveItemButton
                      name={name}
                      onClick={() => onRemove(item)}
                    />
                  )}
                </div>
              }
              currentlyDragging={dragging}
              onDragEnter={onReorder ? () => dragEnter(item) : undefined}
              onDragStart={dragStart}
              onDragEnd={
                onReorder
                  ? () => {
                      resetDrag();
                      onReorder && draggedItem && onReorder(item, draggedItem);
                    }
                  : undefined
              }
              isDraggedOver={draggedItem === item}
            >
              {name}
            </ListItem>
          );
        })}
      </Paper>
    </>
  );
}
