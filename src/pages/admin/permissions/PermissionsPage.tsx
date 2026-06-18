import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Table from "../../../components/Table";
import { getPermissionsTableColumns } from "../../../tables-def/permissions";
import { getPermissionsCard } from "../../../card-def/permissions";
import { usePermissions } from "../../../hooks/roles/usePermissions";
import type { Permission } from "../../../types/permission.types";

const PermissionsPage = () => {
  const { t } = useTranslation();

  const permissions = usePermissions();

  const columns = useMemo(
    () =>
      getPermissionsTableColumns({
        t,
      }),
    [t],
  );

  const renderPermissionCard = useMemo(
    () =>
      getPermissionsCard({
        t,
      }),
    [t],
  );

  const exportFields = useMemo<Array<keyof Permission & string>>(
    () => ["id", "action", "resourceType"],
    [],
  );

  return (
    <Stack spacing={3}>
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
          <SecurityRoundedIcon />
        </Box>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t("permissions.title")}
          </Typography>

          <Typography color="text.secondary">{t("permissions.subtitle")}</Typography>
        </Box>
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
          <Table<Permission>
            columns={columns}
            data={permissions.data ?? []}
            exportFields={exportFields}
            enableExport
            enablePagination
            enableGlobalFilter={false}
            mobilePageSize={10}
            renderMobileCard={renderPermissionCard}
            state={{
              isLoading: permissions.isLoading,
              showAlertBanner: permissions.isError,
            }}
            isError={permissions.isError}
            refetch={permissions.refetch}
            isRefetching={permissions.isRefetching}
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

export default PermissionsPage;
