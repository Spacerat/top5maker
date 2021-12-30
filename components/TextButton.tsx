import styled from "styled-components";

export const TextButton = styled.button`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-family: ${({ theme }) => theme.fonts.roboto};
  font-weight: 500;
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: ${({ theme }) => theme.border.radius};
  border: 1px ${({ theme }) => theme.colors.primary1} solid;
  color: transparent;
  // Mobile-chrome workaround - not all unicode can be coloured
  text-shadow: 0 0 0 ${({ theme }) => theme.colors.primary1};
  background: none;
  border: none;

  &:hover {
    text-shadow: 0 0 0 ${({ theme }) => theme.colors.primary2};
  }
  &:active {
    text-shadow: 0 0 0 ${({ theme }) => theme.colors.primaryPressed};
  }
  &:focus-visible {
    outline: 1px ${({ theme }) => theme.colors.primary1} solid;
  }
  &:disabled {
    text-shadow: 0 0 0 ${({ theme }) => theme.colors.primary3};
  }
`;
