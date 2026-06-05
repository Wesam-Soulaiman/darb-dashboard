import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { useMe } from "../../hooks/users/useUsers";

const CHANGE_PASSWORD_PATH = "/admin/change-password";

const RequirePasswordChange = () => {
  const location = useLocation();
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

  if (me.data?.mustChangePassword) {
    return (
      <Navigate
        to={CHANGE_PASSWORD_PATH}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
};

export default RequirePasswordChange;