import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import Loadable from "../components/Loadable";
import RequireAuth from "./routing/RequireAuth";
import RequirePasswordChange from "./routing/RequirePasswordChange";
import RedirectIfPasswordAlreadyChanged from "./routing/RedirectIfPasswordAlreadyChanged";

const RootLayout = Loadable(lazy(() => import("../layouts/RootLayout/RootLayout")));

const AdminLayout = Loadable(lazy(() => import("../layouts/AdminLayout/AdminLayout")));

const TripsPage = Loadable(lazy(() => import("../pages/admin/trips/TripsPage")));

const TripSetupPage = Loadable(lazy(() => import("../pages/admin/trips/TripSetupPage")));

const ChangePasswordPage = Loadable(
  lazy(() => import("../pages/auth/MustChangePassword/ChangePasswordPage")),
);
const ScheduleCalendarPage = Loadable(
  lazy(() => import("../pages/admin/schedules/ScheduleCalendarPage")),
);
// const Dashboard = Loadable(
//   lazy(() => import("../pages/admin/Dashboard/Dashboard")),
// );

const MyProfile = Loadable(lazy(() => import("../pages/admin/MyProfile/MyProfile")));

const OrganizationsPage = Loadable(
  lazy(() => import("../pages/admin/organizations/OrganizationsPage")),
);

const OrganizationProfilePage = Loadable(
  lazy(() => import("../pages/admin/organizations/OrganizationProfilePage")),
);

const CreateOrganizationPage = Loadable(
  lazy(() => import("../pages/admin/organizations/CreateOrganizationPage")),
);

const RolesPage = Loadable(lazy(() => import("../pages/admin/roles/RolesPage")));

const PermissionsPage = Loadable(
  lazy(() => import("../pages/admin/permissions/PermissionsPage")),
);

const UsersPage = Loadable(lazy(() => import("../pages/admin/users/UsersPage")));

const PlacesPage = Loadable(lazy(() => import("../pages/admin/places/PlacesPage")));

const StopsPage = Loadable(lazy(() => import("../pages/admin/stops/StopsPage")));

const RoutesPage = Loadable(lazy(() => import("../pages/admin/routes/RoutesPage")));

const BusesPage = Loadable(lazy(() => import("../pages/admin/buses/BusesPage")));

const SchedulesPage = Loadable(
  lazy(() => import("../pages/admin/schedules/SchedulesPage")),
);

const RunsPage = Loadable(lazy(() => import("../pages/admin/runs/RunsPage")));

const RunsArchivePage = Loadable(
  lazy(() => import("../pages/admin/runs/RunsArchivePage")),
);

const RunTrackingPage = Loadable(
  lazy(() => import("../pages/admin/runs/RunTrackingPage")),
);

const RouteRecorderPage = Loadable(
  lazy(() => import("../pages/admin/routes/RouteRecorderPage")),
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
          element: <RedirectIfPasswordAlreadyChanged />,
          children: [
            {
              path: "admin/change-password",
              element: <ChangePasswordPage />,
            },
          ],
        },
        {
          element: <RequirePasswordChange />,
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
                  element: <Navigate to="/admin/dashboard/profile" replace />,
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
                    {
                      path: ":orgId/buses",
                      element: <BusesPage />,
                    },
                    {
                      path: ":orgId/schedules/calendar",
                      element: <ScheduleCalendarPage />,
                    },
                    {
                      path: ":orgId/schedules",
                      element: <SchedulesPage />,
                    },
                    {
                      path: ":orgId/trips/:tripId/setup",
                      element: <TripSetupPage />,
                    },
                    {
                      path: ":orgId/trips",
                      element: <TripsPage />,
                    },
                    {
                      path: ":orgId/runs/:runId/tracking",
                      element: <RunTrackingPage />,
                    },
                    {
                      path: ":orgId/runs/archive",
                      element: <RunsArchivePage />,
                    },
                    {
                      path: ":orgId/runs",
                      element: <RunsPage />,
                    },
                    {
                      path: ":id",
                      element: <OrganizationProfilePage />,
                    },
                  ],
                },
                {
                  path: "dashboard/schedules/calendar",
                  element: <ScheduleCalendarPage />,
                },
                {
                  path: "dashboard/schedules",
                  element: <SchedulesPage />,
                },
                {
                  path: "dashboard/trips/:tripId/setup",
                  element: <TripSetupPage />,
                },
                {
                  path: "dashboard/trips",
                  element: <TripsPage />,
                },
                {
                  path: "dashboard/runs",
                  element: <RunsPage />,
                },
                {
                  path: "dashboard/runs/:runId/tracking",
                  element: <RunTrackingPage />,
                },
                {
                  path: "dashboard/runs/archive",
                  element: <RunsArchivePage />,
                },
                {
                  path: "dashboard/buses",
                  element: <BusesPage />,
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
                {
                  path: "dashboard/routes/record",
                  element: <RouteRecorderPage />,
                },
                {
                  path: "dashboard/routes",
                  element: <RoutesPage />,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
