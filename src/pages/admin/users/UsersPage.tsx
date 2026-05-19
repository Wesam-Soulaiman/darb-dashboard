import { useMemo } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { useTranslation } from "react-i18next";

import Table from "../../../components/Table";
import { getUsersTableColumns } from "../../../tables-def/users";
import { getUsersCard } from "../../../card-def/users";
import { useUsers } from "../../../hooks/users/useUsers";
import { useCursorPagination } from "../../../hooks/common/useCursorPagination";
import type { User } from "../../../types/user.types";
import CreateUser from "./components/CreateUser";

const DEFAULT_USERS_LIMIT = 20;

const UsersPage = () => {
  const { t } = useTranslation();

  const cursorPagination = useCursorPagination({
    initialPageSize: DEFAULT_USERS_LIMIT,
  });

  const users = useUsers({
    cursor: cursorPagination.cursor,
    limit: cursorPagination.limit,
  });

  const tablePagination = cursorPagination.getPaginationProps({
    dataLength: users.data?.data.length ?? 0,
    hasNextPage: users.data?.meta.hasNextPage ?? false,
    nextCursor: users.data?.meta.nextCursor,
  });

  const columns = useMemo(
    () =>
      getUsersTableColumns({
        t,
      }),
    [t],
  );

  const renderUserCard = useMemo(
    () =>
      getUsersCard({
        t,
      }),
    [t],
  );

  const exportFields = useMemo<Array<keyof User & string>>(
    () => [
      "id",
      "phone",
      "email",
      "firstName",
      "lastName",
      "organizationId",
      "createdAt",
      "updatedAt",
    ],
    [],
  );

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
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
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("users.title")}
            </Typography>

            <Typography color="text.secondary">
              {t("users.subtitle")}
            </Typography>
          </Box>
        </Stack>

        <CreateUser />
      </Stack>

      <Card
        variant="outlined"
        sx={{
          overflow: "hidden",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
          <Table<User>
            columns={columns}
            data={users.data?.data ?? []}
            exportFields={exportFields}
            enableExport
            enablePagination
            manualPagination
            rowCount={tablePagination.rowCount}
            onPaginationChange={tablePagination.onPaginationChange}
            enableGlobalFilter
            mobileSearchFields={["firstName", "lastName", "phone", "email"]}
            mobilePageSize={cursorPagination.pagination.pageSize}
            renderMobileCard={renderUserCard}
            state={{
              isLoading: users.isLoading || users.isFetching,
              showAlertBanner: users.isError,
              pagination: tablePagination.pagination,
            }}
            isError={users.isError}
            refetch={users.refetch}
            isRefetching={users.isRefetching}
            initialState={{
              showGlobalFilter: false,
            }}
            muiPaginationProps={{
              rowsPerPageOptions: [10, 20, 50],
              showFirstButton: false,
              showLastButton: false,
            }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default UsersPage;