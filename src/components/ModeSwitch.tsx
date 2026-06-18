import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { IconButton, Tooltip, useTheme as useMuiTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useThemeStore } from "../store/themeStore";

export default function ModeSwitch() {
  const muiTheme = useMuiTheme();
  const { t } = useTranslation();

  const toggleMode = useThemeStore((state) => state.toggleMode);

  const isDark = muiTheme.palette.mode === "dark";

  return (
    <Tooltip title={isDark ? t("settings.theme.light") : t("settings.theme.dark")}>
      <IconButton color="warning" onClick={toggleMode}>
        {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}
