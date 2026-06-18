import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import { Box, Typography, type BoxProps } from "@mui/material";
import { useTranslation } from "react-i18next";

type LogoProps = BoxProps & {
  collapsed?: boolean;
};

export default function Logo({ collapsed = false, sx, ...rest }: LogoProps) {
  const { t } = useTranslation();

  return (
    <Box
      {...rest}
      sx={[
        {
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          minWidth: 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={(theme) => ({
          width: 42,
          height: 42,
          borderRadius: 3,
          display: "grid",
          placeItems: "center",
          color: theme.palette.primary.contrastText,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          flexShrink: 0,
        })}
      >
        <DirectionsBusRoundedIcon />
      </Box>

      {!collapsed ? (
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 900,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            Darb
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              whiteSpace: "nowrap",
            }}
          >
            {t("app.shortTitle")}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
