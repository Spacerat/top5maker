"use client";

import { Card, CardGrid, Page, Paper } from "@/components/layout";
import { H1 } from "@/components/text";
import { VoteInput } from "./VoteInput";
import { useRouter, useSearchParams } from "next/navigation";
import { serializeItems, deserializeItems } from "@/sortState/serialization";
import { safe64encode, safe64decode } from "@/lib/base64";
import { itemsQueryKey, rankingsQueryKey } from "@/sortState/config";
import { RemoveItemButton } from "@/components/IconButtons";
import { Borda as VoteMethod } from "votes";
import { useMemo } from "react";
import { ListItemContainer, ListItemTextContainer } from "@/components/List";
import { Tooltip } from "react-tooltip";

function serializeRankings(
  items: string[],
  ranked: { name: string; ranking: string[] }[]
) {
  const indexMap = new Map(
    items.map((item, index) => [item, String.fromCharCode(index + 65)])
  );
  const serializedRankings = ranked
    .map(
      ({ name, ranking }) =>
        `${name}:${ranking.map((item) => indexMap.get(item) || "").join("")}`
    )
    .join(",");
  return safe64encode(serializedRankings);
}

function deserializeRankings(data: string, items: string[]) {
  try {
    const decoded = safe64decode(data);
    const nameMap = new Map(
      items.map((item, index) => [String.fromCharCode(index + 65), item])
    );
    return decoded.split(",").map((entry) => {
      const [name, ranking] = entry.split(":");
      return {
        name,
        ranking: ranking.split("").map((char) => nameMap.get(char) || ""),
      };
    });
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

  const updateQuery = (
    newItems: string[],
    newRankings: { name: string; ranking: string[] }[]
  ) => {
    const newQuery = {
      [itemsQueryKey]: serializeItems(newItems),
      [rankingsQueryKey]: serializeRankings(newItems, newRankings),
    };
    const queryString = new URLSearchParams(newQuery).toString();
    replace(`vote?${queryString}`, {
      scroll: false,
    });
  };

  const addRanking = (newRanking: string[], voterName: string) => {
    const updatedRankings = [
      ...rankings,
      { name: voterName, ranking: newRanking },
    ].filter((x) => x.ranking.length > 0);

    const allItems = [
      ...items,
      ...newRanking.filter((item) => !items.includes(item)),
    ];

    updateQuery(allItems, updatedRankings);
  };

  function removeRanking(index: number) {
    const updatedRankings = rankings.filter((_, i) => i !== index);
    const rankedItems = new Set(updatedRankings.flatMap((x) => x.ranking));
    const remainingItems = items.filter((item) => rankedItems.has(item));
    updateQuery(remainingItems, updatedRankings);
  }

  const { ranking, scores } = useMemo(() => {
    const election = new VoteMethod({
      candidates: items,
      ballots: rankings.map(({ ranking }) => ({
        ranking: ranking.map((x) => [x]),
        weight: 1,
      })),
    });

    return {
      ranking: election.ranking().flatMap((i) => i),
      scores:
        "scores" in election && typeof election.scores === "function"
          ? election.scores()
          : {},
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
        {rankings.map(({ name, ranking }, index) => (
          <Paper elevation="low" className="relative pl-4" key={index}>
            <RemoveItemButton
              onClick={() => removeRanking(index)}
              className="absolute -right-2 top-3"
            />
            <div className="max-h-52 overflow-y-auto py-4">
              <div className="font-bold">{name}</div>
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
        {rankings.length === 0 && (
          <Card elevation="low">
            <em className="opacity-50 font-light">No votes yet</em>
          </Card>
        )}
      </CardGrid>
      <div>
        <H1>
          Final ranking{" "}
          <span
            data-tooltip-id="ranking-tooltip"
            className="text-xs border border-black border-opacity-60 opacity-60 rounded-full w-4 h-4 inline-block text-center align-super box-content"
          >
            i
          </span>
        </H1>
        <Tooltip id="ranking-tooltip">
          Ranked using the Borda Count method
        </Tooltip>
        <div className="grid grid-cols-[1fr,auto] flex-1">
          <div className="p-5 grid-cols-subgrid col-span-2 grid font-light">
            <div>Item Name</div>
            <div>Score</div>
          </div>
          <Paper className="grid-cols-subgrid col-span-2 !grid" elevation="low">
            {ranking.map((item) => (
              <ListItemContainer
                key={item}
                className="col-span-2 !grid grid-cols-subgrid"
              >
                <ListItemTextContainer>{item}</ListItemTextContainer>
                <div>{scores[item]}</div>
              </ListItemContainer>
            ))}
            {ranking.length === 0 && (
              <ListItemContainer className="col-span-2">
                <em className="opacity-50 font-light">
                  The final results will appear here
                </em>
              </ListItemContainer>
            )}
          </Paper>
        </div>
      </div>
    </Page>
  );
}
