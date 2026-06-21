import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import DepartureBoardRoundedIcon from "@mui/icons-material/DepartureBoardRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "../../../contexts/AuthContext";
import { useBuses } from "../../../hooks/organizations/useBuses";
import { useDrivers } from "../../../hooks/organizations/useDrivers";
import { useOrganization } from "../../../hooks/organizations/useOrganizations";
import { useDailyRuns, useRunStats } from "../../../hooks/organizations/useRuns";
import { useRunsRealtime } from "../../../hooks/organizations/useRunsRealtime";

import type { Run } from "../../../types/run.types";

import { groupRunsByRoute } from "../../../utils/run.utils";

import RunRouteSection from "./components/RunRouteSection";
import RunsEmptyState from "./components/RunsEmptyState";
import RunsRealtimeStatus from "./components/RunsRealtimeStatus";
import RunsStats from "./components/RunsStats";

const OPTIONS_LIMIT = 100;

const RunsPage = () => {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const { user, isSuperAdmin } = useAuthContext();

  const routeOrgId = Number(params.orgId);
  const userOrgId = Number(user?.organizationId);

  const orgId = Number.isFinite(routeOrgId) && routeOrgId > 0 ? routeOrgId : userOrgId;

  const hasValidOrgId = Number.isFinite(orgId) && orgId > 0;

  const today = dayjs().format("YYYY-MM-DD");

  const [showFinished, setShowFinished] = useState(false);

  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  const organization = useOrganization(hasValidOrgId ? orgId : Number.NaN);

  const dailyRuns = useDailyRuns(orgId, today, !showFinished, hasValidOrgId);

  const realtimeRunIds = useMemo(
    () => (dailyRuns.data ?? []).map((run) => run.id),
    [dailyRuns.data],
  );

  const runsRealtime = useRunsRealtime(orgId, realtimeRunIds, hasValidOrgId);

  const buses = useBuses(orgId, {
    page: 1,
    limit: OPTIONS_LIMIT,
  });

  const drivers = useDrivers(orgId, {
    page: 1,
    limit: OPTIONS_LIMIT,
  });

  const stats = useRunStats(
    orgId,
    {
      fromDate: today,
      toDate: today,
    },
    hasValidOrgId,
  );

  const orgRoutes = useMemo(
    () => organization.data?.orgRoutes ?? [],
    [organization.data?.orgRoutes],
  );

  const busesList = useMemo(() => buses.data?.data ?? [], [buses.data?.data]);

  const driversList = useMemo(() => drivers.data?.data ?? [], [drivers.data?.data]);

  const runsByRoute = useMemo(
    () => groupRunsByRoute(dailyRuns.data ?? []),
    [dailyRuns.data],
  );

  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";

  const formattedToday = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
  }).format(new Date());

  const handleRouteExpandedChange = useCallback((routeId: string, expanded: boolean) => {
    setExpandedRouteId(expanded ? routeId : null);
  }, []);

  const handleTrackRun = useCallback(
    (run: Run) => {
      const trackingPath = params.orgId
        ? `/admin/dashboard/organizations/${orgId}/runs/${run.id}/tracking`
        : `/admin/dashboard/runs/${run.id}/tracking`;

      navigate(trackingPath);
    },
    [navigate, orgId, params.orgId],
  );

  const archivePath = params.orgId
    ? `/admin/dashboard/organizations/${orgId}/runs/archive`
    : "/admin/dashboard/runs/archive";

  const optionsLoading =
    buses.isLoading || buses.isFetching || drivers.isLoading || drivers.isFetching;

  if (!hasValidOrgId) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
              }}
            >
              {t("runs.noOrganizationTitle")}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {t("runs.noOrganizationMessage")}
            </Typography>

            {isSuperAdmin && (
              <Button
                component={RouterLink}
                to="/admin/dashboard/organizations"
                variant="contained"
                sx={{
                  alignSelf: "flex-start",
                }}
              >
                {t("organizations.title")}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
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
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            md: "center",
          },
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
            <DepartureBoardRoundedIcon />
          </Box>

          <Box>
            <Stack
              direction="row"
              spacing={1.25}
              useFlexGap
              sx={{
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                }}
              >
                {t("runs.title")}
              </Typography>

              <RunsRealtimeStatus
                status={runsRealtime.status}
                error={runsRealtime.lastError}
              />
            </Stack>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {t("runs.subtitle")}
            </Typography>
          </Box>
        </Stack>

        <Button
          component={RouterLink}
          to={archivePath}
          variant="outlined"
          startIcon={<ArchiveRoundedIcon />}
          sx={{
            marginInlineStart: {
              md: "auto",
            },
            borderRadius: 2,
          }}
        >
          {t("runs.actions.archive")}
        </Button>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <TodayRoundedIcon color="primary" />

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {t("runs.today.label")}
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {formattedToday}
                </Typography>
              </Box>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={showFinished}
                  onChange={(event) => {
                    setShowFinished(event.target.checked);
                  }}
                />
              }
              label={t("runs.filters.showFinished")}
              sx={{
                marginInlineStart: {
                  sm: "auto",
                },
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      <RunsStats
        stats={stats.data}
        loading={stats.isLoading || stats.isFetching}
        error={stats.isError}
        onRetry={() => {
          void stats.refetch();
        }}
      />

      {(buses.isError || drivers.isError) && (
        <Alert severity="warning">{t("runs.optionsLoadError")}</Alert>
      )}

      {organization.isError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                void organization.refetch();
              }}
            >
              {t("common.retry")}
            </Button>
          }
        >
          {t("runs.routesLoadError")}
        </Alert>
      )}

      {dailyRuns.isError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                void dailyRuns.refetch();
              }}
            >
              {t("common.retry")}
            </Button>
          }
        >
          {t("runs.loadError")}
        </Alert>
      )}

      {(organization.isLoading || dailyRuns.isLoading) && (
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

      {!organization.isLoading &&
        !dailyRuns.isLoading &&
        !organization.isError &&
        !dailyRuns.isError &&
        orgRoutes.length === 0 && (
          <RunsEmptyState
            title={t("runs.empty.noRoutesTitle")}
            description={t("runs.empty.noRoutesDescription")}
          />
        )}

      {!organization.isLoading &&
        !dailyRuns.isLoading &&
        !organization.isError &&
        !dailyRuns.isError &&
        orgRoutes.map((orgRoute) => {
          const routeId = orgRoute.route.id;

          return (
            <RunRouteSection
              key={routeId}
              orgId={orgId}
              routeId={routeId}
              routeName={orgRoute.route.name}
              runs={runsByRoute.get(routeId) ?? []}
              drivers={driversList}
              buses={busesList}
              optionsLoading={optionsLoading}
              expanded={expandedRouteId === routeId}
              onExpandedChange={handleRouteExpandedChange}
              onTrack={handleTrackRun}
            />
          );
        })}
    </Stack>
  );
};

export default RunsPage;
