import { castDraft, produce } from "immer";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { AddForm } from "../components/AddItemInput";
import { Brand } from "../components/Brand";
import { Button, SecondaryButton } from "../components/Button";
import { RedoItemButton, RemoveItemButton } from "../components/IconButtons";
import { Header, Main, Page, Paper } from "../components/layout";
import { ListItem } from "../components/List";
import { H1, H3 } from "../components/text";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";
import {
  cacheWithUpdate,
  heapsort,
  initCache,
  SortCache,
  SortStatus,
} from "../lib/interruptibleSort";
import { withRemovedNode } from "../lib/interruptibleSort/graph";
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
  | { type: "setItems"; items: readonly string[] }
  | { type: "addItem"; item: string }
  | { type: "removeItem"; item: string }
  | { type: "clearCache"; item: string };

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
      case "addItem":
        s.items = castDraft(stringSetAdd(s.items, action.item));
        s.status = heapsort(s.cache, s.items);
        s.prevState = castDraft(state);
        return;
      case "removeItem":
        s.items = castDraft(stringSetRemove(s.items, action.item));
        s.status = heapsort(s.cache, s.items);
        s.prevState = castDraft(state);
        return;
      case "clearCache":
        s.cache = withRemovedNode(s.cache, action.item);
        s.status = heapsort(s.cache, s.items);
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

  const addItem = React.useCallback((name: string) => {
    dispatch({ type: "addItem", item: name });
  }, []);

  const removeItem = React.useCallback((name: string) => {
    dispatch({ type: "removeItem", item: name });
  }, []);

  const clearCache = React.useCallback((name: string) => {
    dispatch({ type: "clearCache", item: name });
  }, []);

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

  const done = !(a && b);

  const undo = (
    <SecondaryButton
      onClick={() => {
        dispatch({ type: "undo" });
      }}
    >
      Undo
    </SecondaryButton>
  );

  const actions = (item: string) => (
    <>
      <RedoItemButton item={item} onClick={clearCache} />
      <RemoveItemButton item={item} onClick={removeItem} />
    </>
  );

  return (
    <Main>
      <Header>
        <Brand />
      </Header>
      <Page>
        {!done && (
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
        {done && (
          <>
            <H1>Here are your items from best to worst</H1>
          </>
        )}
        {!done && state.prevState !== null && undo}
        {status.sorted.length > 0 && (
          <>
            {!done && <H3>Sorted items (best to worst)</H3>}
            <Paper>
              {status.sorted.map((item) => (
                <ListItem key={item} actions={actions(item)}>
                  {item}
                </ListItem>
              ))}
            </Paper>
          </>
        )}
        {status.progress.length > 0 && (
          <>
            <H3>Unsorted items</H3>
            <Paper>
              {status.progress.map((item) => (
                <ListItem key={item} actions={actions(item)}>
                  {item}
                </ListItem>
              ))}
            </Paper>
          </>
        )}
        {done && state.prevState !== null && undo}
        <H3>Add another item</H3>
        <AddForm onAddItem={addItem} />
      </Page>
    </Main>
  );
}
