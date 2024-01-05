"use client";

import { H3 } from "@/components/text";
import { Item, SortResult } from "./sortState";
import { ItemList } from "@/components/List";
import { Button, FullMobileButton } from "@/components/Button";
import { SideBySideButtons } from "@/components/SideBySideButtons";
import {
  deleteDecision,
  newDecision,
  removeListItem,
  resetListItem,
} from "@/app/(pro)/actions";
import { Tooltip } from "react-tooltip";

function getItemId(item: { list_item_id: string }) {
  return item.list_item_id;
}
function getItemName(item: { name: string }) {
  return item.name;
}

export function SortLayout({
  sortState,
  listId,
  sortId,
}: {
  sortState: SortResult;
  listId: string;
  sortId: string;
}) {
  const { comparison, sorted, incompleteSorted } = sortState;

  const lastDecision = sortState.lastDecision;

  const onRemove = async (item: Item) =>
    removeListItem(listId, item.list_item_id);

  const onClear = async (item: Item) =>
    resetListItem(listId, item.list_item_id);

  return (
    <>
      {comparison && (
        <>
          <H3>Which is greater?</H3>
          <SideBySideButtons>
            <Button
              onClick={async () =>
                newDecision(
                  listId,
                  sortId,
                  comparison.a.list_item_id,
                  comparison.b.list_item_id
                )
              }
            >
              {comparison?.a.name}
            </Button>
            <Button
              onClick={async () =>
                newDecision(
                  listId,
                  sortId,
                  comparison.b.list_item_id,
                  comparison.a.list_item_id
                )
              }
            >
              {comparison?.b.name}
            </Button>
          </SideBySideButtons>
        </>
      )}
      <ItemList
        header={<H3>Sorted items (best to worst)</H3>}
        items={sorted}
        getKey={getItemId}
        getName={getItemName}
        onClear={onClear}
        onRemove={onRemove}
      />
      <ItemList
        header={<H3>Unsorted items</H3>}
        items={incompleteSorted}
        getKey={getItemId}
        getName={getItemName}
        onRemove={onRemove}
      />
      {lastDecision && (
        <>
          <FullMobileButton
            data-tooltip-id="undoTooltip"
            variant="secondary"
            onClick={async () => {
              await deleteDecision(listId, lastDecision.id);
            }}
          >
            Undo
          </FullMobileButton>
          <Tooltip id="undoTooltip" className="max-w-full" place="right">
            <div className="flex flex-row gap-2 items-center text-center">
              <div>Undo:</div>
              <div>{lastDecision.greater.name}</div>
              <div>{" > "}</div>
              <div>{lastDecision.lesser.name}</div>
            </div>
          </Tooltip>
        </>
      )}
    </>
  );
}
