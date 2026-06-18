import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnFiltersState } from "material-react-table";

import Table from "../../../components/Table";
import { getBusesTableColumns } from "../../../tables-def/buses";
import { getBusesCard } from "../../../card-def/buses";
import { useBuses } from "../../../hooks/organizations/useBuses";
import { usePagePagination } from "../../../hooks/common/usePagePagination";
import { useAuthContext } from "../../../contexts/AuthContext";
import type { Bus, BusStatus, BusType } from "../../../types/bus.types";
import CreateBus from "./components/CreateBus";

const DEFAULT_BUSES_LIMIT = 20;

const getFilterValue = (filters: MRT_ColumnFiltersState, id: string): string => {
  const value = filters.find((filter) => filter.id === id)?.value;

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return "";
};

const BusesPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const { user, isSuperAdmin } = useAuthContext();

  const routeOrgId = Number(params.orgId);
  const userOrgId = Number(user?.organizationId);

  const orgId = Number.isFinite(routeOrgId) && routeOrgId > 0 ? routeOrgId : userOrgId;

  const hasValidOrgId = Number.isFinite(orgId) && orgId > 0;

  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  const pagePagination = usePagePagination({
    initialPageSize: DEFAULT_BUSES_LIMIT,
  });

  const statusValue = getFilterValue(columnFilters, "status");
  const typeValue = getFilterValue(columnFilters, "type");

  const buses = useBuses(orgId, {
    page: pagePagination.page,
    limit: pagePagination.limit,
    search: search.trim() || undefined,
    status: statusValue ? (statusValue as BusStatus) : undefined,
    type: typeValue ? (typeValue as BusType) : undefined,
  });

  const columns = useMemo(
    () =>
      getBusesTableColumns({
        t,
      }),
    [t],
  );

  const renderBusCard = useMemo(
    () =>
      getBusesCard({
        t,
      }),
    [t],
  );

  const exportFields = useMemo<Array<keyof Bus & string>>(
    () => [
      "id",
      "busCode",
      "plateNumber",
      "type",
      "status",
      "capacity",
      "manufacturer",
      "model",
      "year",
      "registrationExpiry",
      "organizationId",
      "createdAt",
    ],
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    pagePagination.reset();
  };

  const handleColumnFiltersChange = (
    updater:
      | MRT_ColumnFiltersState
      | ((old: MRT_ColumnFiltersState) => MRT_ColumnFiltersState),
  ) => {
    setColumnFilters((current) =>
      typeof updater === "function" ? updater(current) : updater,
    );

    pagePagination.reset();
  };

  const setMobileFilter = (id: "status" | "type", value: string) => {
    handleColumnFiltersChange((current) => {
      const withoutCurrentFilter = current.filter((filter) => filter.id !== id);

      return value ? [...withoutCurrentFilter, { id, value }] : withoutCurrentFilter;
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setColumnFilters([]);
    pagePagination.reset();
  };

  if (!hasValidOrgId) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {t("buses.noOrganizationTitle")}
        </Typography>

        <Typography color="text.secondary">{t("buses.noOrganizationMessage")}</Typography>

        {isSuperAdmin && (
          <Button
            component={RouterLink}
            to="/admin/dashboard/organizations"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            {t("organizations.title")}
          </Button>
        )}
      </Stack>
    );
  }

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
            <DirectionsBusRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("buses.title")}
            </Typography>

            <Typography color="text.secondary">{t("buses.subtitle")}</Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          {isSuperAdmin && params.orgId && (
            <Button
              component={RouterLink}
              to={`/admin/dashboard/organizations/${orgId}`}
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                borderRadius: 2,
              }}
            >
              {t("buses.actions.backToOrganization")}
            </Button>
          )}

          <CreateBus orgId={orgId} />
        </Stack>
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
          <Table<Bus>
            columns={columns}
            data={buses.data?.data ?? []}
            exportFields={exportFields}
            enableExport
            enablePagination
            manualPagination
            rowCount={buses.data?.meta.total ?? 0}
            onPaginationChange={pagePagination.onPaginationChange}
            enableGlobalFilter
            enableColumnFilters
            manualFiltering
            onGlobalFilterChange={(value) => handleSearchChange(String(value ?? ""))}
            onColumnFiltersChange={handleColumnFiltersChange}
            mobileSearchFields={["plateNumber", "busCode", "manufacturer", "model"]}
            mobilePageSize={pagePagination.pagination.pageSize}
            renderMobileCard={renderBusCard}
            renderMobileFilters={
              <Stack spacing={1.5}>
                <TextField
                  select
                  size="small"
                  label={t("buses.form.status")}
                  value={statusValue}
                  onChange={(event) => setMobileFilter("status", event.target.value)}
                  fullWidth
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>
                  <MenuItem value="AVAILABLE">{t("buses.statuses.AVAILABLE")}</MenuItem>
                  <MenuItem value="IN_SERVICE">{t("buses.statuses.IN_SERVICE")}</MenuItem>
                  <MenuItem value="MAINTENANCE">
                    {t("buses.statuses.MAINTENANCE")}
                  </MenuItem>
                  <MenuItem value="OUT_OF_SERVICE">
                    {t("buses.statuses.OUT_OF_SERVICE")}
                  </MenuItem>
                </TextField>

                <TextField
                  select
                  size="small"
                  label={t("buses.form.type")}
                  value={typeValue}
                  onChange={(event) => setMobileFilter("type", event.target.value)}
                  fullWidth
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>
                  <MenuItem value="STANDARD">{t("buses.types.STANDARD")}</MenuItem>
                  <MenuItem value="MINIBUS">{t("buses.types.MINIBUS")}</MenuItem>
                  <MenuItem value="ARTICULATED">{t("buses.types.ARTICULATED")}</MenuItem>
                </TextField>

                <Button
                  color="inherit"
                  variant="outlined"
                  startIcon={<ClearRoundedIcon />}
                  onClick={handleClearFilters}
                  disabled={!search && columnFilters.length === 0}
                  fullWidth
                >
                  {t("common.clear")}
                </Button>
              </Stack>
            }
            state={{
              isLoading: buses.isLoading || buses.isFetching,
              showAlertBanner: buses.isError,
              pagination: pagePagination.pagination,
              globalFilter: search,
              columnFilters,
            }}
            isError={buses.isError}
            refetch={buses.refetch}
            isRefetching={buses.isRefetching}
            initialState={{
              showGlobalFilter: false,
              showColumnFilters: true,
            }}
            muiPaginationProps={{
              rowsPerPageOptions: [10, 20, 50],
            }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default BusesPage;
