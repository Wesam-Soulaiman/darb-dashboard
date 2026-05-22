import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import SignpostRoundedIcon from "@mui/icons-material/SignpostRounded";
import AltRouteRoundedIcon from "@mui/icons-material/AltRouteRounded";
import type { AppMenuItem } from "./menu.types";

export const adminMenuItems: AppMenuItem[] = [
  {
    title: "dashboard",
    type: "group",
    children: [
      {
        id: "admin-dashboard",
        path: "/admin/dashboard",
        title: "home",
        type: "item",
        icon: DashboardRoundedIcon,
        permission: "dashboard.access",
      },
    ],
  },

  {
    title: "management",
    type: "group",
    children: [
      {
        id: "organizations",
        title: "menu.organizations",
        type: "item",
        path: "/admin/dashboard/organizations",
        icon: BusinessRoundedIcon,
        permission: "organizations.view",
      },
      {
        id: "lines",
        title: "lines",
        path: "/admin/dashboard/lines",
        icon: RouteRoundedIcon,
        type: "item",
        permission: "lines.view",
      },
      {
        id: "employees-management",
        type: "collapse",
        title: "employees",
        icon: GroupsRoundedIcon,
        children: [
          {
            id: "roles",
            title: "roles",
            path: "/admin/dashboard/roles",
            icon: ManageAccountsRoundedIcon,
            type: "item",
            permission: "roles.view",
          },
          {
            id: "permissions",
            title: "menu.permissions",
            path: "/admin/dashboard/permissions",
            icon: SecurityRoundedIcon,
            type: "item",
            permission: "permissions.view",
          },
          {
            id: "users",
            title: "menu.users",
            path: "/admin/dashboard/users",
            icon: GroupsRoundedIcon,
            type: "item",
            permission: "users.view",
          },
        ],
      },
    ],
  },
  {
    id: "places",
    title: "menu.places",
    path: "/admin/dashboard/places",
    icon: PlaceRoundedIcon,
    type: "item",
    permission: "read:place",
  },
  {
    id: "stops",
    title: "menu.stops",
    path: "/admin/dashboard/stops",
    icon: SignpostRoundedIcon,
    type: "item",
    permission: "read:stop",
  },
  {
    id: "routes",
    title: "menu.routes",
    path: "/admin/dashboard/routes",
    icon: AltRouteRoundedIcon,
    type: "item",
    permission: "read:route",
  },
  {
    title: "operations",
    type: "group",
    children: [
      {
        id: "buses",
        title: "buses",
        path: "/admin/dashboard/buses",
        icon: DirectionsBusRoundedIcon,
        type: "item",
        permission: "buses.view",
      },
      {
        id: "drivers",
        title: "drivers",
        path: "/admin/dashboard/drivers",
        icon: BadgeRoundedIcon,
        type: "item",
        permission: "drivers.view",
      },
      {
        id: "tracking",
        title: "tracking",
        path: "/admin/dashboard/tracking",
        icon: MapRoundedIcon,
        type: "item",
        permission: "tracking.view",
      },
      {
        id: "alerts",
        title: "alerts",
        path: "/admin/dashboard/alerts",
        icon: NotificationsActiveRoundedIcon,
        type: "item",
        permission: "alerts.view",
      },
      {
        id: "revenue",
        title: "revenue",
        path: "/admin/dashboard/revenue",
        icon: PaidRoundedIcon,
        type: "item",
        permission: "revenue.view",
      },
      {
        id: "reports",
        title: "reports",
        path: "/admin/dashboard/reports",
        icon: AssessmentRoundedIcon,
        type: "item",
        permission: "reports.view",
      },
    ],
  },
];
