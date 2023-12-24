"use client";

import { Button } from "@/components/Button";
import { ListItem } from "@/components/List";
import { TextInput } from "@/components/TextInput";
import { useOptimistic, useRef, useState } from "react";
import {
  ListItem as ListItemType,
  addListItems,
  removeListItem,
} from "../../actions";
import { Paper } from "@/components/layout";
import { CrossIcon } from "@/components/Icons";
import { uuid } from "short-uuid";

type Action =
  | {
      type: "add";
      items: {
        name: string;
        idempotencyKey: string;
      }[];
    }
  | {
      type: "remove";
      itemId: string;
    };

function optimisticListUpdate(state: ListItemType[], action: Action) {
  let result: ListItemType[] = [];
  if (action.type === "add") {
    const currentKeys = new Set(state.map((x) => x.idempotencyKey));
    const itemsToAdd = action.items
      .filter((item) => !currentKeys.has(item.idempotencyKey))
      .map((item) => ({
        ...item,
        list_item_id: item.idempotencyKey,
        loading: true,
      }));

    result = itemsToAdd.length > 0 ? [...state, ...itemsToAdd] : state;
  } else if (action.type === "remove") {
    result = state.filter((item) => item.list_item_id !== action.itemId);
  }
  console.log({ event: "optimisitc", state, action, result });
  return result;
}

export function ListBuilder({
  listId,
  items,
}: {
  listId: string;
  items: ListItemType[];
}) {
  const [state, setState] = useState(items);
  const formRef = useRef<HTMLFormElement>(null);

  const [displayState, updateOptimistic] = useOptimistic(
    state,
    optimisticListUpdate
  );

  async function addItemOptimistic(formData: FormData) {
    const name = formData.get("name") as string;
    const idempotencyKey = uuid();
    const items = [{ name, idempotencyKey }];

    formRef.current?.reset();

    updateOptimistic({ type: "add", items });
    const newItems = await addListItems(listId, items);
    setState((curr) => {
      const result = [...curr, ...newItems];
      console.log({ event: "stateupdate", curr, action: "add", result });
      return result;
    });
  }

  async function removeItemOptimistic(itemId: string) {
    updateOptimistic({ type: "remove", itemId });
    const removedId = await removeListItem(itemId);
    setState((curr) => {
      const result = curr.filter((item) => item.list_item_id !== removedId);
      console.log({ event: "stateupdate", curr, action: "remove", result });
      return result;
    });
  }

  return (
    <>
      <Paper elevation="high">
        {displayState.map((item) => (
          <ListItem
            key={item.list_item_id}
            loading={item.loading}
            actions={
              <form
                className="contents"
                action={removeItemOptimistic.bind(null, item.list_item_id)}
              >
                <button disabled={item.loading} type="submit">
                  <CrossIcon />
                </button>
              </form>
            }
          >
            {item.name}
          </ListItem>
        ))}
      </Paper>
      <form action={addItemOptimistic} ref={formRef} className="contents">
        <div className="flex flex-row gap-4">
          <TextInput name="name" placeholder="Add another item" required />
          <Button type="submit">Add</Button>
        </div>
      </form>
    </>
  );
}
