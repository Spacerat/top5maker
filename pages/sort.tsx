import Head from "next/head";
import Link from "next/link";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import styled from "styled-components";
import { SortAppState, useSortState } from "../app/useSortState";
import { AddForm } from "../components/AddItemInput";
import { Brand } from "../components/Brand";
import { Button, FullMobileSecondaryButton } from "../components/Button";
import { Header, Main, Page } from "../components/layout";
import { ItemList } from "../components/List";
import { NativeShareButton } from "../components/NativeShareButton";
import { H1, H3 } from "../components/text";

const SideBySideButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  & button {
    flex: 1;
    min-height: 160px;
    height: initial;
    padding: 16px;
    ${({ theme }) => theme.shadows.primary}
  }
`;

const Again = styled.div`
  text-align: center;
`;

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
        {canUndo && (
          <FullMobileSecondaryButton onClick={undo}>
            Undo
          </FullMobileSecondaryButton>
        )}
        <H3>Share this list</H3>
        <SharePanel sorted={status.sorted} />
      </Page>
      <Page kind="darker">
        <H3>Add another item</H3>
        <AddForm onAddItem={addItem} />

        <Again>
          <Link href={restartLink} passHref>
            Re-sort this list
          </Link>
        </Again>
        <Again>
          <Link passHref href="/">
            Start over
          </Link>
        </Again>
      </Page>
    </>
  );
}

function SharePanel({ sorted }: { sorted: readonly string[] }) {
  const top3 = sorted.slice(0, 3).join(" > ");

  // TODO: any way for me to track shares?
  // Add something to the URL?

  const message = `${top3}! Here's the full list:`;
  const url = window.location.href;

  return (
    <div>
      <TwitterShareButton url={url} title={message}>
        <TwitterIcon />
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={message}>
        <FacebookIcon />
      </FacebookShareButton>
      <WhatsappShareButton url={url} title={message}>
        <WhatsappIcon />
      </WhatsappShareButton>
      <TelegramShareButton url={url} title={message}>
        <TelegramIcon />
      </TelegramShareButton>
      <NativeShareButton url={url} text={message} />
    </div>
  );
}

export default function Sort() {
  const state = useSortState();

  return (
    <>
      <Head>
        <title>{state.status.done ? "Results" : "Sorting"} - Sort Star</title>
      </Head>
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
    </>
  );
}
