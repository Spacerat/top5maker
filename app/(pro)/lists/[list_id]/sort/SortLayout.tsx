"use client";

import { H3 } from "@/components/text";
import { Item, SortResult } from "./sortState";
import { ItemList } from "@/components/List";
import { Button, FullMobileButton } from "@/components/Button";
import { SideBySideButtons } from "@/components/SideBySideButtons";
import {
  newDecision,
  deleteListItem,
  resetListItem,
  undo,
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
  const { comparison, sorted, incompleteSorted, lastAction } = sortState;

  const onRemove = async (item: Item) =>
    deleteListItem(listId, item.list_item_id);

  const onClear = async (item: Item) =>
    resetListItem(listId, item.list_item_id);

  const onUndo = async () => {
    lastAction && undo(listId, lastAction);
  };
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
      {lastAction && (
        <>
          <FullMobileButton
            data-tooltip-id="undoTooltip"
            variant="secondary"
            onClick={onUndo}
          >
            Undo
          </FullMobileButton>
          <Tooltip id="undoTooltip" className="max-w-full" place="right">
            <div className="flex flex-row gap-2 items-center text-center">
              <div>Undo:</div>
              {lastAction.type === "decision" && (
                <>
                  <div>{`"${lastAction.decision.greater_item.name}"`}</div>
                  <div>{" > "}</div>
                  <div>{`"${lastAction.decision.lesser_item.name}"`}</div>
                </>
              )}
              {lastAction.type === "delete" && (
                <>
                  <div>{`Delete "${lastAction.item.name}"`}</div>
                </>
              )}
            </div>
          </Tooltip>
        </>
      )}
    </>
  );
}
