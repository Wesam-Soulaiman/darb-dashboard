import { Chip, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import type { Permission } from "../types/permission.types";
import {
  getPermissionActionLabel,
  getPermissionResourceLabel,
} from "../utils/permissionTranslation";

interface PermissionsColumnsProps {
  t: TFunction;
}

export const getPermissionsTableColumns = ({
  t,
}: PermissionsColumnsProps): MRT_ColumnDef<Permission>[] => {
  return [
    {
      accessorKey: "id",
      header: t("table.id"),
      size: 80,
      enableGlobalFilter: false,
      Cell: ({ row }) => <Typography component="span">{row.original.id}</Typography>,
    },
    {
      accessorKey: "action",
      header: t("permissions.table.action"),
      enableGlobalFilter: true,
      Cell: ({ row }) => (
        <Chip
          size="small"
          color="primary"
          label={getPermissionActionLabel(row.original.action, t)}
        />
      ),
    },
    {
      accessorKey: "resourceType",
      header: t("permissions.table.resourceType"),
      enableGlobalFilter: true,
      Cell: ({ row }) => (
        <Typography sx={{ fontWeight: 800 }}>
          {getPermissionResourceLabel(row.original.resourceType, t)}
        </Typography>
      ),
    },
  ];
};
