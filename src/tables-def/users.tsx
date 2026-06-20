import { Avatar, Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { TFunction } from "i18next";
import type { MRT_ColumnDef } from "material-react-table";

import type { Organization } from "../types/organization.types";
import type { UserListItem } from "../types/user.types";
import ViewUserDetails from "../pages/admin/users/components/ViewUserDetails";
import UserActions from "../pages/admin/users/components/UserActions";

interface UsersTableColumnsProps {
  t: TFunction;
  isSuperAdmin: boolean;
  organizations: Organization[];
}

const getInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";

  return `${first}${last}`.toUpperCase() || "U";
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("ar-SY");
};

export const getUsersTableColumns = ({
  t,
  isSuperAdmin,
  organizations,
}: UsersTableColumnsProps): MRT_ColumnDef<UserListItem>[] => {
  const organizationNameById = new Map(
    organizations.map((organization) => [organization.id, organization.name]),
  );

  const columns: MRT_ColumnDef<UserListItem>[] = [
    {
      id: "profile",
      header: t("profile.my"),
      size: 72,
      enableGlobalFilter: false,
      enableSorting: false,
      enableColumnFilter: false,
      enableColumnActions: false,
      Cell: ({ row }) => (
        <Tooltip title={t("common.details")}>
          <Box component="span">
            <ViewUserDetails
              userId={row.original.id}
              renderTrigger={({ open }) => (
                <IconButton
                  onClick={open}
                  sx={{ p: 0.5 }}
                  aria-label={t("common.details")}
                >
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      border: "1px solid",
                      borderColor: "divider",
                      fontSize: 14,
                      fontWeight: 900,
                    }}
                  >
                    {getInitials(row.original.firstName, row.original.lastName)}
                  </Avatar>
                </IconButton>
              )}
            />
          </Box>
        </Tooltip>
      ),
    },
    {
      accessorKey: "id",
      header: t("table.id"),
      size: 80,
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) => <Typography component="span">{row.original.id}</Typography>,
    },
    {
      id: "name",
      header: t("users.table.name"),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Box sx={{ minWidth: 180 }}>
          <Typography
            noWrap
            sx={{
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            {row.original.firstName} {row.original.lastName}
          </Typography>

          <Typography noWrap variant="body2" color="text.secondary">
            {row.original.email}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: "phone",
      header: t("users.form.phone"),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      Cell: ({ row }) => <Typography component="span">{row.original.phone}</Typography>,
    },
  ];

  if (isSuperAdmin) {
    columns.push({
      id: "organizationId",
      accessorFn: (row) => row.organizationId ?? "",
      header: t("users.form.organization"),
      enableGlobalFilter: false,
      filterVariant: "select",
      filterSelectOptions: organizations.map((organization) => ({
        label: organization.name,
        value: String(organization.id),
      })),
      Cell: ({ row }) => {
        const organizationId = row.original.organizationId;

        if (!organizationId) {
          return (
            <Chip
              size="small"
              variant="outlined"
              label={t("users.form.noOrganization")}
            />
          );
        }

        return (
          <Chip
            size="small"
            variant="outlined"
            label={organizationNameById.get(organizationId) ?? `#${organizationId}`}
          />
        );
      },
    });
  }

  columns.push(
    {
      id: "roleName",
      accessorFn: (row) => row.roles.map((role) => role.name).join(", "),
      header: t("users.organizationUsers.roleName"),
      filterVariant: "text",
      enableGlobalFilter: false,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap" }}>
          {row.original.roles.length ? (
            row.original.roles.map((role) => (
              <Chip key={role.id} label={role.name} size="small" variant="outlined" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      id: "employeeCode",
      accessorFn: (row) => row.profile?.employeeCode ?? "",
      header: t("users.organizationUsers.employeeCode"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const employeeCode = row.original.profile?.employeeCode;

        return employeeCode ? (
          <Chip label={employeeCode} size="small" variant="outlined" />
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => row.profile?.status ?? "",
      header: t("users.organizationUsers.status"),
      enableGlobalFilter: false,
      filterVariant: "select",
      filterSelectOptions: [
        {
          label: t("users.status.ACTIVE"),
          value: "ACTIVE",
        },
        {
          label: t("users.status.ON_LEAVE"),
          value: "ON_LEAVE",
        },
        {
          label: t("users.status.TERMINATED"),
          value: "TERMINATED",
        },
      ],
      Cell: ({ row }) => {
        const status = row.original.profile?.status;

        if (!status) {
          return (
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          );
        }

        return (
          <Chip
            size="small"
            label={t(`users.status.${status}`)}
            color={
              status === "ACTIVE"
                ? "success"
                : status === "ON_LEAVE"
                  ? "warning"
                  : "default"
            }
            variant="outlined"
          />
        );
      },
    },
    {
      id: "hireDate",
      accessorFn: (row) => row.profile?.hireDate ?? "",
      header: t("users.organizationUsers.hireDate"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">
          {formatDate(row.original.profile?.hireDate)}
        </Typography>
      ),
    },

    {
      id: "isDriver",
      accessorFn: (row) => row.isDriver,
      header: t("users.table.driver"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) =>
        row.original.isDriver ? (
          <Chip
            size="small"
            color="info"
            label={t("users.details.driver")}
            variant="outlined"
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        ),
    },
    // {
    //   id: "licenseNumber",
    //   accessorFn: (row) => (row.isDriver ? (row.profile?.licenseNumber ?? "") : ""),
    //   header: t("users.organizationUsers.licenseNumber"),
    //   enableGlobalFilter: false,
    //   enableColumnFilter: false,
    //   Cell: ({ row }) => {
    //     if (!row.original.isDriver) {
    //       return (
    //         <Typography variant="body2" color="text.secondary">
    //           -
    //         </Typography>
    //       );
    //     }

    //     return (
    //       <Typography component="span">
    //         {row.original.profile?.licenseNumber ?? "-"}
    //       </Typography>
    //     );
    //   },
    // },
    {
      id: "licenseExpiry",
      accessorFn: (row) => (row.isDriver ? (row.profile?.licenseExpiry ?? "") : ""),
      header: t("users.organizationUsers.licenseExpiry"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">
          {row.original.isDriver ? formatDate(row.original.profile?.licenseExpiry) : "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("users.table.createdAt"),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Typography component="span">{formatDate(row.original.createdAt)}</Typography>
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
      Cell: ({ row }) => <UserActions user={row.original} isSuperAdmin={isSuperAdmin} />,
    },
  );

  return columns;
};
