import { produce } from "immer";
import React from "react";
import styled from "styled-components";
import { Brand } from "../components/Brand";
import { Button } from "../components/Button";
import { Header, Main, Page } from "../components/layout";
import { ListItem } from "../components/ListItem";
import { H1 } from "../components/text";
import {
  cacheWithUpdate,
  heapsort,
  initCache,
  SortCache,
  SortStatus,
} from "../lib/interruptibleSort";

const SideBySideButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  & button {
    flex: 1;
    height: 160px;
    ${({ theme }) => theme.shadows.primary}
  }
`;

type State = {
  cache: SortCache;
  status: SortStatus;
  items: string[];
  history: SortCache[];
};

type Action = { type: "update"; larger: string } | { type: "undo" };

function init(items: string[]): State {
  const cache = initCache();
  return {
    cache,
    status: heapsort(cache, items),
    items,
    history: [cache],
  };
}

function reducer(state: State, action: Action) {
  return produce(state, (s) => {
    const status = s.status;
    switch (action.type) {
      case "update":
        if (status.done) return;
        const larger = action.larger;
        const { a, b } = status.comparison;
        const smaller = larger === a ? b : a;
        s.cache = cacheWithUpdate(s.cache, { larger, smaller });
        s.history.push(s.cache);
        s.status = heapsort(s.cache, s.items);
        return;
      case "undo":
        const last = s.history.pop();
        if (last !== undefined) {
          s.cache = last;
          s.status = heapsort(s.cache, s.items);
        }
    }
  });
}

const tempItems = ["A", "B", "D", "C", "G", "F", "E"];

export default function Sort() {
  const [state, dispatch] = React.useReducer(reducer, tempItems, init);
  const { status } = state;

  const comparison = status.done ? null : status.comparison;

  return (
    <Main>
      <Header>
        <Brand />
      </Header>
      <Page>
        {comparison && (
          <>
            <H1>What&apos;s Better?</H1>
            <SideBySideButtons>
              <Button
                onClick={() =>
                  dispatch({ type: "update", larger: comparison.a })
                }
              >
                {comparison.a}
              </Button>
              <Button
                onClick={() =>
                  dispatch({ type: "update", larger: comparison.b })
                }
              >
                {comparison.b}
              </Button>
            </SideBySideButtons>
          </>
        )}
        <div>
          {status.sorted.map((item) => (
            <ListItem key={item}>
              <strong>{item}</strong>
            </ListItem>
          ))}
          {status.progress.map((item) => (
            <ListItem key={item}>{item}</ListItem>
          ))}
        </div>
      </Page>
    </Main>
  );
}
