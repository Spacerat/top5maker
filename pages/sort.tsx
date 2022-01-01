import { castDraft, produce } from "immer";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { AddForm } from "../components/AddForm";
import { Brand } from "../components/Brand";
import { Button, SecondaryButton } from "../components/Button";
import { Header, Main, Page } from "../components/layout";
import { ListItem } from "../components/ListItem";
import { Bold, H1, H3 } from "../components/text";
import { TextButton } from "../components/TextButton";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";
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
  items: readonly string[];
  prevState: State | null;
};

type Action =
  | { type: "update"; larger: string }
  | { type: "undo" }
  | { type: "setItems"; items: readonly string[] };

function init(items: string[]): State {
  const cache = initCache();
  return {
    cache,
    status: heapsort(cache, items),
    items,
    prevState: null,
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

function reducer(state: State, action: Action): State {
  if (action.type === "undo" && state.prevState !== null) {
    return state.prevState;
  }
  return produce(state, (s) => {
    const status = s.status;
    switch (action.type) {
      case "update":
        if (status.done) return;
        const larger = action.larger;
        const { a, b } = status.comparison;
        const smaller = larger === a ? b : a;
        s.cache = cacheWithUpdate(s.cache, { larger, smaller });
        s.status = swapComparison(s.status, heapsort(s.cache, s.items));
        s.prevState = castDraft(state);
        return;
      case "setItems":
        s.items = castDraft(action.items);
        s.status = heapsort(s.cache, s.items);
        if (state.items.length > 0) {
          // Replace history if there were no items before
          s.prevState = castDraft(state);
        }
        return;
    }
  });
}

function useQueryItems() {
  const {
    query: { items },
  } = useRouter();
  return React.useMemo(() => {
    const queryItems = items;
    if (typeof queryItems === "string") {
      return { items: deserializeItems(queryItems) };
    }
    return { items: [] };
  }, [items]);
}

export default function Sort() {
  const { items } = useQueryItems();

  const [state, dispatch] = React.useReducer(reducer, items, init);

  React.useEffect(() => {
    dispatch({ type: "setItems", items });
  }, [items]);

  const { status } = state;

  const { a, b } = status.done ? { a: null, b: null } : status.comparison;

  const addItem = React.useCallback(
    (name: string) => {
      dispatch({ type: "setItems", items: stringSetAdd(state.items, name) });
    },
    [state.items]
  );

  const removeItem = (name: string) => {
    dispatch({ type: "setItems", items: stringSetRemove(state.items, name) });
  };

  //   const serializedCache = React.useMemo(
  //     () => serializeCache(state.items, state.cache),
  //     [state.items, state.cache]
  //   );

  //   const { replace, query } = useRouter();
  //   React.useEffect(() => {
  //     if (serializedCache !== "" && serializedCache !== query["cache"]) {
  //       replace({
  //         pathname: "sort",
  //         query: { items: query.items, cache: serializedCache },
  //       });
  //     }
  //   }, [serializedCache, replace, query]);

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
        {state.prevState !== null && (
          <SecondaryButton
            onClick={() => {
              dispatch({ type: "undo" });
            }}
          >
            Undo
          </SecondaryButton>
        )}
        {status.sorted.length > 0 && (
          <>
            <H3>Sorted items</H3>
            <div>
              {status.sorted.map((item) => (
                <ListItem
                  key={item}
                  actions={
                    <TextButton
                      value={item}
                      onClick={() => removeItem(item)}
                      aria-label={`Remove item: ${item}`}
                    >
                      ✖
                    </TextButton>
                  }
                >
                  <Bold>{item}</Bold>
                </ListItem>
              ))}
            </div>
          </>
        )}
        {status.progress.length > 0 && (
          <>
            <H3>Unsorted items</H3>
            <div>
              {status.progress.map((item) => (
                <ListItem
                  key={item}
                  actions={
                    <TextButton
                      value={item}
                      onClick={() => removeItem(item)}
                      aria-label={`Remove item: ${item}`}
                    >
                      ✖
                    </TextButton>
                  }
                >
                  {item}
                </ListItem>
              ))}
            </div>
          </>
        )}
        <H3>Add extra item</H3>
        <AddForm onAddItem={addItem} />
      </Page>
    </Main>
  );
}
