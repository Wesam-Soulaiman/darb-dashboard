import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { useMe } from "../../hooks/users/useUsers";

const RedirectIfPasswordAlreadyChanged = () => {
  const me = useMe();

  if (me.isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!me.data?.mustChangePassword) {
    return <Navigate to="/admin/dashboard/profile" replace />;
  }

  return <Outlet />;
};

export default RedirectIfPasswordAlreadyChanged;