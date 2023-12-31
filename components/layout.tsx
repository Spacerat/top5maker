import React from "react";
import styles from "./layout.module.css";

export const Main = ({ children }: React.PropsWithChildren) => (
  <div className={styles.main}>{children}</div>
);

const HeaderContainer = ({ children }: React.PropsWithChildren) => (
  <header className={styles.headerContainer}>{children}</header>
);

const HeaderContent = ({ children }: React.PropsWithChildren) => (
  <div className={`${styles.pageContainer} ${styles.headerContent}`}>
    {children}
  </div>
);

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

const MainSectionContainer = ({
  children,
  kind = "main",
}: React.PropsWithChildren<KindProp>) => {
  return (
    <div className={`${styles.mainSectionContainer} ${kindClasses[kind]} `}>
      {children}
    </div>
  );
};

const FooterSectionContainer = ({ children }: React.PropsWithChildren) => (
  <footer className={styles.footerSectionContainer}>{children}</footer>
);

const PageSection = ({ children, slim }: React.PropsWithChildren<SlimProp>) => (
  <div
    className={`
    ${styles.pageContainer}
    ${styles.pageSection}
    ${styles.section}
    ${slim ? styles.slim : ""}`}
  >
    {children}
  </div>
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

export const Paper = ({
  children,
  elevation,
}: React.PropsWithChildren<PaperProps>) => {
  const elevationClass = getElevationClass(elevation);
  return <div className={`${styles.paper} ${elevationClass}`}>{children}</div>;
};

export const CardGrid = ({ children }: React.PropsWithChildren) => (
  <div className={styles.cardGrid}>{children}</div>
);

export const Card = ({
  children,
  elevation,
}: React.PropsWithChildren<PaperProps>) => {
  const elevationClass = getElevationClass(elevation);
  return (
    <div
      className={`${styles.paper} ${styles.card} ${styles.section} ${elevationClass}`}
    >
      {children}
    </div>
  );
};

function getElevationClass(elevation: Elevation | undefined) {
  return elevation === "high"
    ? styles.elevationHigh
    : elevation === "low"
      ? styles.elevationLow
      : "";
}
