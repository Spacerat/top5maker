import styled from "styled-components";

const BaseButton = styled.button`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-family: ${({ theme }) => theme.fonts.roboto};
  font-weight: 500;
  padding-left: 18px;
  padding-right: 18px;
  border-radius: ${({ theme }) => theme.border.radius};
  height: 40px;
`;

export const Button = styled(BaseButton)`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-family: ${({ theme }) => theme.fonts.roboto};
  font-weight: 500;
  padding-left: 18px;
  padding-right: 18px;
  border-radius: ${({ theme }) => theme.border.radius};
  border: 1px ${({ theme }) => theme.colors.primary1} solid;
  color: ${({ theme }) => theme.colors.primary4};
  background-color: ${({ theme }) => theme.colors.primary1};
  height: 40px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    border: 1px ${({ theme }) => theme.colors.primaryHover} solid;
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.primaryPressed};
    border: 1px ${({ theme }) => theme.colors.primaryPressed} solid;
  }
  &:focus-visible {
    outline: 1px ${({ theme }) => theme.colors.primaryDark} solid;
    border: 1px ${({ theme }) => theme.colors.primaryDark} solid;
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.primary3};
    border: 1px ${({ theme }) => theme.colors.primary3} solid;
  }
`;

export const SecondaryButton = styled(BaseButton)`
  border: 1px ${({ theme }) => theme.colors.primary1} solid;
  color: ${({ theme }) => theme.colors.primary1};
  background-color: ${({ theme }) => theme.colors.primary4};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary4Hover};
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.primary4Pressed};
  }
  &:focus-visible {
    outline: 1px ${({ theme }) => theme.colors.primaryDark} solid;
    border: 1px ${({ theme }) => theme.colors.primaryDark} solid;
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.primary3};
    border: 1px ${({ theme }) => theme.colors.primary3} solid;
  }
`;

export const FullMobileButton = styled(Button)`
  width: 100%;
  max-width: 350px;
  align-self: center;
`;

export const FullMobileSecondaryButton = styled(SecondaryButton)`
  width: 100%;
  max-width: 350px;
  align-self: center;
`;
