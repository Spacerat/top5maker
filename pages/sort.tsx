import { produce } from "immer";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Brand } from "../components/Brand";
import { Button, SecondaryButton } from "../components/Button";
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
import { deserializeItems } from "../lib/serialization";

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

type Action =
  | { type: "update"; larger: string }
  | { type: "undo" }
  | { type: "setItems"; items: string[] };

function init(items: string[]): State {
  const cache = initCache();
  return {
    cache,
    status: heapsort(cache, items),
    items,
    history: [{}],
  };
}

function swapComparison(lastStatus: SortStatus, newStatus: SortStatus) {
  if (lastStatus.done || newStatus.done) {
    return newStatus;
  }
  if (
    lastStatus.comparison.a === newStatus.comparison.a ||
    lastStatus.comparison.b === newStatus.comparison.b
  ) {
    return produce(newStatus, (status) => {
      [status.comparison.a, status.comparison.b] = [
        status.comparison.b,
        status.comparison.a,
      ];
    });
  }
  return newStatus;
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
        s.status = swapComparison(s.status, heapsort(s.cache, s.items));
        return;
      case "setItems":
        s.items = action.items;
        s.status = heapsort(s.cache, s.items);
        return;
      case "undo":
        if (s.history.length >= 2) {
          const last = s.history.pop();
          if (last !== undefined) {
            s.cache = s.history[s.history.length - 1];
            s.status = swapComparison(s.status, heapsort(s.cache, s.items));
          }
        }
        return;
    }
  });
}

function useQueryState() {
  const { query } = useRouter();
  return React.useMemo(() => {
    const queryItems = query["items"];
    if (typeof queryItems === "string") {
      return { items: deserializeItems(queryItems) };
    }
    return { items: [] };
  }, [query]);
}

export default function Sort() {
  const { items } = useQueryState();

  const [state, dispatch] = React.useReducer(reducer, items, init);

  React.useEffect(() => {
    dispatch({ type: "setItems", items });
  }, [items]);

  const { status } = state;

  const { a, b } = status.done ? { a: null, b: null } : status.comparison;

  return (
    <Main>
      <Header>
        <Brand />
      </Header>
      <Page>
        {a && b && (
          <>
            <H1>What&apos;s Better?</H1>
            <SideBySideButtons>
              <Button onClick={() => dispatch({ type: "update", larger: a })}>
                {a}
              </Button>
              <Button onClick={() => dispatch({ type: "update", larger: b })}>
                {b}
              </Button>
            </SideBySideButtons>
          </>
        )}
        {state.history.length > 1 && (
          <SecondaryButton
            onClick={() => {
              dispatch({ type: "undo" });
            }}
          >
            Undo
          </SecondaryButton>
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
