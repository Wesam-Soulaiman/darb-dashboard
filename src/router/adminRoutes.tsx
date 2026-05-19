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
const OrganizationsPage = Loadable(
  lazy(() => import("../pages/admin/organizations/OrganizationsPage")),
);
const CreateOrganizationPage = Loadable(
  lazy(() => import("../pages/admin/organizations/CreateOrganizationPage")),
);
const RolesPage = Loadable(
  lazy(() => import("../pages/admin/roles/RolesPage")),
);

const PermissionsPage = Loadable(
  lazy(() => import("../pages/admin/permissions/PermissionsPage")),
);
const UsersPage = Loadable(
  lazy(() => import("../pages/admin/users/UsersPage")),
);
const PlacesPage = Loadable(
  lazy(() => import("../pages/admin/places/PlacesPage")),
);

const StopsPage = Loadable(
  lazy(() => import("../pages/admin/stops/StopsPage")),
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
            {
              path: "dashboard/organizations",
              children: [
                {
                  index: true,
                  element: <OrganizationsPage />,
                },
                {
                  path: "create",
                  element: <CreateOrganizationPage />,
                },
              ],
            },
            {
  path: "dashboard/roles",
  element: <RolesPage />,
},
{
  path: "dashboard/permissions",
  element: <PermissionsPage />,
            },
{
  path: "dashboard/users",
  element: <UsersPage />,
            },
{
  path: "dashboard/places",
  element: <PlacesPage />,
            },
{
  path: "dashboard/stops",
  element: <StopsPage />,
},
          ],
        },
      ],
    },
  ],
};