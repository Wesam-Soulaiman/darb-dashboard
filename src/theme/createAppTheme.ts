import { createTheme, type ThemeOptions } from "@mui/material/styles";
import { arSA, enUS } from "@mui/material/locale";

import { palettes, type PaletteKey } from "./config/palettes";
import { fontFamilies, type FontKey } from "./config/fonts";
import { typographyOverrides } from "./config/typography";
import { overrideComponents } from "./overrideComponents";

export interface ThemeCustomization {
  mode?: "dark" | "light";
  dir?: "ltr" | "rtl";
  paletteKey: PaletteKey;
  fontKey: FontKey;
}

export const createAppTheme = ({
  mode = "dark",
  dir = "rtl",
  paletteKey,
  fontKey,
}: ThemeCustomization) => {
  const isDark = mode === "dark";
  const colors = palettes[paletteKey](isDark);
  const isRtl = dir === "rtl";

  const themeOptions: ThemeOptions = {
    direction: dir,

    palette: {
      mode,
      ...colors,
    },

    shape: {
      borderRadius: 14,
    },

    spacing: 8,

    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
        easeIn: "cubic-bezier(0.4, 0, 1, 1)",
        sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
      },
    },

    typography: {
      ...typographyOverrides,
      fontFamily: isRtl ? fontFamilies[fontKey].ar : fontFamilies[fontKey].en,
      allVariants: {
        letterSpacing:
          fontKey === "orbitronAmiri" && !isRtl ? "0.04em" : "normal",
      },
    },

    components: overrideComponents,
  };

  return createTheme(themeOptions, isRtl ? arSA : enUS);
};
