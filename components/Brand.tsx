import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { H1, H2, NoStyleAnchor } from "./text";

const AccentText = styled.span`
  color: ${({ theme }) => theme.colors.secondaryLight};
`;

export const Brand = () => (
  <Link href="/" passHref>
    <NoStyleAnchor>
      <H2>Sort Hero</H2>
    </NoStyleAnchor>
  </Link>
);
const ImageContainer = styled.div`
  align-self: center;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

export function TagLine() {
  return (
    <>
      <H1>
        Sort <AccentText>anything</AccentText> from best to worst.
      </H1>
      <ImageContainer>
        <Image src="/Illustration.png" width="226" height="124" alt="" />
      </ImageContainer>
    </>
  );
}
