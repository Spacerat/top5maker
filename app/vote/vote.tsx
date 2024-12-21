"use client";

import { Card, CardGrid, Page, Paper } from "@/components/layout";
import { H1 } from "@/components/text";
import { VoteInput } from "./VoteInput";
import { useRouter, useSearchParams } from "next/navigation";
import { serializeItems, deserializeItems } from "@/sortState/serialization";
import { safe64encode, safe64decode } from "@/lib/base64";
import { itemsQueryKey, rankingsQueryKey } from "@/sortState/config";
import { RemoveItemButton } from "@/components/IconButtons";
import { Schulze, utils, InstantRunoff } from "votes";
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

function runVote(
  method: string,
  candidates: string[],
  rankings: { name: string; ranking: string[] }[]
) {
  const ballots = rankings.map(({ ranking }) => ({
    ranking: ranking.map((x) => [x]),
    weight: 1,
  }));
  switch (method) {
    case "schulze":
      return new Schulze(utils.matrixFromBallots(ballots, candidates));
    case "instant-runoff":
      return new InstantRunoff({
        candidates,
        ballots,
      });
    default:
      return new Schulze(utils.matrixFromBallots(ballots, candidates));
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
  const method = query.get("method") || "shulze";

  const updateQuery = (
    newItems: string[],
    newRankings: { name: string; ranking: string[] }[],
    method: string
  ) => {
    const newQuery = {
      [itemsQueryKey]: serializeItems(newItems),
      [rankingsQueryKey]: serializeRankings(newItems, newRankings),
      method: method,
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

    updateQuery(allItems, updatedRankings, method);
  };

  function removeRanking(index: number) {
    const updatedRankings = rankings.filter((_, i) => i !== index);
    const rankedItems = new Set(updatedRankings.flatMap((x) => x.ranking));
    const remainingItems = items.filter((item) => rankedItems.has(item));
    updateQuery(remainingItems, updatedRankings, method);
  }

  const { ranking, scores, scoreType } = useMemo(() => {
    const election = runVote(method, items, rankings);

    const providedScores = "scores" in election ? election.scores() : null;
    const rankScores = election
      .ranking()
      .flatMap((level, levelIndex) =>
        level.map((item) => ({ item, levelIndex }))
      )
      .reduce(
        (acc, { item, levelIndex }) => {
          acc[item] = levelIndex + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    return {
      ranking: election.ranking().flatMap((i) => i),
      scores: providedScores ?? rankScores,
      scoreType: "scores" in election ? "Score" : "Rank",
    };
  }, [items, rankings, method]);

  function setMethod(newMethod: string) {
    updateQuery(items, rankings, newMethod);
  }

  return {
    items,
    rankings,
    method,
    scoreType,
    addRanking,
    setMethod,
    removeRanking,
    ranking,
    scores,
  };
}

export function Vote() {
  const {
    addRanking,
    removeRanking,
    setMethod,
    method,
    rankings,
    ranking,
    scores,
    scoreType,
  } = useVoteState();

  return (
    <Page>
      Vote with your friends and colleagues! Combine the results of multipe Sort
      Star sessions into a single ranking.
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
      <H1>Ranking method</H1>
      <ol className="flex flex-col gap-2">
        <li>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="schulze"
              checked={method === "schulze"}
              onChange={() => setMethod("schulze")}
            />
            Prioritize broadly-liked items
          </label>
          <ol className="list-disc list-inside opacity-70 pl-6">
            <li>
              <a
                href="https://en.wikipedia.org/wiki/Schulze_method"
                target="_blank"
                rel="noopener noreferrer"
              >
                Schulze Method
              </a>
              : Always selects an item that would{" "}
              <a
                href="https://en.wikipedia.org/wiki/Condorcet_winner_criterion"
                target="_blank"
                rel="noopener noreferrer"
              >
                win against all others
              </a>{" "}
              in a head-to-head matchup.
            </li>
          </ol>
        </li>

        <li>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="method"
              value="instant-runoff"
              checked={method === "instant-runoff"}
              onChange={() => setMethod("instant-runoff")}
            />
            Prioritize top-ranked votes
          </label>
          <ol className="list-disc list-inside opacity-70 pl-6">
            <li>
              <a
                href="https://en.wikipedia.org/wiki/Instant-runoff_voting"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instant Runoff
              </a>
              : eliminates the weakest item until one has a majority of top
              votes.
            </li>
          </ol>
        </li>
      </ol>
      <div>
        <H1>Final ranking</H1>
        <Tooltip id="ranking-tooltip">
          Ranked using the Borda Count method
        </Tooltip>
        <div className="grid grid-cols-[1fr,auto] flex-1">
          <div className="p-5 grid-cols-subgrid col-span-2 grid font-light">
            <div>Item Name</div>
            <div>{scoreType}</div>
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
