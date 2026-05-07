import type { ReactNode } from "react";
import { alpha, Box, Paper, Stack, Typography } from "@mui/material";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        width: "100%",
        maxWidth: 460,
        overflow: "hidden",
        borderRadius: 5,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.72)
            : alpha("#ffffff", 0.82),
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 30px 80px ${alpha("#000", 0.45)}`
            : `0 30px 80px ${alpha("#0f172a", 0.12)}`,
      })}
    >
      <Box sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={2.5}>
          <Stack
            spacing={1.25}
            sx={{
                alignItems: "center",
                textAlign: "center",
            }}
            >
            <Box
              sx={(theme) => ({
                width: 58,
                height: 58,
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                color: theme.palette.primary.contrastText,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 18px 35px ${alpha(theme.palette.primary.main, 0.25)}`,
              })}
            >
              <DirectionsBusRoundedIcon fontSize="large" />
            </Box>

            <Typography
              variant="h4"
              sx={(theme) => ({
                fontWeight: 900,
                lineHeight: 1.2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              })}
            >
              {title}
            </Typography>

            {subtitle ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 360 }}
              >
                {subtitle}
              </Typography>
            ) : null}
          </Stack>

          {children}
        </Stack>
      </Box>

      {footer ? (
        <Box
          sx={(theme) => ({
            px: { xs: 3, sm: 4 },
            py: 2.25,
            textAlign: "center",
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha("#000", 0.18)
                : alpha(theme.palette.primary.main, 0.035),
          })}
        >
          {footer}
        </Box>
      ) : null}
    </Paper>
  );
}