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

type PageProps = { kind?: "main" | "darker" };

const BodyContainer = styled.div<PageProps>`
  flex: 1;
  background-color: ${({ theme, kind = "main" }) =>
    kind === "main" ? theme.colors.primary4 : theme.colors.primary4darker};
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const PageSection = styled.div`
  max-width: ${({ theme }) => theme.size.pageWidth};
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  padding-top: 24px;
  padding-bottom: 24px;
  gap: 24px;
`;

export const Paper = styled.div`
  background-color: ${({ theme }) => theme.colors.page};
  ${({ theme }) => theme.shadows.page};
  border-radius: ${({ theme }) => theme.border.radius};
`;

export const Main = styled.div`
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

export function Page({ children, kind }: React.PropsWithChildren<PageProps>) {
  return (
    <BodyContainer kind={kind}>
      <PageSection>{children}</PageSection>
    </BodyContainer>
  );
}
