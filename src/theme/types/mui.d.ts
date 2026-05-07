import type { AppPaletteTokens } from "../config/palettes";

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      tokens?: AppPaletteTokens;
      sidebar: string;
      surface: string;
      surfaceAlt: string;
      cardBorder: string;
      hover: string;
      selected: string;
      shadow: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      tokens?: AppPaletteTokens;
      sidebar: string;
      surface: string;
      surfaceAlt: string;
      cardBorder: string;
      hover: string;
      selected: string;
      shadow: string;
    };
  }
}
