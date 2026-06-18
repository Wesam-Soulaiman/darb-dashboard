import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import AuthProvider from "../../providers/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Outlet />
      </Box>
    </AuthProvider>
  );
}
