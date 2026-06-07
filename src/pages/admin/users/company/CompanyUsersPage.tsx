import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import type { MRT_ColumnFiltersState } from "material-react-table";
import { useTranslation } from "react-i18next";

import Table from "../../../../components/Table";
import { usePagePagination } from "../../../../hooks/common/usePagePagination";
import { useUsers } from "../../../../hooks/users/useUsers";
import { getUsersTableColumns } from "../../../../tables-def/users";
import { getUsersCard } from "../../../../card-def/users";
import type {
  OperationalProfileStatus,
  UserListItem,
} from "../../../../types/user.types";
import CreateUser from "../components/CreateUser";
import UserMobileFilters from "../components/UserMobileFilters";

type CompanyUsersPageProps = {
  organizationId: number | null;
};

const getStringFilter = (
  filters: MRT_ColumnFiltersState,
  id: string,
): string | undefined => {
  const value = filters.find(
    (filter) => filter.id === id,
  )?.value;

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return undefined;
  }

  return value.trim();
};

const CompanyUsersPage = ({
  organizationId,
}: CompanyUsersPageProps) => {
  const { t } = useTranslation();

  const [globalFilter, setGlobalFilter] =
    useState("");

  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>([]);

  const pagePagination = usePagePagination({
    initialPageSize: 20,
  });

  const status = getStringFilter(
    columnFilters,
    "status",
  ) as OperationalProfileStatus | undefined;

  const roleName = getStringFilter(
    columnFilters,
    "roleName",
  );

  const users = useUsers({
    page: pagePagination.page,
    limit: pagePagination.limit,
    search: globalFilter || undefined,
    status,
    roleName,
  });

  const columns = useMemo(
    () =>
      getUsersTableColumns({
        t,
        isSuperAdmin: false,
        organizations: [],
      }),
    [t],
  );

  const renderCard = useMemo(
    () =>
      getUsersCard({
        t,
        isSuperAdmin: false,
      }),
    [t],
  );

  const mobileFilters = useMemo(
    () => (
      <UserMobileFilters
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        onFiltersChange={pagePagination.reset}
      />
    ),
    [
      columnFilters,
      pagePagination.reset,
    ],
  );

  if (!organizationId) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 900 }}
          >
            {t(
              "users.organizationUsers.noOrganization",
            )}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center" }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <GroupsRoundedIcon />
          </Box>

          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900 }}
            >
              {t(
                "users.organizationUsers.title",
              )}
            </Typography>

            <Typography color="text.secondary">
              {t(
                "users.organizationUsers.subtitle",
              )}
            </Typography>
          </Box>
        </Stack>

        <CreateUser
          mode="company-admin"
          organizationId={organizationId}
        />
      </Stack>

      <Card
        variant="outlined"
        sx={{
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent
          sx={{ p: { xs: 1.5, md: 2 } }}
        >
          <Table<UserListItem>
            columns={columns}
            data={users.data?.data ?? []}
            enableExport
            exportFields={[
              "id",
              "phone",
              "firstName",
              "lastName",
              "email",
              "isActive",
              "createdAt",
              "updatedAt",
            ]}
            enablePagination
            manualPagination
            rowCount={
              users.data?.meta.total ?? 0
            }
            onPaginationChange={
              pagePagination.onPaginationChange
            }
            enableGlobalFilter
            manualFiltering
            onGlobalFilterChange={(value) => {
              setGlobalFilter(String(value));
              pagePagination.reset();
            }}
            enableColumnFilters
            onColumnFiltersChange={(updater) => {
              setColumnFilters((current) =>
                typeof updater === "function"
                  ? updater(current)
                  : updater,
              );

              pagePagination.reset();
            }}
            mobileSearchFields={[
              "firstName",
              "lastName",
              "phone",
              "email",
            ]}
            mobilePageSize={
              pagePagination.pagination.pageSize
            }
            renderMobileCard={renderCard}
            renderMobileFilters={
              mobileFilters
            }
            state={{
              isLoading:
                users.isLoading ||
                users.isFetching,
              showAlertBanner:
                users.isError,
              pagination:
                pagePagination.pagination,
              globalFilter,
              columnFilters,
            }}
            isError={users.isError}
            refetch={users.refetch}
            isRefetching={
              users.isRefetching
            }
            muiPaginationProps={{
              rowsPerPageOptions: [
                10,
                20,
                50,
              ],
              showFirstButton: true,
              showLastButton: true,
            }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CompanyUsersPage;