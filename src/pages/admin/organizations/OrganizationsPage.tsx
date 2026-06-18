import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Table from "../../../components/Table";
import { getOrganizationsTableColumns } from "../../../tables-def/organizations";
import { useOrganizations } from "../../../hooks/organizations/useOrganizations";
import type { Organization } from "../../../types/organization.types";
import { Link as RouterLink } from "react-router-dom";
import { getOrganizationCardDef } from "../../../card-def/organizations";

const OrganizationsPage = () => {
  const { t } = useTranslation();
  const renderOrganizationCard = getOrganizationCardDef({ t });
  const organizations = useOrganizations();

  const columns = useMemo(
    () =>
      getOrganizationsTableColumns({
        t,
      }),
    [t],
  );

  const exportFields = useMemo<Array<keyof Organization & string>>(
    () => ["id", "name", "codeName", "createdAt", "updatedAt"],
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
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
          }}
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
            <BusinessRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("organizations.title")}
            </Typography>

            <Typography color="text.secondary">{t("organizations.subtitle")}</Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          component={RouterLink}
          to="/admin/dashboard/organizations/create"
          startIcon={<AddRoundedIcon />}
          sx={{
            borderRadius: 2,
            px: 2.5,
            alignSelf: { xs: "stretch", sm: "center" },
          }}
        >
          {t("organizations.actions.create")}
        </Button>
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
          <Table<Organization>
            columns={columns}
            data={organizations.data ?? []}
            exportFields={exportFields}
            enableExport
            enablePagination
            enableGlobalFilter
            mobileSearchFields={["name", "codeName"]}
            mobilePageSize={10}
            renderMobileCard={renderOrganizationCard}
            state={{
              isLoading: organizations.isLoading,
              showAlertBanner: organizations.isError,
            }}
            isError={organizations.isError}
            refetch={organizations.refetch}
            isRefetching={organizations.isRefetching}
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

export default OrganizationsPage;
