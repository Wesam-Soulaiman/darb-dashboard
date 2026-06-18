import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import {
  CssBaseline,
  GlobalStyles,
  StyledEngineProvider,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { useThemeStore } from "../store/themeStore";
import { createAppTheme } from "../theme/createAppTheme";

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const mode = useThemeStore((state) => state.mode);
  const paletteKey = useThemeStore((state) => state.paletteKey);
  const fontKey = useThemeStore((state) => state.fontKey);

  const { i18n } = useTranslation();

  const dir = i18n.language.startsWith("ar") ? "rtl" : "ltr";

  const appTheme = useMemo(
    () =>
      createAppTheme({
        mode,
        dir,
        paletteKey,
        fontKey,
      }),
    [mode, dir, paletteKey, fontKey],
  );

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [dir, i18n.language]);

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={appTheme}>
        <CssBaseline />

        <GlobalStyles
          styles={{
            "html, body, #root": {
              width: "100%",
              minHeight: "100%",
            },
            body: {
              backgroundColor: appTheme.palette.background.default,
            },
            "#root": {
              minHeight: "100vh",
            },
            ":fullscreen, :-ms-fullscreen, :-moz-full-screen, :-webkit-full-screen": {
              backgroundColor: appTheme.palette.background.default,
            },
            "#root:fullscreen": {
              height: "100%",
              overflowY: "auto",
            },
            "::selection": {
              backgroundColor: appTheme.palette.primary.main,
              color: appTheme.palette.primary.contrastText,
            },
          }}
        />

        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}
