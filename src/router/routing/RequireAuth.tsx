import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getAccessToken } from "../../core/auth/authStorage";

export default function RequireAuth() {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}
