import "styled-components";
import { ThemeType } from "./theme";

// Reconfigure Styled's theme type to match our declared theme
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
