import { Chip, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import type { Role } from "../types/role.types";
import UpdateRole from "../pages/admin/roles/components/UpdateRole";
import ManageRolePermissions from "../pages/admin/roles/components/ManageRolePermissions";

interface RolesColumnsProps {
  t: TFunction;
}

export const getRolesTableColumns = ({ t }: RolesColumnsProps): MRT_ColumnDef<Role>[] => {
  return [
    {
      accessorKey: "id",
      header: t("table.id"),
      size: 80,
      enableGlobalFilter: false,
      Cell: ({ row }) => <Typography component="span">{row.original.id}</Typography>,
    },
    {
      accessorKey: "name",
      header: t("roles.table.name"),
      enableGlobalFilter: true,
      Cell: ({ row }) => (
        <Typography
          noWrap
          sx={{
            fontWeight: 800,
            minWidth: 140,
          }}
        >
          {row.original.name}
        </Typography>
      ),
    },
    {
      accessorKey: "description",
      header: t("roles.table.description"),
      enableGlobalFilter: true,
      Cell: ({ row }) => (
        <Typography
          noWrap
          color="text.secondary"
          sx={{
            maxWidth: 320,
          }}
        >
          {row.original.description || "-"}
        </Typography>
      ),
    },
    {
      id: "permissions",
      header: t("roles.table.permissions"),
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Chip
          size="small"
          color="primary"
          variant="outlined"
          label={t("roles.permissions.count", {
            count: row.original.permissions.length,
          })}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("roles.table.createdAt"),
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
          <ManageRolePermissions role={row.original} />
          <UpdateRole role={row.original} />
        </Stack>
      ),
    },
  ];
};
