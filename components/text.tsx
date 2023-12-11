import styled from "styled-components";
import Link from "next/link";

export const H1 = styled.h1`
  font-family: ${({ theme }) => theme.fonts.nunito};
  font-size: 27px;
  font-weight: 400;
  margin: 0;
`;

export const H2 = styled.h2`
  font-family: ${({ theme }) => theme.fonts.nunito};
  font-size: 34px;
  font-weight: 700;
  margin: 0;
  margin-top: 24px;
  line-height: 38px;
`;

export const NoColorAnchor = styled.a`
  color: inherit;
`;

export const NoStyleLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

export const H3 = styled.h3`
  font-weight: 500;
  margin: 0;
`;
