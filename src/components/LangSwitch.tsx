import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import { Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function LangSwitch() {
  const { i18n, t } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  return (
    <Tooltip title={t("settings.language.title")}>
      <Button
        variant="text"
        color="primary"
        onClick={toggleLanguage}
        startIcon={<TranslateRoundedIcon />}
        sx={{
          minWidth: 0,
          fontWeight: 900,
        }}
      >
        {isArabic ? "EN" : "AR"}
      </Button>
    </Tooltip>
  );
}