export const theme = {
  colors: {
    // Primary theme colors
    primary1: "hsl(328, 80%, 50%)",
    primary2: "hsl(328, 80%, 70%)",
    primary3: "hsl(328, 70%, 85%)",
    primary4: "hsl(328, 70%, 99%)",
    primaryDark: "hsl(328, 80%, 20%)",

    // Primary control colors
    primaryHover: "hsl(328, 80%, 47%)",
    primaryPressed: "hsl(328, 80%, 44%)",
    primary4Hover: "hsl(328, 70%, 98%)",
    primary4Pressed: "hsl(328, 70%, 97%)",

    // Secondary
    secondaryLight: "hsl(58, 80%, 70%)",

    // Gradients
    primaryGradient:
      "linear-gradient(172.38deg, #e61a86 36.31%, #e0529e 115.99%), #e51986;",

    // Grays
    gray1: "hsl(240, 30%, 25%)",
    gray3: "hsl(240, 5%, 72%)",
  },

  shadows: {
    primary: {
      filter: "drop-shadow(0px 4px 3px rgba(182, 20, 106, 0.25));",
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

export type ThemeType = typeof theme;
