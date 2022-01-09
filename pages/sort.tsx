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
import { H1, H3, PrimaryLink } from "../components/text";

const NativeShareIcon = () => (
  <svg width="64" height="64" viewBox="-4 -4 38 38">
    <rect x="-10" y="-10" width="64" height="64" fill={"#ccc"} />
    <path d="M4.01 10.99C1.795 10.99 0 12.786 0 15c0 2.215 1.795 4.01 4.01 4.01S8.02 17.215 8.02 15c0-2.214-1.795-4.01-4.01-4.01zm0 6.239c-1.229 0-2.228-1-2.228-2.229s.999-2.228 2.228-2.228 2.228.999 2.228 2.228-1 2.229-2.228 2.229zM15 10.99c-2.215 0-4.01 1.795-4.01 4.01s1.795 4.01 4.01 4.01 4.01-1.795 4.01-4.01c0-2.214-1.795-4.01-4.01-4.01zm0 6.239c-1.229 0-2.228-1-2.228-2.229s.999-2.228 2.228-2.228 2.229.999 2.229 2.228-1 2.229-2.229 2.229zM25.99 10.99c-2.215 0-4.01 1.795-4.01 4.01s1.795 4.01 4.01 4.01S30 17.215 30 15c0-2.214-1.795-4.01-4.01-4.01zm0 6.239c-1.229 0-2.227-1-2.227-2.229s.998-2.228 2.227-2.228 2.228.999 2.228 2.228-1 2.229-2.228 2.229z" />
  </svg>
);

const NoStyleButton = styled.button`
  border: none;
  padding: 0;
  cursor: pointer;
`;

function NativeShareButton({ url, text }: { url: string; text: string }) {
  if (!navigator.share) return null;
  if (!navigator.canShare({ url, text })) return null;
  return (
    <NoStyleButton
      onClick={() => {
        navigator.share({ url, text });
      }}
    >
      <NativeShareIcon />
    </NoStyleButton>
  );
}

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
        <H3>Share this list</H3>
        <SharePanel sorted={status.sorted} />
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
            <PrimaryLink>Start over</PrimaryLink>
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
