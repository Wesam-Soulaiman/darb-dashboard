import { alpha, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import MinimalHeader from "./MinimalHeader";

export const MINIMAL_HEADER_HEIGHT = 70;

export default function MinimalLayout() {
  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        minHeight: { xs: "100svh", md: "100vh" },
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            theme.palette.mode === "dark"
              ? `radial-gradient(circle at top right, ${alpha(
                  theme.palette.primary.main,
                  0.2,
                )}, transparent 35%),
                 radial-gradient(circle at bottom left, ${alpha(
                   theme.palette.secondary.main,
                   0.12,
                 )}, transparent 35%)`
              : `radial-gradient(circle at top right, ${alpha(
                  theme.palette.primary.main,
                  0.12,
                )}, transparent 35%),
                 radial-gradient(circle at bottom left, ${alpha(
                   theme.palette.secondary.main,
                   0.1,
                 )}, transparent 35%)`,
        },
      })}
    >
      <MinimalHeader />

      <Box
        component="main"
        sx={(theme) => ({
          position: "relative",
          zIndex: 1,
          minHeight: {
            xs: `calc(100svh - ${MINIMAL_HEADER_HEIGHT}px)`,
            md: `calc(100vh - ${MINIMAL_HEADER_HEIGHT}px)`,
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 4,
          backgroundColor: alpha(
            theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            0.015,
          ),
          backdropFilter: "blur(2px)",
        })}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
