import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { FooterSection } from "./layout";
import { H1, H2, NoStyleAnchor } from "./text";

const AccentText = styled.span`
  color: ${({ theme }) => theme.colors.secondaryLight};
`;

export const Brand = () => (
  <Link href="/" passHref>
    <NoStyleAnchor tabIndex={-1}>
      <H2>Sort Star</H2>
    </NoStyleAnchor>
  </Link>
);
const ImageContainer = styled.div`
  align-self: center;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  flex: 1;
  min-width: 226px;
`;

const HeaderWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 40px;
`;

export function TagLine() {
  return (
    <HeaderWrap>
      <H1>
        Sort <AccentText>anything</AccentText> from best to worst.
      </H1>

      <ImageContainer>
        <Image src="/Illustration.svg" width="226" height="124" alt="" />
      </ImageContainer>
    </HeaderWrap>
  );
}

export function Footer() {
  return (
    <FooterSection>
      <small>
        Website &copy; Copyright 2022{" "}
        <a href="https://veryjoe.com">Joseph Atkins-Turkish</a>
      </small>
    </FooterSection>
  );
}
