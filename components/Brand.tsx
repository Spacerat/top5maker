import Image from "next/image";
import { FooterSection } from "./layout";
import { H2, BrandLink, Text } from "./text";

import styles from "./Brand.module.css";
import { twMerge } from "tailwind-merge";

export const Brand = () => (
  <div className="flex flex-row items-center gap-16">
    <BrandLink href="/" passHref>
      Sort Star
    </BrandLink>
  </div>
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
  <div className={twMerge(styles.imageContainer, "max-md:!hidden")}>
    <Image src="/Illustration.svg" width="226" height="124" alt="" priority />
  </div>
);

export const Footer = () => (
  <FooterSection>
    <small>
      Copyright &copy; 2022{" "}
      <a href="https://veryjoe.com">Joseph Atkins-Turkish</a>
    </small>
  </FooterSection>
);
