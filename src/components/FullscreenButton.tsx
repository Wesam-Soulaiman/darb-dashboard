import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function FullscreenButton() {
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    const root = document.getElementById("root");

    if (!root) return;

    if (!document.fullscreenElement) {
      await root.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  return (
    <Tooltip title={t("layout.fullscreen")}>
      <IconButton color="primary" onClick={toggleFullscreen}>
        {isFullscreen ? (
          <FullscreenExitRoundedIcon />
        ) : (
          <FullscreenRoundedIcon />
        )}
      </IconButton>
    </Tooltip>
  );
}