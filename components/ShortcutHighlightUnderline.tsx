import styled from "styled-components";

export const ShortcutHighlightUnderline = styled.div`
  display: contents;
  & u {
    text-decoration: none;
  }
  @media (hover: hover) {
    &:hover u {
      text-decoration: underline;
    }
  }
`;
