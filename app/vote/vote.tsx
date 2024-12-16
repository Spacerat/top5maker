"use client";

import { CardGrid, Card, Page, Paper } from "@/components/layout";
import { H1 } from "@/components/text";
import { VoteInput } from "./VoteInput";
import { useRouter, useSearchParams } from "next/navigation";
import { serializeItems, deserializeItems } from "@/sortState/serialization";
import { safe64encode, safe64decode } from "@/lib/base64";
import { itemsQueryKey, rankingsQueryKey } from "@/sortState/config";
import { RemoveItemButton } from "@/components/IconButtons";
import { Borda } from "votes";
import { useMemo } from "react";
import {
  ItemList,
  ListItem,
  ListItemContainer,
  ListItemTextContainer,
} from "@/components/List";

function serializeRankings(items: string[], ranked: string[][]) {
  const indexMap = new Map(
    items.map((item, index) => [item, String.fromCharCode(index + 65)])
  );
  const serializedRankings = ranked
    .map((ranking) => ranking.map((item) => indexMap.get(item) || "").join(""))
    .join(",");
  return safe64encode(serializedRankings);
}

function deserializeRankings(data: string, items: string[]) {
  try {
    const decoded = safe64decode(data);
    const nameMap = new Map(
      items.map((item, index) => [String.fromCharCode(index + 65), item])
    );
    return decoded
      .split(",")
      .map((ranking) =>
        ranking.split("").map((char) => nameMap.get(char) || "")
      );
  } catch {
    return [];
  }
}
function useVoteState() {
  const { replace } = useRouter();
  const query = useSearchParams();

  const items = deserializeItems(query.get(itemsQueryKey) || "");
  const rankings = deserializeRankings(
    query.get(rankingsQueryKey) || "",
    items
  );

  const updateQuery = (newItems: string[], newRankings: string[][]) => {
    const newQuery = {
      [itemsQueryKey]: serializeItems(newItems),
      [rankingsQueryKey]: serializeRankings(newItems, newRankings),
    };
    const queryString = new URLSearchParams(newQuery).toString();
    replace(`vote?${queryString}`, {
      scroll: false,
    });
  };

  const addRanking = (newRanking: string[]) => {
    const updatedRankings = [...rankings, newRanking].filter(
      (x) => x.length > 0
    );

    const allItems = [
      ...items,
      ...newRanking.filter((item) => !items.includes(item)),
    ];

    updateQuery(allItems, updatedRankings);
  };

  function removeRanking(index: number) {
    const updatedRankings = rankings.filter((_, i) => i !== index);
    const rankedItems = new Set(updatedRankings.flat());
    const remainingItems = items.filter((item) => rankedItems.has(item));
    updateQuery(remainingItems, updatedRankings);
  }

  const { ranking, scores } = useMemo(() => {
    const borda = new Borda({
      candidates: items,
      ballots: rankings.map((ranking) => ({
        ranking: ranking.map((x) => [x]),
        weight: 1,
      })),
    });

    return {
      ranking: borda.ranking().map((x) => x[0]),
      scores: borda.scores(),
    };
  }, [items, rankings]);

  return {
    items,
    rankings,
    addRanking,
    removeRanking,
    ranking,
    scores,
  };
}

export function Vote() {
  const { addRanking, removeRanking, rankings, ranking, scores } =
    useVoteState();

  return (
    <Page>
      <H1>Per-person rankings</H1>
      <VoteInput onReceiveRanking={addRanking} />
      <H1>Votes</H1>
      <CardGrid>
        {rankings.map((ranking, index) => (
          <Paper elevation="low" className="relative pl-4" key={index}>
            <RemoveItemButton
              onClick={() => removeRanking(index)}
              className="absolute -right-2 top-3"
            />
            <div className="max-h-52 overflow-y-auto py-4">
              <ol className="list-decimal list-inside whitespace-nowrap ">
                {ranking.map((item) => (
                  <li key={item} className="text-ellipsis overflow-x-hidden">
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </Paper>
        ))}
      </CardGrid>
      <div>
        <H1>Final ranking</H1>
        <div className="grid grid-cols-[1fr,auto] flex-1">
          <div className="p-5 grid-cols-subgrid col-span-2 grid font-light">
            <div>Item Name</div>
            <div>Score</div>
          </div>
          <Paper
            className="grid-cols-subgrid col-span-2 !grid"
            elevation="high"
          >
            {ranking.map((item) => (
              <ListItemContainer
                key={item}
                className="col-span-2 !grid grid-cols-subgrid"
              >
                <ListItemTextContainer>{item}</ListItemTextContainer>
                <div>{scores[item]}</div>
              </ListItemContainer>
            ))}
          </Paper>
        </div>
      </div>
    </Page>
  );
}
