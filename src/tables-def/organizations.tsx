import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { Link } from "react-router-dom";

import type { Organization } from "../types/organization.types";
import UpdateOrganization from "../pages/admin/organizations/components/UpdateOrganization";
import DeleteOrganization from "../pages/admin/organizations/components/DeleteOrganization";

interface OrganizationsColumnsProps {
  t: TFunction;
}

export const getOrganizationsTableColumns = ({
  t,
}: OrganizationsColumnsProps): MRT_ColumnDef<Organization>[] => {
  return [
    {
      id: "details",
      header: t("common.details"),
      size: 72,
      enableGlobalFilter: false,
      enableSorting: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Tooltip title={t("common.details")}>
          <IconButton
            component={Link}
            to={`/admin/dashboard/organizations/${row.original.id}`}
            sx={{ p: 0.5 }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          </IconButton>
        </Tooltip>
      ),
    },
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
      accessorKey: "name",
      header: t("organizations.table.organization"),
      enableGlobalFilter: true,
      Cell: ({ row }) => (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
            minWidth: 150,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              {row.original.name}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      accessorKey: "codeName",
      header: t("organizations.table.codeName"),
      enableGlobalFilter: true,
      size: 72,
      Cell: ({ row }) => (
        <Chip
          label={row.original.codeName}
          size="small"
          variant="outlined"
          sx={{
            maxWidth: 180,
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("organizations.table.createdAt"),
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
      size: 190,
      enableGlobalFilter: false,
      enableSorting: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
          }}
        >
          <UpdateOrganization organization={row.original} />
          <DeleteOrganization organization={row.original} />
        </Stack>
      ),
    },
  ];
};