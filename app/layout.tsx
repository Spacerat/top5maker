import type { Metadata } from "next";
import { Roboto, Nunito } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import "react-tooltip/dist/react-tooltip.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--fontRoboto",
});
const nunito = Nunito({ subsets: ["latin"], variable: "--fontNunito" });

export const metadata: Metadata = {
  title: "Sort Star",
  description: `Sort anything with SortStar.app! Favourite superhero?
  Best holiday destination? Next restaurant trip? SortStar has you covered.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${roboto.variable}`}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <body>
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
