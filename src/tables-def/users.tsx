import { Chip, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import type { User } from "../types/user.types";
import UpdateUser from "../pages/admin/users/components/UpdateUser";
import DeleteUser from "../pages/admin/users/components/DeleteUser";
import { formatSyrianPhone } from "../utils/syrianPhone";

interface UsersColumnsProps {
  t: TFunction;
}

export const getUsersTableColumns = ({
  t,
}: UsersColumnsProps): MRT_ColumnDef<User>[] => {
  return [
    {
      accessorKey: "id",
      header: t("table.id"),
      size: 80,
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">{row.original.id}</Typography>
      ),
    },
    {
      id: "fullName",
      header: t("users.table.name"),
      enableGlobalFilter: true,
      Cell: ({ row }) => (
        <Stack spacing={0.25}>
          <Typography sx={{ fontWeight: 800 }}>
            {row.original.firstName} {row.original.lastName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {row.original.email}
          </Typography>
        </Stack>
      ),
    },
    {
      accessorKey: "phone",
      header: t("users.table.phone"),
      enableGlobalFilter: true,
      Cell: ({ row }) => (
        <Typography component="span">
          {formatSyrianPhone(row.original.phone)}
        </Typography>
      ),
    },
    {
      accessorKey: "organizationId",
      header: t("users.table.organizationId"),
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">
          {row.original.organizationId ?? "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "isActive",
      header: t("users.table.status"),
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Chip
          size="small"
          color={row.original.isActive ? "success" : "default"}
          label={
            row.original.isActive
              ? t("users.status.active")
              : t("users.status.inactive")
          }
        />
      ),
    },
    {
      accessorKey: "isSuperAdmin",
      header: t("users.table.type"),
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Chip
          size="small"
          color={row.original.isSuperAdmin ? "secondary" : "primary"}
          variant="outlined"
          label={
            row.original.isSuperAdmin
              ? t("users.types.superAdmin")
              : t("users.types.user")
          }
        />
      ),
    },
    {
      id: "roles",
      header: t("users.table.roles"),
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Chip
          size="small"
          variant="outlined"
          label={t("users.rolesCount", {
            count: row.original.roles.length,
          })}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("users.table.createdAt"),
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString("ar-SY")
            : "-"}
        </Typography>
      ),
    },
    {
      id: "actions",
      header: t("table.actions"),
      size: 140,
      enableGlobalFilter: false,
      enableSorting: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <UpdateUser user={row.original} />
          <DeleteUser user={row.original} />
        </Stack>
      ),
    },
  ];
};