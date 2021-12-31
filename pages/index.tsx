import styled from "styled-components";
import { H1, H3 } from "../components/text";
import Image from "next/image";
import React from "react";
import { Main, Header, Page } from "../components/layout";
import { Brand } from "../components/Brand";
import { TextInput } from "../components/TextInput";
import { Button, FullMobileButton } from "../components/Button";
import { TextButton } from "../components/TextButton";
import { ListItem } from "../components/ListItem";
import Link from "next/link";
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

const FormLine = styled.form`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

type AddFormProps = {
  onAddItem: (name: string) => void;
};

function AddForm({ onAddItem }: AddFormProps) {
  const [value, setValue] = React.useState("");

  const textRef = React.useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    (e) => {
      console.log(value);
      e.preventDefault();
      onAddItem(value);
      setValue("");
      textRef.current?.focus();
      return false;
    },
    [onAddItem, value]
  );

  return (
    <FormLine onSubmit={onSubmit}>
      <TextInput
        type="text"
        placeholder="Enter a name here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={textRef}
      />
      <Button type="submit" disabled={value.length === 0}>
        Add
      </Button>
    </FormLine>
  );
}

function SetupItems() {
  // TODO: proper app state management
  const [items, setItems] = React.useState<readonly string[]>([]);

  const addItem = React.useCallback((name: string) => {
    setItems((curItems) => {
      if (!curItems.includes(name)) {
        return [...curItems, name];
      }
      return curItems;
    });
  }, []);

  const removeItem = (name: string) => {
    setItems((curItems) => {
      if (curItems.includes(name)) {
        return curItems.filter((x) => x !== name);
      }
      return curItems;
    });
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
