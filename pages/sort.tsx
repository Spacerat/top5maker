import Link from "next/link";
import styled from "styled-components";
import { AddForm } from "../components/AddItemInput";
import { Brand } from "../components/Brand";
import { Button, FullMobileSecondaryButton } from "../components/Button";
import { RedoItemButton, RemoveItemButton } from "../components/IconButtons";
import { Header, Main, Page, Paper } from "../components/layout";
import { ListItem } from "../components/List";
import { H1, H3, PrimaryLink } from "../components/text";
import { SortAppState, useSortState } from "./useSortState";

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

const Again = styled.div`
  text-align: center;
`;

function ItemList({
  header,
  items,
  onRemove,
  onClear,
}: {
  header: React.ReactNode;
  items: readonly string[];
  onRemove: (item: string) => void;
  onClear: (item: string) => void;
}) {
  const actions = (item: string) => (
    <>
      <RedoItemButton item={item} onClick={onClear} />
      <RemoveItemButton item={item} onClick={onRemove} />
    </>
  );

  if (items.length === 0) return null;
  return (
    <>
      {header}
      <Paper>
        {items.map((item) => (
          <ListItem key={item} actions={actions(item)}>
            {item}
          </ListItem>
        ))}
      </Paper>
    </>
  );
}

function SortLayout({ state }: { state: SortAppState }) {
  const { pick, status, addItem, removeItem, clearCache, canUndo, undo } =
    state;
  if (status.done) {
    return null;
  }

  const { a, b } = status.comparison;

  return (
    <Page>
      <H1>What&apos;s Better?</H1>
      <SideBySideButtons>
        <Button onClick={() => pick(a)}>{a}</Button>
        <Button onClick={() => pick(b)}>{b}</Button>
      </SideBySideButtons>
      {canUndo && (
        <FullMobileSecondaryButton onClick={undo}>
          Undo
        </FullMobileSecondaryButton>
      )}
      <ItemList
        header={<H3>Sorted items (best to worst)</H3>}
        items={status.sorted}
        onClear={clearCache}
        onRemove={removeItem}
      />
      <ItemList
        header={<H3>Unsorted items</H3>}
        items={status.progress}
        onClear={clearCache}
        onRemove={removeItem}
      />
      <H3>Add another item</H3>
      <AddForm onAddItem={addItem} />
    </Page>
  );
}

function DoneLayout({ state }: { state: SortAppState }) {
  const {
    status,
    addItem,
    removeItem,
    clearCache,
    canUndo,
    restartLink,
    undo,
    isReady,
  } = state;
  if (!status.done || !isReady) {
    return null;
  }

  return (
    <>
      <Page>
        <ItemList
          header={<H1>Here&apos;s your list, sorted best first</H1>}
          items={status.sorted}
          onClear={clearCache}
          onRemove={removeItem}
        />
        <ItemList
          header={<H3>Unsorted items</H3>}
          items={status.progress}
          onClear={clearCache}
          onRemove={removeItem}
        />
      </Page>
      <Page kind="darker">
        <H3>Add another item</H3>
        <AddForm onAddItem={addItem} />
        {canUndo && (
          <FullMobileSecondaryButton onClick={undo}>
            Undo
          </FullMobileSecondaryButton>
        )}
        <Again>
          <Link href={restartLink} passHref>
            <PrimaryLink>Re-sort this list</PrimaryLink>
          </Link>
        </Again>
        <Again>
          <Link passHref href="/">
            <PrimaryLink>Sort something else</PrimaryLink>
          </Link>
        </Again>
      </Page>
    </>
  );
}

export default function Sort() {
  const state = useSortState();

  return (
    <Main>
      <Header>
        <Brand />
      </Header>
      {state.status.done ? (
        <DoneLayout state={state} />
      ) : (
        <SortLayout state={state} />
      )}
    </Main>
  );
}
