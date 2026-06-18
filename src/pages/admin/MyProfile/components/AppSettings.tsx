import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
  useTheme as useMuiTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import MainCard from "../../../../components/MainCard";
import { useThemeStore } from "../../../../store/themeStore";
import type { FontKey } from "../../../../theme/config/fonts";
import type { PaletteKey } from "../../../../theme/config/palettes";

export default function AppSettings() {
  const { t, i18n } = useTranslation();
  const muiTheme = useMuiTheme();

  const mode = useThemeStore((state) => state.mode);
  const paletteKey = useThemeStore((state) => state.paletteKey);
  const fontKey = useThemeStore((state) => state.fontKey);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const setPalette = useThemeStore((state) => state.setPalette);
  const setFont = useThemeStore((state) => state.setFont);

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
      }}
    >
      <MainCard glow={false} cardTitle={t("settings.theme.title")}>
        <Stack spacing={2.5}>
          <FormControlLabel
            label={t("settings.theme.dark")}
            control={
              <Switch
                checked={mode === "dark" || muiTheme.palette.mode === "dark"}
                onChange={toggleMode}
              />
            }
          />

          <FormControl>
            <FormLabel sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <PaletteRoundedIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {t("settings.theme.palette")}
                </Typography>
              </Stack>
            </FormLabel>

            <Select
              value={paletteKey}
              onChange={(event) => setPalette(event.target.value as PaletteKey)}
            >
              <MenuItem value="energetic">
                {t("settings.theme.palettes.energetic")}
              </MenuItem>
              <MenuItem value="electric">
                {t("settings.theme.palettes.electric")}
              </MenuItem>
              <MenuItem value="solar">{t("settings.theme.palettes.solar")}</MenuItem>
              <MenuItem value="classic">{t("settings.theme.palettes.classic")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <TranslateRoundedIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {t("settings.language.title")}
                </Typography>
              </Stack>
            </FormLabel>

            <Select
              value={i18n.language.startsWith("ar") ? "ar" : "en"}
              onChange={(event) => {
                i18n.changeLanguage(event.target.value);
              }}
            >
              <MenuItem value="ar">{t("settings.language.arabic")}</MenuItem>
              <MenuItem value="en">{t("settings.language.english")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <TextFieldsRoundedIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {t("settings.theme.font")}
                </Typography>
              </Stack>
            </FormLabel>

            <Select
              value={fontKey}
              onChange={(event) => setFont(event.target.value as FontKey)}
            >
              <MenuItem value="interCairo">
                {t("settings.theme.fonts.interCairo")}
              </MenuItem>
              <MenuItem value="robotoKufi">
                {t("settings.theme.fonts.robotoKufi")}
              </MenuItem>
              <MenuItem value="orbitronAmiri">
                {t("settings.theme.fonts.orbitronAmiri")}
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </MainCard>
    </Box>
  );
}
