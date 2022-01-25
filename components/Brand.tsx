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
      <H1>Sort Star</H1>
    </NoStyleAnchor>
  </Link>
);
const ImageContainer = styled.div`
  align-self: center;
  display: flex;
  justify-content: center;
  flex: 1;
  min-width: 226px;
`;

export const TagLine = () => (
  <H2>
    Sort <AccentText>anything</AccentText> from best to worst.
  </H2>
);

export const Illustration = () => (
  <ImageContainer>
    <Image src="/Illustration.svg" width="226" height="124" alt="" />
  </ImageContainer>
);

export const Footer = () => (
  <FooterSection>
    <small>
      Website &copy; Copyright 2022{" "}
      <a href="https://veryjoe.com">Joseph Atkins-Turkish</a>
    </small>
  </FooterSection>
);
