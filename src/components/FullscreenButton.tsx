import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FullscreenButton() {
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const toggleFullscreen = async () => {
    const root = document.getElementById("root");

    if (!root) return;

    if (!document.fullscreenElement) {
      await root.requestFullscreen();
      setIsFullscreen(true);
      return;
    }

    await document.exitFullscreen();
    setIsFullscreen(false);
  };

  return (
    <Tooltip title={t("layout.fullscreen")}>
      <IconButton color="primary" onClick={toggleFullscreen}>
        {isFullscreen ? <FullscreenExitRoundedIcon /> : <FullscreenRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}