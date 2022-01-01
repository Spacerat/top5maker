import Image from "next/image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { AddForm } from "../components/AddForm";
import { Brand } from "../components/Brand";
import { FullMobileButton } from "../components/Button";
import { Header, Main, Page } from "../components/layout";
import { ListItem } from "../components/ListItem";
import { H1, H3 } from "../components/text";
import { TextButton } from "../components/TextButton";
import { stringSetAdd, stringSetRemove } from "../lib/immutableStringSet";
import { serializeItems } from "../lib/serialization";

const AccentText = styled.span`
  color: ${({ theme }) => theme.colors.secondaryLight};
`;

const ImageContainer = styled.div`
  align-self: center;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

function Tagline() {
  return (
    <>
      <H1>
        The quickest way to make a list of the best{" "}
        <AccentText>anything</AccentText>
      </H1>
      <ImageContainer>
        <Image src="/Illustration.png" width="226" height="124" alt="" />
      </ImageContainer>
    </>
  );
}

function SetupItems() {
  // TODO: proper app state management
  const [items, setItems] = React.useState<readonly string[]>([]);

  const addItem = React.useCallback((name: string) => {
    setItems((curItems) => stringSetAdd(curItems, name));
  }, []);

  const removeItem = (name: string) => {
    setItems((curItems) => stringSetRemove(curItems, name));
  };

  const itemsUrl = React.useMemo(
    () => (items.length > 2 ? serializeItems(items) : ""),
    [items]
  );

  return (
    <>
      <H3>Add three or more items to get started</H3>
      {items.length > 0 && (
        <div>
          {items.map((item) => (
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
      )}
      <AddForm onAddItem={addItem} />
      <Link passHref href={`/sort?items=${itemsUrl}`}>
        <FullMobileButton disabled={items.length < 3}>
          Start Sorting
        </FullMobileButton>
      </Link>
    </>
  );
}

export default function Home() {
  return (
    <Main>
      <Header>
        <Brand />
        <Tagline />
      </Header>
      <Page>
        <SetupItems />
      </Page>
    </Main>
  );
}
