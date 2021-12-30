import styled from "styled-components";

const HeaderContainer = styled.header`
  color: ${({ theme }) => theme.colors.primary4};
  padding-left: 20px;
  padding-right: 20px;
  background-color: ${({ theme }) => theme.colors.primary1};
  background: ${({ theme }) => theme.colors.primaryGradient};
  ${({ theme }) => theme.shadows.primary}
`;

const PageContainer = styled.div`
  max-width: ${({ theme }) => theme.size.pageWidth};
  margin-left: auto;
  margin-right: auto;
`;

const BodyContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const BodyContainerInner = styled.div`
  max-width: ${({ theme }) => theme.size.pageWidth};
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  padding-top: 40px;
  gap: 24px;
`;

export const Main = styled.div`
  background-color: ${({ theme }) => theme.colors.primary4};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export function Header({ children }: React.PropsWithChildren<unknown>) {
  return (
    <HeaderContainer>
      <PageContainer>{children}</PageContainer>
    </HeaderContainer>
  );
}

export function Page({ children }: React.PropsWithChildren<unknown>) {
  return (
    <BodyContainer>
      <BodyContainerInner>{children}</BodyContainerInner>
    </BodyContainer>
  );
}
