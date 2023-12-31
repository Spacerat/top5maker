import React from "react";
import styles from "./layout.module.css";
import { styled } from "./withStyle";

export const Main = styled.div(styles.main);

export const HeaderContent = styled.div(
  `${styles.pageContainer} ${styles.headerContent}`
);

export const HeaderContainer = styled.header(styles.headerContainer);

export function Header({ children }: React.PropsWithChildren) {
  return (
    <HeaderContainer>
      <HeaderContent>{children}</HeaderContent>
    </HeaderContainer>
  );
}

type KindProp = { kind?: "main" | "darker" };
type SlimProp = { slim?: boolean };
type PageProps = KindProp & SlimProp;

const kindClasses = {
  main: styles.kindMain,
  darker: styles.kindDarker,
};

export const MainSectionContainer = styled.div<KindProp>(
  ({ kind = "main" }) => `${styles.mainSectionContainer} ${kindClasses[kind]}`
);

const FooterSectionContainer = styled.footer(styles.footerSectionContainer);

export const PageSection = styled.div<SlimProp>(
  ({ slim = false }) =>
    `${styles.pageContainer} ${styles.pageSection} ${styles.section} ${
      slim ? styles.slim : ""
    }`
);

export function Page({
  children,
  kind,
  slim = false,
}: React.PropsWithChildren<PageProps>) {
  return (
    <MainSectionContainer kind={kind}>
      <PageSection slim={slim}>{children}</PageSection>
    </MainSectionContainer>
  );
}

export function FooterSection({ children }: React.PropsWithChildren) {
  return (
    <FooterSectionContainer>
      <PageSection>{children}</PageSection>
    </FooterSectionContainer>
  );
}

type Elevation = "high" | "low" | "none";
type PaperProps = {
  elevation?: Elevation;
};

export const CardGrid = styled.div(styles.cardGrid);

function getElevationClass(elevation: Elevation | undefined) {
  return elevation === "high"
    ? styles.elevationHigh
    : elevation === "low"
      ? styles.elevationLow
      : "";
}

export const Card = styled.div<PaperProps>(({ elevation }) => {
  const elevationClass = getElevationClass(elevation);
  return `${styles.paper} ${styles.card} ${styles.section} ${elevationClass}`;
});

export const Paper = styled.div<PaperProps>(({ elevation }) => {
  const elevationClass = getElevationClass(elevation);
  return `${styles.paper} ${elevationClass}`;
});
