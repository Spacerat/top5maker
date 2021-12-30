import { createGlobalStyle, ThemeProvider } from "styled-components";
import type { AppProps } from "next/app";
import { normalize } from "styled-normalize";
import { theme } from "../lib/theme";

const GlobalStyle = createGlobalStyle`
  ${normalize}
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
