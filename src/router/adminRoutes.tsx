import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import Loadable from "../components/Loadable";
import RequireAuth from "./routing/RequireAuth";

const RootLayout = Loadable(
  lazy(() => import("../layouts/RootLayout/RootLayout")),
);

const AdminLayout = Loadable(
  lazy(() => import("../layouts/AdminLayout/AdminLayout")),
);

// const Dashboard = Loadable(
//   lazy(() => import("../pages/admin/Dashboard/Dashboard")),
// );

const MyProfile = Loadable(
  lazy(() => import("../pages/admin/MyProfile/MyProfile")),
);

export const adminRoutes: RouteObject = {
  path: "/",
  element: <RootLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/admin/dashboard" replace />,
    },
    {
      element: <RequireAuth />,
      children: [
        {
          path: "admin",
          element: <AdminLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="/admin/dashboard" replace />,
            },
            {
              path: "dashboard",
              // element: <Dashboard />,
            },
            {
              path: "dashboard/profile",
              element: <MyProfile />,
            },
          ],
        },
      ],
    },
  ],
};