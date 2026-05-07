import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

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
        id: "companies",
        title: "companies",
        path: "/admin/dashboard/companies",
        icon: BusinessRoundedIcon,
        type: "item",
        permission: "companies.view",
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
            id: "employees",
            title: "employeesList",
            path: "/admin/dashboard/employees",
            icon: GroupsRoundedIcon,
            type: "item",
            permission: "employees.view",
          },
          {
            id: "employee-create",
            title: "createEmployee",
            path: "/admin/dashboard/employees/create",
            icon: PersonAddAlt1RoundedIcon,
            type: "item",
            permission: "employees.create",
          },
        ],
      },
    ],
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
