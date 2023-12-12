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

type PageProps = { kind?: "main" | "darker" };

const MainSectionContainer = ({
  children,
  kind,
}: React.PropsWithChildren<PageProps>) => {
  const kindClass = kind === "darker" ? styles.kindDarker : styles.kindMain;
  return (
    <div className={`${styles.mainSectionContainer} ${kindClass}`}>
      {children}
    </div>
  );
};

const FooterSectionContainer = ({ children }: React.PropsWithChildren) => (
  <footer className={styles.footerSectionContainer}>{children}</footer>
);

const PageSection = ({ children }: React.PropsWithChildren) => (
  <div className={`${styles.pageContainer} ${styles.pageSection}`}>
    {children}
  </div>
);

export function Page({ children, kind }: React.PropsWithChildren<PageProps>) {
  return (
    <MainSectionContainer kind={kind}>
      <PageSection>{children}</PageSection>
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
    <div className={`${styles.paper} ${styles.card} ${elevationClass}`}>
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
