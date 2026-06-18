import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import Loadable from "../components/Loadable";

const MinimalLayout = Loadable(
  lazy(() => import("../layouts/MinimalLayout/MinimalLayout")),
);

const Login = Loadable(lazy(() => import("../pages/auth/Login/Login")));

const ResetPassword = Loadable(
  lazy(() => import("../pages/auth/ResetPassword/ResetPassword")),
);

export const authRoutes: RouteObject = {
  path: "/auth",
  element: <MinimalLayout />,
  children: [
    {
      index: true,
      element: <Login />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "reset-password",
      element: <ResetPassword />,
    },
  ],
};
