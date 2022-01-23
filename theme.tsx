import { css } from "styled-components";

export const theme = {
  colors: {
    // Primary theme colors
    primary1: "hsl(328, 80%, 50%)",
    primary2: "hsl(328, 80%, 70%)",
    primary3: "hsl(328, 70%, 85%)",
    primary4plusplus: "hsl(328, 70%, 93%)",
    primary4plus: "hsl(328, 70%, 96%)",
    primary4: "hsl(328, 70%, 99%)",
    primaryDark: "hsl(328, 80%, 20%)",

    // Primary control colors
    primaryHover: "hsl(328, 80%, 47%)",
    primaryPressed: "hsl(328, 80%, 44%)",
    primary4Hover: "hsl(328, 70%, 98%)",
    primary4Pressed: "hsl(328, 70%, 97%)",

    // Secondary
    secondaryLight: "hsl(58, 80%, 70%)",

    // Link
    link: "hsl(223, 60, 50%)",
    linkVisited: "hsl(295, 60, 50%)",

    // Gradients
    primaryGradient:
      "linear-gradient(172.38deg, #e61a86 36.31%, #e0529e 115.99%), #e51986;",

    // Grays
    gray1: "hsl(240, 25%, 35%)",
    gray2: "hsl(240, 15%, 50%)",
    gray3: "hsl(240, 5%, 72%)",
    page: "white",
  },

  shadows: {
    primary: {
      filter: "drop-shadow(0px 4px 3px rgba(182, 20, 106, 0.25));",
    },
    paper: {
      high: {
        filter: "drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.15));",
      },
      low: {
        filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.10));",
      },
      none: {},
    },
  },

  size: {
    pageWidth: "880px",
  },

  typography: {
    body: {
      fontSize: "18px",
    },
  },

  border: {
    radius: "8px",
  },

  fonts: {
    nunito: "Nunito, sans-serif",
    roboto: "Roboto, sans-serif",
  },
} as const;

export const globalStyle = css`
  body {
    font-family: ${({ theme }) => theme.fonts.roboto};
    font-weight: 400;
    font-size: ${({ theme }) => theme.typography.body.fontSize};
    color: ${({ theme }) => theme.colors.gray1};
    background-color: ${({ theme }) => theme.colors.primary4plusplus};
  }

  a {
    color: ${({ theme }) => theme.colors.link};
  }

  a:visited {
    color: ${({ theme }) => theme.colors.linkVisited};
  }

  ul {
    margin-bottom: 0;
  }
`;

export type ThemeType = typeof theme;
