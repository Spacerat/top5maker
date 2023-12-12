import React, { useCallback, useState } from "react";
import { RedoItemButton, RemoveItemButton } from "@/components/IconButtons";
import { Paper } from "@/components/layout";
import styles from "./List.module.css";

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
      <div
        className={styles.itemContainer}
        draggable={draggable}
        onDragOver={draggable ? (e) => e.preventDefault() : undefined}
        onDragEnter={draggable ? onDragEnter : undefined}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className={styles.itemTextContainer}>{children}</div>
        {actions}
      </div>
      {isDraggedOver && <div className={styles.dragbar}></div>}
    </>
  );
}

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
    <div className={styles.noSelect}>
      {onClear && <RedoItemButton item={item} onClick={onClear} />}
      {onRemove && <RemoveItemButton item={item} onClick={onRemove} />}
    </div>
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
