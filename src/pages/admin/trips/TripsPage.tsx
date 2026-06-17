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
import AltRouteRoundedIcon from "@mui/icons-material/AltRouteRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import type { MRT_ColumnFiltersState } from "material-react-table";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useParams } from "react-router-dom";

import { getTripsCard } from "../../../card-def/trips";
import Table from "../../../components/Table";
import { useAuthContext } from "../../../contexts/AuthContext";
import { usePagePagination } from "../../../hooks/common/usePagePagination";
import { useBuses } from "../../../hooks/organizations/useBuses";
import { useDrivers } from "../../../hooks/organizations/useDrivers";
import { useOrganization } from "../../../hooks/organizations/useOrganizations";
import { useSchedules } from "../../../hooks/organizations/useSchedules";
import { useTrips } from "../../../hooks/organizations/useTrips";
import { getTripsTableColumns } from "../../../tables-def/trips";
import type { Trip } from "../../../types/trip.types";
import CreateTrip from "./components/CreateTrip";

const DEFAULT_TRIPS_LIMIT = 20;
const OPTIONS_LIMIT = 100;

const getFilterValue = (filters: MRT_ColumnFiltersState, id: string) => {
  const value = filters.find((filter) => filter.id === id)?.value;

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
};

const TripsPage = () => {
  const { t, i18n } = useTranslation();
  const params = useParams();

  const { user, isSuperAdmin } = useAuthContext();

  const routeOrgId = Number(params.orgId);
  const userOrgId = Number(user?.organizationId);

  const orgId = Number.isFinite(routeOrgId) && routeOrgId > 0 ? routeOrgId : userOrgId;

  const hasValidOrgId = Number.isFinite(orgId) && orgId > 0;

  const [search, setSearch] = useState("");

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  const pagePagination = usePagePagination({
    initialPageSize: DEFAULT_TRIPS_LIMIT,
  });

  const routeIdValue = getFilterValue(columnFilters, "routeId");
  const scheduleIdValue = getFilterValue(columnFilters, "scheduleId");
  const isActiveValue = getFilterValue(columnFilters, "isActive");

  const organization = useOrganization(hasValidOrgId ? orgId : Number.NaN);

  const schedules = useSchedules(orgId, {
    page: 1,
    limit: OPTIONS_LIMIT,
  });

  const buses = useBuses(orgId, {
    page: 1,
    limit: OPTIONS_LIMIT,
  });

  const drivers = useDrivers(orgId, {
    page: 1,
    limit: OPTIONS_LIMIT,
  });

  const trips = useTrips(orgId, {
    page: pagePagination.page,
    limit: pagePagination.limit,
    search: search.trim() || undefined,
    routeId: routeIdValue || undefined,
    scheduleId: scheduleIdValue ? Number(scheduleIdValue) : undefined,
    isActive:
      isActiveValue === "true" ? true : isActiveValue === "false" ? false : undefined,
  });

  const orgRoutes = useMemo(
    () => organization.data?.orgRoutes ?? [],
    [organization.data?.orgRoutes],
  );

  const schedulesList = useMemo(() => schedules.data?.data ?? [], [schedules.data?.data]);

  const busesList = useMemo(() => buses.data?.data ?? [], [buses.data?.data]);

  const driversList = useMemo(() => drivers.data?.data ?? [], [drivers.data?.data]);

  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";

  const columns = useMemo(
    () =>
      getTripsTableColumns({
        t,
        locale,
        orgRoutes,
        schedules: schedulesList,
        buses: busesList,
        drivers: driversList,
      }),
    [busesList, driversList, locale, orgRoutes, schedulesList, t],
  );

  const renderTripCard = useMemo(
    () =>
      getTripsCard({
        t,
        orgRoutes,
        schedules: schedulesList,
        buses: busesList,
        drivers: driversList,
      }),
    [busesList, driversList, orgRoutes, schedulesList, t],
  );

  const exportFields = useMemo<Array<keyof Trip & string>>(
    () => [
      "id",
      "organizationId",
      "headsign",
      "directionId",
      "blockId",
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

  const setMobileFilter = (id: "routeId" | "scheduleId" | "isActive", value: string) => {
    handleColumnFiltersChange((current) => {
      const remaining = current.filter((filter) => filter.id !== id);

      return value ? [...remaining, { id, value }] : remaining;
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
          {t("trips.noOrganizationTitle")}
        </Typography>

        <Typography color="text.secondary">{t("trips.noOrganizationMessage")}</Typography>

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
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <AltRouteRoundedIcon />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {t("trips.title")}
            </Typography>

            <Typography color="text.secondary">{t("trips.subtitle")}</Typography>
          </Box>
        </Stack>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
        >
          {isSuperAdmin && params.orgId && (
            <Button
              component={RouterLink}
              to={`/admin/dashboard/organizations/${orgId}`}
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
            >
              {t("trips.actions.backToOrganization")}
            </Button>
          )}

          <CreateTrip
            orgId={orgId}
            orgRoutes={orgRoutes}
            schedules={schedulesList}
            buses={busesList}
            drivers={driversList}
          />
        </Stack>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
            <TimelineRoundedIcon color="primary" />

            <Box>
              <Typography sx={{ fontWeight: 900 }}>{t("trips.uxGuide.title")}</Typography>

              <Typography variant="body2" color="text.secondary">
                {t("trips.uxGuide.description")}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
          <Table<Trip>
            columns={columns}
            data={trips.data?.data ?? []}
            exportFields={exportFields}
            enableExport
            enablePagination
            manualPagination
            rowCount={trips.data?.meta.total ?? 0}
            onPaginationChange={pagePagination.onPaginationChange}
            enableGlobalFilter
            enableColumnFilters
            manualFiltering
            onGlobalFilterChange={(value) => handleSearchChange(String(value ?? ""))}
            onColumnFiltersChange={handleColumnFiltersChange}
            mobileSearchFields={["headsign", "blockId"]}
            mobilePageSize={pagePagination.pagination.pageSize}
            renderMobileCard={renderTripCard}
            renderMobileFilters={
              <Stack spacing={1.5}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label={t("trips.form.route")}
                  value={routeIdValue}
                  onChange={(event) => setMobileFilter("routeId", event.target.value)}
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>

                  {orgRoutes.map((orgRoute) => (
                    <MenuItem key={orgRoute.route.id} value={orgRoute.route.id}>
                      {orgRoute.route.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  fullWidth
                  label={t("trips.form.schedule")}
                  value={scheduleIdValue}
                  onChange={(event) => setMobileFilter("scheduleId", event.target.value)}
                >
                  <MenuItem value="">{t("common.all")}</MenuItem>

                  {schedulesList.map((schedule) => (
                    <MenuItem key={schedule.id} value={String(schedule.id)}>
                      {schedule.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  fullWidth
                  label={t("trips.form.isActive")}
                  value={isActiveValue}
                  onChange={(event) => setMobileFilter("isActive", event.target.value)}
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
              isLoading:
                trips.isLoading ||
                trips.isFetching ||
                organization.isLoading ||
                schedules.isLoading ||
                buses.isLoading ||
                drivers.isLoading,

              showAlertBanner: trips.isError,

              pagination: pagePagination.pagination,

              globalFilter: search,

              columnFilters,
            }}
            isError={trips.isError}
            refetch={trips.refetch}
            isRefetching={trips.isRefetching}
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

export default TripsPage;
