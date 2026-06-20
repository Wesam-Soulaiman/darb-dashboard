import { useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useParams } from "react-router-dom";

import { useAuthContext } from "../../../contexts/AuthContext";

import { useRun, useRunLocation } from "../../../hooks/organizations/useRuns";

import { useRunLiveTracking } from "../../../hooks/organizations/useRunLiveTracking";

import RunStatusChip from "./components/RunStatusChip";
import RunsRealtimeStatus from "./components/RunsRealtimeStatus";
import RunTrackingMap from "./components/RunTrackingMap";

const RunTrackingPage = () => {
  const { t, i18n } = useTranslation();

  const params = useParams();

  const { user } = useAuthContext();

  const routeOrgId = Number(params.orgId);

  const userOrgId = Number(user?.organizationId);

  const orgId = Number.isFinite(routeOrgId) && routeOrgId > 0 ? routeOrgId : userOrgId;

  const runId = Number(params.runId);

  const hasValidIds =
    Number.isFinite(orgId) && orgId > 0 && Number.isFinite(runId) && runId > 0;

  const runQuery = useRun(orgId, runId, hasValidIds);

  const locationQuery = useRunLocation(
    orgId,
    runId,
    hasValidIds && runQuery.data?.status === "in_progress",
  );

  const liveTracking = useRunLiveTracking({
    orgId,
    runId,
    enabled: hasValidIds,
    initialLocation: locationQuery.data,
    initialStatus: runQuery.data?.status,
  });

  const backPath = params.orgId
    ? `/admin/dashboard/organizations/${orgId}/runs`
    : "/admin/dashboard/runs";

  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";

  const formattedTimestamp = useMemo(() => {
    const value = liveTracking.location?.timestamp;

    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(date);
  }, [liveTracking.location?.timestamp, locale]);

  if (!hasValidIds) {
    return <Alert severity="error">{t("runs.tracking.invalidRun")}</Alert>;
  }

  if (runQuery.isLoading) {
    return (
      <Stack
        sx={{
          minHeight: 300,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (runQuery.isError || !runQuery.data) {
    return <Alert severity="error">{t("runs.tracking.loadError")}</Alert>;
  }

  const run = runQuery.data;

  const displayedStatus = liveTracking.runStatus ?? run.status;

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
          <GpsFixedRoundedIcon
            color="primary"
            sx={{
              fontSize: 38,
            }}
          />

          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                }}
              >
                {t("runs.tracking.title")}
              </Typography>

              <RunStatusChip status={displayedStatus} />

              <RunsRealtimeStatus
                status={liveTracking.connectionStatus}
                error={liveTracking.lastError}
              />
            </Stack>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {run.operatingTime} — {run.trip.headsign}
            </Typography>
          </Box>
        </Stack>

        <Button
          component={RouterLink}
          to={backPath}
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            marginInlineStart: {
              md: "auto",
            },
          }}
        >
          {t("runs.tracking.backToRuns")}
        </Button>
      </Stack>

      {!liveTracking.location && (
        <Alert severity="info">{t("runs.tracking.waitingForLocation")}</Alert>
      )}

      {liveTracking.dropOffRequest && (
        <Alert severity="warning">
          {t("runs.tracking.dropOffRequested", {
            stopId: liveTracking.dropOffRequest.stopId,
          })}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 2fr) minmax(280px, 1fr)",
          },
          gap: 3,
        }}
      >
        <RunTrackingMap location={liveTracking.location} />

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                }}
              >
                {t("runs.tracking.details")}
              </Typography>

              <Divider />

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {t("runs.tracking.driver")}
                </Typography>

                <Typography>
                  {run.driver
                    ? `${run.driver.firstName} ${run.driver.lastName}`
                    : t("runs.card.unassignedDriver")}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {t("runs.tracking.bus")}
                </Typography>

                <Typography>
                  {run.bus
                    ? `${run.bus.plateNumber} — ${run.bus.busCode}`
                    : t("runs.card.unassignedBus")}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {t("runs.tracking.velocity")}
                </Typography>

                <Typography>
                  {liveTracking.location ? liveTracking.location.velocity : "—"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {t("runs.tracking.lastUpdate")}
                </Typography>

                <Typography>{formattedTimestamp ?? "—"}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {t("runs.tracking.currentStopSequence")}
                </Typography>

                <Typography>
                  {liveTracking.stopSequence?.currentStopSequence ?? "—"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {t("runs.tracking.lastPassedStop")}
                </Typography>

                <Typography>{liveTracking.stopSequence?.passedStopId ?? "—"}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
};

export default RunTrackingPage;
