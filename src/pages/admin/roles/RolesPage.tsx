import { useMemo, useState } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import { useTranslation } from "react-i18next";

import Table from "../../../components/Table";
import { getRolesTableColumns } from "../../../tables-def/roles";
import { getRolesCard } from "../../../card-def/roles";
import { useRoles } from "../../../hooks/roles/useRoles";
import type { Role } from "../../../types/role.types";
import CreateRole from "./components/CreateRole";

const RolesPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const roles = useRoles({
    search: search.trim() || undefined,
  });

  const columns = useMemo(
    () =>
      getRolesTableColumns({
        t,
      }),
    [t],
  );

  const renderRoleCard = useMemo(
    () =>
      getRolesCard({
        t,
      }),
    [t],
  );

  const exportFields = useMemo<Array<keyof Role & string>>(
    () => [
      "id",
      "name",
      "description",
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
            <ManageAccountsRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("roles.title")}
            </Typography>

            <Typography color="text.secondary">
              {t("roles.subtitle")}
            </Typography>
          </Box>
        </Stack>

        <CreateRole />
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
          <Table<Role>
            columns={columns}
            data={roles.data ?? []}
            exportFields={exportFields}
            enableExport
            enablePagination
            enableGlobalFilter
            manualFiltering
            onGlobalFilterChange={(value) => {
              setSearch(String(value ?? ""));
            }}
            mobileSearchFields={["name", "description"]}
            mobilePageSize={10}
            renderMobileCard={renderRoleCard}
            state={{
              isLoading: roles.isLoading,
              showAlertBanner: roles.isError,
              globalFilter: search,
            }}
            isError={roles.isError}
            refetch={roles.refetch}
            isRefetching={roles.isRefetching}
            initialState={{
              pagination: {
                pageIndex: 0,
                pageSize: 10,
              },
              showGlobalFilter: false,
            }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default RolesPage;