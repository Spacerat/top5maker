import Image from "next/image";
import { FooterSection } from "./layout";
import { H2, BrandLink, Text } from "./text";

import styles from "./Brand.module.css";

export const Brand = () => (
  <BrandLink href="/" passHref>
    Sort Star
  </BrandLink>
);

export const ProBrand = () => (
  <BrandLink href="/pro" passHref>
    Sort Star <Text color="secondaryLight">Pro</Text>
  </BrandLink>
);

export const TagLine = () => (
  <H2>
    Sort <Text color="secondaryLight">anything</Text> from best to worst.
  </H2>
);

export const Illustration = () => (
  <div className={styles.imageContainer}>
    <Image src="/Illustration.svg" width="226" height="124" alt="" />
  </div>
);

export const Footer = () => (
  <FooterSection>
    <small>
      Website &copy; Copyright 2022{" "}
      <a href="https://veryjoe.com">Joseph Atkins-Turkish</a>
    </small>
  </FooterSection>
);
