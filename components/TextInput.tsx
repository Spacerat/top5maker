import styled from "styled-components";

export const TextInput = styled.input`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-family: ${({ theme }) => theme.fonts.roboto};
  border-radius: ${({ theme }) => theme.border.radius};
  border: 1px ${({ theme }) => theme.colors.primary2} solid;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 12px;

  &:focus-visible {
    border: 1px ${({ theme }) => theme.colors.primary1} solid;
    outline: 1px ${({ theme }) => theme.colors.primary1} solid;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray3};
  }
  flex: 1;
`;
