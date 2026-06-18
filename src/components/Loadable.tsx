import type { ComponentType } from "react";
import { Suspense } from "react";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import { Box, CircularProgress } from "@mui/material";

function LoadingFallback() {
  return (
    <Box
      sx={() => ({
        width: "100%",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
      })}
    >
      <Box
        sx={{
          position: "relative",
          width: 76,
          height: 76,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress size={76} thickness={3} sx={{ position: "absolute" }} />

        <DirectionsBusRoundedIcon color="primary" fontSize="large" />
      </Box>
    </Box>
  );
}

export default function Loadable<P extends object>(Component: ComponentType<P>) {
  function LoadableComponent(props: P) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Component {...props} />
      </Suspense>
    );
  }

  return LoadableComponent;
}
