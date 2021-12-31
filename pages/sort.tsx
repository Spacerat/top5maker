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

export default function Sort() {
  return (
    <Main>
      <Header>
        <Brand />
      </Header>
      <Page>
        <H1>What's Better?</H1>
        <SideBySideButtons>
          <Button>Mac and Cheese with Mozzerella</Button>
          <Button>Pizza</Button>
        </SideBySideButtons>
      </Page>
    </Main>
  );
}
