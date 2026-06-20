import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useParams } from "react-router-dom";

import { useAuthContext } from "../../../contexts/AuthContext";
import { useBuses } from "../../../hooks/organizations/useBuses";
import { useDrivers } from "../../../hooks/organizations/useDrivers";
import { useOrganization } from "../../../hooks/organizations/useOrganizations";
import { useRuns } from "../../../hooks/organizations/useRuns";
import { useSchedules } from "../../../hooks/organizations/useSchedules";
import { useTrips } from "../../../hooks/organizations/useTrips";

import type { GetRunsParams } from "../../../types/run.types";

import RunArchiveCard from "./components/RunArchiveCard";
import RunsArchiveFilters, {
  type RunsArchiveFiltersValue,
} from "./components/RunsArchiveFilters";
import RunsEmptyState from "./components/RunsEmptyState";

const PAGE_SIZE = 24;
const OPTIONS_LIMIT = 100;

const createDefaultFilters = (): RunsArchiveFiltersValue => ({
  dateMode: "range",
  date: "",
  fromDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
  toDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  tripId: "",
  scheduleId: "",
  driverId: "",
  routeId: "",
  busId: "",
  status: "",
  excludeFinished: false,
});

const RunsArchivePage = () => {
  const { t } = useTranslation();
  const params = useParams();

  const { user } = useAuthContext();

  const routeOrgId = Number(params.orgId);

  const userOrgId = Number(user?.organizationId);

  const orgId = Number.isFinite(routeOrgId) && routeOrgId > 0 ? routeOrgId : userOrgId;

  const hasValidOrgId = Number.isFinite(orgId) && orgId > 0;

  const [page, setPage] = useState(1);

  const [draftFilters, setDraftFilters] =
    useState<RunsArchiveFiltersValue>(createDefaultFilters);

  const [appliedFilters, setAppliedFilters] =
    useState<RunsArchiveFiltersValue>(createDefaultFilters);

  const organization = useOrganization(hasValidOrgId ? orgId : Number.NaN);

  const trips = useTrips(orgId, {
    page: 1,
    limit: OPTIONS_LIMIT,
  });

  const schedules = useSchedules(orgId, {
    page: 1,
    limit: OPTIONS_LIMIT,
  });

  const drivers = useDrivers(orgId, {
    page: 1,
    limit: OPTIONS_LIMIT,
  });

  const buses = useBuses(orgId, {
    page: 1,
    limit: OPTIONS_LIMIT,
  });

  const queryParams = useMemo<GetRunsParams>(() => {
    const result: GetRunsParams = {
      page,
      limit: PAGE_SIZE,
      excludeFinished: appliedFilters.excludeFinished,
    };

    if (appliedFilters.dateMode === "exact" && appliedFilters.date) {
      result.date = appliedFilters.date;
    }

    if (appliedFilters.dateMode === "range") {
      if (appliedFilters.fromDate) {
        result.fromDate = appliedFilters.fromDate;
      }

      if (appliedFilters.toDate) {
        result.toDate = appliedFilters.toDate;
      }
    }

    if (appliedFilters.tripId) {
      result.tripId = Number(appliedFilters.tripId);
    }

    if (appliedFilters.scheduleId) {
      result.scheduleId = Number(appliedFilters.scheduleId);
    }

    if (appliedFilters.driverId) {
      result.driverId = Number(appliedFilters.driverId);
    }

    if (appliedFilters.busId) {
      result.busId = Number(appliedFilters.busId);
    }

    if (appliedFilters.routeId) {
      result.routeId = appliedFilters.routeId;
    }

    if (appliedFilters.status) {
      result.status = appliedFilters.status;
    }

    return result;
  }, [appliedFilters, page]);

  const archiveRuns = useRuns(orgId, queryParams, hasValidOrgId);

  const routes = useMemo(
    () =>
      (organization.data?.orgRoutes ?? []).map((orgRoute) => ({
        id: orgRoute.route.id,
        name: orgRoute.route.name,
      })),
    [organization.data?.orgRoutes],
  );

  const routeNames = useMemo(
    () => new Map(routes.map((route) => [route.id, route.name])),
    [routes],
  );

  const tripsList = trips.data?.data ?? [];

  const schedulesList = schedules.data?.data ?? [];

  const driversList = drivers.data?.data ?? [];

  const busesList = buses.data?.data ?? [];

  const optionsLoading =
    organization.isLoading ||
    trips.isLoading ||
    schedules.isLoading ||
    drivers.isLoading ||
    buses.isLoading;

  const dailyPath = params.orgId
    ? `/admin/dashboard/organizations/${orgId}/runs`
    : "/admin/dashboard/runs";

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    const defaults = createDefaultFilters();

    setDraftFilters(defaults);
    setAppliedFilters(defaults);
    setPage(1);
  };

  if (!hasValidOrgId) {
    return <Alert severity="warning">{t("runs.noOrganizationMessage")}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        sx={{
          alignItems: {
            justifyContent: "space-between",
            xs: "stretch",
            md: "center",
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
          }}
        >
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
            <ArchiveRoundedIcon />
          </Box>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
              }}
            >
              {t("runs.archive.title")}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {t("runs.archive.subtitle")}
            </Typography>
          </Box>
        </Stack>

        <Button
          component={RouterLink}
          to={dailyPath}
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            marginInlineStart: {
              md: "auto",
            },
            borderRadius: 2,
          }}
        >
          {t("runs.archive.backToToday")}
        </Button>
      </Stack>

      <RunsArchiveFilters
        value={draftFilters}
        routes={routes}
        trips={tripsList}
        schedules={schedulesList}
        drivers={driversList}
        buses={busesList}
        optionsLoading={optionsLoading}
        onChange={setDraftFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {archiveRuns.isError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                archiveRuns.refetch();
              }}
            >
              {t("common.retry")}
            </Button>
          }
        >
          {t("runs.archive.loadError")}
        </Alert>
      )}

      {archiveRuns.isLoading && (
        <Stack
          sx={{
            minHeight: 240,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Stack>
      )}

      {!archiveRuns.isLoading &&
        !archiveRuns.isError &&
        archiveRuns.data?.data.length === 0 && (
          <RunsEmptyState
            title={t("runs.archive.empty.title")}
            description={t("runs.archive.empty.description")}
          />
        )}

      {!archiveRuns.isLoading &&
        !archiveRuns.isError &&
        archiveRuns.data &&
        archiveRuns.data.data.length > 0 && (
          <>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {t("runs.archive.resultCount", {
                    count: archiveRuns.data.meta.total,
                  })}
                </Typography>
              </CardContent>
            </Card>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                  xl: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {archiveRuns.data.data.map((run) => (
                <RunArchiveCard
                  key={run.id}
                  run={run}
                  routeName={routeNames.get(run.trip.routeId) ?? run.trip.routeId}
                />
              ))}
            </Box>

            {archiveRuns.data.meta.totalPages > 1 && (
              <Pagination
                page={page}
                count={archiveRuns.data.meta.totalPages}
                onChange={(_event, newPage) => {
                  setPage(newPage);
                }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            )}
          </>
        )}
    </Stack>
  );
};

export default RunsArchivePage;
