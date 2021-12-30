import "styled-components";
import { ThemeType } from "./pages/_app";

// Reconfigure Styled's theme type to match our declared theme
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
