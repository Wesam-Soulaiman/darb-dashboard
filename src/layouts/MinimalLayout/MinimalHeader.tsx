import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import { Box, Typography, type BoxProps } from "@mui/material";
import { useTranslation } from "react-i18next";

import { MINIMAL_HEADER_HEIGHT } from "./MinimalLayout";

export default function MinimalHeader({ sx, ...rest }: BoxProps) {
  const { t } = useTranslation();

  return (
    <Box
      component="header"
      {...rest}
      sx={[
        (theme) => ({
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: MINIMAL_HEADER_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3, md: 4 },
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(15,18,22,0.72)"
              : "rgba(255,255,255,0.72)",
          backdropFilter: "blur(14px)",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        variant="h6"
        sx={{
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          fontWeight: 800,
          letterSpacing: 0.2,
        }}
      >
        <DirectionsBusRoundedIcon fontSize="medium" />
        {t("app.title")}
      </Typography>
    </Box>
  );
}