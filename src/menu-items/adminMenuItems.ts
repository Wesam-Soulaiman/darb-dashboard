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
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
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
        permission: "read:organization",
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
            permission: "read:role",
          },
          {
            id: "permissions",
            title: "menu.permissions",
            path: "/admin/dashboard/permissions",
            icon: SecurityRoundedIcon,
            type: "item",
            permission: "read:permission",
          },
          {
            id: "users",
            title: "menu.users",
            path: "/admin/dashboard/users",
            icon: GroupsRoundedIcon,
            type: "item",
            permission: "read:user",
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
    icon: RouteRoundedIcon,
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
        permission: "read:bus",
      },
      {
        id: "schedules",
        title: "schedules",
        path: "/admin/dashboard/schedules",
        icon: EventAvailableRoundedIcon,
        type: "item",
        permission: "read:schedule",
      },
      {
        id: "trips",
        title: "trips",
        path: "/admin/dashboard/trips",
        icon: TimelineRoundedIcon,
        type: "item",
        permission: "read:trip",
      },
      {
        id: "drivers",
        title: "drivers",
        path: "/admin/dashboard/drivers",
        icon: BadgeRoundedIcon,
        type: "item",
        permission: "read:driver",
      },
      {
        id: "tracking",
        title: "tracking",
        path: "/admin/dashboard/tracking",
        icon: MapRoundedIcon,
        type: "item",
        permission: "read:tracking",
      },
      {
        id: "alerts",
        title: "alerts",
        path: "/admin/dashboard/alerts",
        icon: NotificationsActiveRoundedIcon,
        type: "item",
        permission: "read:alert",
      },
      {
        id: "revenue",
        title: "revenue",
        path: "/admin/dashboard/revenue",
        icon: PaidRoundedIcon,
        type: "item",
        permission: "read:revenue",
      },
      {
        id: "reports",
        title: "reports",
        path: "/admin/dashboard/reports",
        icon: AssessmentRoundedIcon,
        type: "item",
        permission: "read:report",
      },
    ],
  },
];
