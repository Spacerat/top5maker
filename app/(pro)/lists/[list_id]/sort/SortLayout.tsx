"use client";

import { H3 } from "@/components/text";
import { SortResult } from "./sortState";
import { ItemList } from "@/components/List";
import { Button } from "@/components/Button";
import { SideBySideButtons } from "@/components/SideBySideButtons";
import { newDecision } from "@/app/(pro)/actions";

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

  return (
    <>
      <H3>Which is greater?</H3>

      {comparison && (
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
      )}
      <ItemList
        header={<H3>Sorted items (best to worst)</H3>}
        items={sorted}
        getKey={(item) => item.list_item_id}
        getName={(item) => item.name}
      />
      <ItemList
        header={<H3>Unsorted items</H3>}
        items={incompleteSorted}
        getKey={(item) => item.list_item_id}
        getName={(item) => item.name}
      />
    </>
  );
}
