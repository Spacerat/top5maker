import styled from "styled-components";

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 320px;
`;

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

const HeaderContent = styled(PageContainer)`
  display: flex;
  flex-wrap: wrap;
  column-gap: 40px;
  row-gap: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

export function Header({ children }: React.PropsWithChildren<unknown>) {
  return (
    <HeaderContainer>
      <HeaderContent>{children}</HeaderContent>
    </HeaderContainer>
  );
}

type PageProps = { kind?: "main" | "darker" };

const MainSectionContainer = styled.div<PageProps>`
  display: flex;
  justify-content: center;
  flex-direction: row;
  background-color: ${({ theme, kind = "main" }) =>
    kind === "main" ? theme.colors.primary4 : theme.colors.primary4plus};
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
`;

const FooterSectionContainer = styled.footer`
  display: flex;
  justify-content: center;
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.primary4plusplus};
  color: ${({ theme }) => theme.colors.gray2};
`;

const PageSection = styled.div`
  max-width: ${({ theme }) => theme.size.pageWidth};
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 24px;
  padding-bottom: 24px;
  gap: 24px;
`;

export function Page({ children, kind }: React.PropsWithChildren<PageProps>) {
  return (
    <MainSectionContainer kind={kind}>
      <PageSection>{children}</PageSection>
    </MainSectionContainer>
  );
}

export function FooterSection({
  children,
}: React.PropsWithChildren<PageProps>) {
  return (
    <FooterSectionContainer>
      <PageSection>{children}</PageSection>
    </FooterSectionContainer>
  );
}

type PaperProps = {
  height?: "high" | "low" | "none";
};

export const Paper = styled.div<PaperProps>`
  background-color: ${({ theme }) => theme.colors.page};
  ${({ theme, height = "none" }) => theme.shadows.paper[height]};
  border-radius: ${({ theme }) => theme.border.radius};
`;

export const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 24px;
  row-gap: 24px;
`;

export const Card = styled(Paper)`
  padding: 24px;
  min-width: 250px;
  flex: 1;
`;
