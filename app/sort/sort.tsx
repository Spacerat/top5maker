"use client";

import { AddForm } from "@/components/AddItemInput";
import { Button, FullMobileButton } from "@/components/Button";
import { ItemList } from "@/components/List";
import { NativeShareButton } from "@/components/NativeShareButton";
import { SideBySideButtons } from "@/components/SideBySideButtons";
import { Page } from "@/components/layout";
import { H1, H3 } from "@/components/text";
import { SortStatus } from "@/lib//interruptibleSort";
import { SortAppState, useSortState } from "@/sortState/useSortState";
import Head from "next/head";
import Link from "next/link";
import React, { ProgressHTMLAttributes, useEffect } from "react";
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
import styles from "./sort.module.css";
import { ident } from "@/utils/ident";

const Centered = ({ children }: React.PropsWithChildren) => (
  <div className={styles.centered}>{children}</div>
);

const FullWidthProgress = (
  props: ProgressHTMLAttributes<HTMLProgressElement>
) => <progress className={styles.fullWidthProgress} {...props} />;

function ProgressBar({ value }: { value: number }) {
  const percentage = value * 100;
  return (
    <FullWidthProgress value={percentage} max="100" aria-label="Sort Progress">
      {percentage}%
    </FullWidthProgress>
  );
}

export function LoadingLayout() {
  return (
    <Page>
      <ProgressBar value={0} />
      <H1>{"What's Better?"}</H1>
      <SideBySideButtons>
        <Button></Button>
        <Button></Button>
      </SideBySideButtons>
    </Page>
  );
}

function SortLayout({ state }: { state: SortAppState }) {
  const {
    pick,
    status,
    addItems,
    removeItem,
    clearCache,
    insertBelow,
    undo,
    progress,
  } = state;

  useKeyboardSupport({ status, undo, pick });

  if (status.done) {
    return null;
  }

  const { a, b } = status.comparison;

  return (
    <Page>
      <ProgressBar value={progress} />
      <H1>{"What's Better?"}</H1>
      <SideBySideButtons>
        <Button onClick={() => pick(a)}>{a}</Button>
        <Button onClick={() => pick(b)}>{b}</Button>
      </SideBySideButtons>
      <UndoButton undo={undo} />
      <ItemList
        header={<H3>Fully sorted (best to worst)</H3>}
        getKey={ident}
        getName={ident}
        items={status.sorted}
        onClear={clearCache}
        onRemove={removeItem}
        onReorder={insertBelow}
      />
      <ItemList
        header={<H3>Partially sorted</H3>}
        getKey={ident}
        getName={ident}
        items={status.incompleteSorted}
        onRemove={removeItem}
        onClear={clearCache}
      />
      <ItemList
        header={<H3>Not sorted</H3>}
        getKey={ident}
        getName={ident}
        items={status.notSorted}
        onRemove={removeItem}
      />
      <H3>Add another item</H3>
      <AddForm onAddItems={addItems} />
    </Page>
  );
}

type UseKeyboardSupportProps = {
  status: SortStatus;
  undo?: null | undefined | (() => void);
  pick?: (larger: string) => void;
};

function useKeyboardSupport({ status, undo, pick }: UseKeyboardSupportProps) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") {
        return;
      }
      if (e.key === "ArrowLeft") {
        !status.done && pick && pick(status.comparison.a);
      } else if (e.key === "ArrowRight") {
        !status.done && pick && pick(status.comparison.b);
      } else if (e.key === "U" || e.key === "u") {
        undo && undo();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [pick, undo, status]);
}

function DoneLayout({ state }: { state: SortAppState }) {
  const {
    status,
    addItems,
    removeItem,
    clearCache,
    restartLink,
    insertBelow,
    undo,
    isReady,
  } = state;

  useKeyboardSupport({ status, undo });

  if (!status.done || !isReady) {
    return null;
  }

  return (
    <>
      <Page>
        <ItemList
          header={<H1>Here&apos;s your list, sorted best first</H1>}
          getKey={ident}
          getName={ident}
          items={status.sorted}
          onClear={clearCache}
          onRemove={removeItem}
          onReorder={insertBelow}
        />
        <UndoButton undo={undo} />
        <H3>Share this list</H3>
        <SharePanel sorted={status.sorted} />
      </Page>
      <Page kind="darker">
        <H3>Add another item</H3>
        <AddForm onAddItems={addItems} />

        <Centered>
          <Link href={restartLink} passHref>
            Re-sort this list
          </Link>
        </Centered>
        <Centered>
          <Link passHref href="/">
            Start over
          </Link>
        </Centered>
      </Page>
    </>
  );
}

function UndoButton({ undo }: { undo?: null | undefined | (() => void) }) {
  return undo ? (
    <FullMobileButton variant="secondary" onClick={undo}>
      Undo
    </FullMobileButton>
  ) : null;
}

function SharePanel({ sorted }: { sorted: readonly string[] }) {
  const top3 = sorted.slice(0, 3).join(" > ");

  // TODO: any way for me to track shares?
  // Add something to the URL?

  const message = `${top3}! Here's the full list:`;
  const url = window.location.href;

  return (
    <div>
      <TwitterShareButton url={url} title={message} hashtags={["sortstar"]}>
        <TwitterIcon />
      </TwitterShareButton>
      <FacebookShareButton url={url} title={message} hashtag="sortstar">
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

export function Sorter() {
  const state = useSortState();

  if (!state.isReady) {
    return <LoadingLayout />;
  }

  return (
    <>
      <Head>
        <title>
          {`${
            state.isReady && state.status.done ? "Results" : "Sorting"
          } - Sort Star`}
        </title>
      </Head>

      {state.status.done ? (
        <DoneLayout state={state} />
      ) : (
        <SortLayout state={state} />
      )}
    </>
  );
}
