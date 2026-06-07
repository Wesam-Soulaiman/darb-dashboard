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
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnFiltersState } from "material-react-table";

import Table from "../../../components/Table";
import { getSchedulesTableColumns } from "../../../tables-def/schedules";
import { getSchedulesCard } from "../../../card-def/schedules";
import { useSchedules } from "../../../hooks/organizations/useSchedules";
import { usePagePagination } from "../../../hooks/common/usePagePagination";
import { useAuthContext } from "../../../contexts/AuthContext";
import type { Schedule } from "../../../types/schedule.types";
import CreateSchedule from "./components/CreateSchedule";

const DEFAULT_SCHEDULES_LIMIT = 20;

const getFilterValue = (
  filters: MRT_ColumnFiltersState,
  id: string,
): string => {
  const value = filters.find((filter) => filter.id === id)?.value;

  if (typeof value === "string") return value;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);

  return "";
};

const SchedulesPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const { user, isSuperAdmin } = useAuthContext();

  const routeOrgId = Number(params.orgId);
  const userOrgId = Number(user?.organizationId);

  const orgId =
    Number.isFinite(routeOrgId) && routeOrgId > 0 ? routeOrgId : userOrgId;

  const hasValidOrgId = Number.isFinite(orgId) && orgId > 0;

  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>([]);

  const pagePagination = usePagePagination({
    initialPageSize: DEFAULT_SCHEDULES_LIMIT,
  });

  const isActiveValue = getFilterValue(columnFilters, "isActive");

  const schedules = useSchedules(orgId, {
    page: pagePagination.page,
    limit: pagePagination.limit,
    search: search.trim() || undefined,
    isActive:
      isActiveValue === "true"
        ? true
        : isActiveValue === "false"
          ? false
          : undefined,
  });

  const columns = useMemo(
    () =>
      getSchedulesTableColumns({
        t,
      }),
    [t],
  );

  const renderScheduleCard = useMemo(
    () =>
      getSchedulesCard({
        t,
      }),
    [t],
  );

  const exportFields = useMemo<Array<keyof Schedule & string>>(
    () => [
      "id",
      "organizationId",
      "name",
      "serviceCode",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
      "startDate",
      "endDate",
      "isActive",
      "createdAt",
      "updatedAt",
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

  const setMobileIsActiveFilter = (value: string) => {
    handleColumnFiltersChange((current) => {
      const withoutCurrentFilter = current.filter(
        (filter) => filter.id !== "isActive",
      );

      return value
        ? [...withoutCurrentFilter, { id: "isActive", value }]
        : withoutCurrentFilter;
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
          {t("schedules.noOrganizationTitle")}
        </Typography>

        <Typography color="text.secondary">
          {t("schedules.noOrganizationMessage")}
        </Typography>

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
            <EventAvailableRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("schedules.title")}
            </Typography>

            <Typography color="text.secondary">
              {t("schedules.subtitle")}
            </Typography>
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
              {t("schedules.actions.backToOrganization")}
            </Button>
          )}

          <CreateSchedule orgId={orgId} />
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
          <Table<Schedule>
            columns={columns}
            data={schedules.data?.data ?? []}
            exportFields={exportFields}
            enableExport
            enablePagination
            manualPagination
            rowCount={schedules.data?.meta.total ?? 0}
            onPaginationChange={pagePagination.onPaginationChange}
            enableGlobalFilter
            enableColumnFilters
            manualFiltering
            onGlobalFilterChange={(value) =>
              handleSearchChange(String(value ?? ""))
            }
            onColumnFiltersChange={handleColumnFiltersChange}
            mobileSearchFields={["name", "serviceCode"]}
            mobilePageSize={pagePagination.pagination.pageSize}
            renderMobileCard={renderScheduleCard}
            renderMobileFilters={
              <Stack spacing={1.5}>
                <TextField
                  select
                  size="small"
                  label={t("schedules.form.isActive")}
                  value={isActiveValue}
                  onChange={(event) =>
                    setMobileIsActiveFilter(event.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>
                  <MenuItem value="true">{t("common.active")}</MenuItem>
                  <MenuItem value="false">{t("common.inactive")}</MenuItem>
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
              isLoading: schedules.isLoading || schedules.isFetching,
              showAlertBanner: schedules.isError,
              pagination: pagePagination.pagination,
              globalFilter: search,
              columnFilters,
            }}
            isError={schedules.isError}
            refetch={schedules.refetch}
            isRefetching={schedules.isRefetching}
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

export default SchedulesPage;