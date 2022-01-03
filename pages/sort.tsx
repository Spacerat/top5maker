import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { AddForm } from "../components/AddItemInput";
import { Brand } from "../components/Brand";
import { Button, FullMobileSecondaryButton } from "../components/Button";
import { RedoItemButton, RemoveItemButton } from "../components/IconButtons";
import { Header, Main, Page, Paper } from "../components/layout";
import { ListItem } from "../components/List";
import { A, H1, H3 } from "../components/text";
import {
  ActionTypes,
  decodeRecord,
  encodeInitial,
  encodeRecord,
  init,
  reducer,
} from "../controllers/sortReducer";
import { LOAD, UNDO, undoable, undoableInit } from "../lib/undoable";

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

function useQueryRecord() {
  const {
    query: { s },
  } = useRouter();

  const record = React.useMemo(() => {
    return decodeRecord(s);
  }, [s]);

  return { slug: s, record };
}

const Again = styled(A)`
  text-align: center;
`;

export default function Sort() {
  const { record: queryRecord, slug } = useQueryRecord();

  const [{ state, record }, dispatch] = React.useReducer(
    undoable(init, reducer),
    queryRecord,
    undoableInit(init, reducer)
  );

  const { replace, isReady: isRouterReady } = useRouter();

  React.useEffect(() => {
    if (record.length === 0 && queryRecord.length > 0) {
      dispatch({ type: LOAD, record: queryRecord });
    }
  }, [isRouterReady, queryRecord, record]);

  React.useEffect(() => {
    const newSlug = encodeRecord(record);
    if (record.length > 0 && isRouterReady && newSlug !== slug) {
      console.log("replace", slug, newSlug);
      replace({ query: { s: newSlug } }, undefined, {
        shallow: true,
      });
    }
  }, [slug, isRouterReady, record, replace]);

  const { status } = state;

  const { a, b } = status.done ? { a: null, b: null } : status.comparison;

  const addItem = React.useCallback((name: string) => {
    dispatch({ type: ActionTypes.ADD_ITEM, item: name });
  }, []);

  const removeItem = React.useCallback((name: string) => {
    dispatch({ type: ActionTypes.REMOVE_ITEM, item: name });
  }, []);

  const clearCache = React.useCallback((name: string) => {
    dispatch({ type: ActionTypes.CLEAR_CACHE, item: name });
  }, []);

  const done = isRouterReady && !(a && b);

  const itemsUrl = React.useMemo(
    () => (state.items.length > 2 ? encodeInitial(state.items) : ""),
    [state.items]
  );

  const undo = (
    <FullMobileSecondaryButton
      onClick={() => {
        dispatch({ type: UNDO });
      }}
    >
      Undo
    </FullMobileSecondaryButton>
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
              <Button
                onClick={() =>
                  dispatch({ type: ActionTypes.UPDATE, larger: "a" })
                }
              >
                {a}
              </Button>
              <Button
                onClick={() =>
                  dispatch({ type: ActionTypes.UPDATE, larger: "b" })
                }
              >
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
        {!done && record.length > 1 && undo}
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
        {done && record.length > 1 && (
          <>
            {undo}

            <Again href={`/sort?s=${itemsUrl}`}>Sort These Again</Again>
          </>
        )}
        <H3>Add another item</H3>
        <AddForm onAddItem={addItem} />
      </Page>
    </Main>
  );
}
