import { useMemo, type ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useParams } from "react-router-dom";

import { useAuthContext } from "../../../contexts/AuthContext";

import { useRoute } from "../../../hooks/locations/useRoutes";
import { useRunLiveTracking } from "../../../hooks/organizations/useRunLiveTracking";
import { useRun, useRunLocation } from "../../../hooks/organizations/useRuns";

import type { RouteNode } from "../../../types/route.types";

import RunStatusChip from "./components/RunStatusChip";
import RunsRealtimeStatus from "./components/RunsRealtimeStatus";
import RunTrackingMap from "./components/RunTrackingMap";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  helper?: ReactNode;
};

type DetailRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
};

type RouteStopsTimelineProps = {
  routeNodes: RouteNode[];
  currentStopIndex: number;
  passedStopId?: string | null;
  dropOffStopId?: string | null;
};

const MetricCard = ({ icon, label, value, helper }: MetricCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        minWidth: 0,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "action.hover",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              {label}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                lineHeight: 1.25,
                overflowWrap: "anywhere",
              }}
            >
              {value}
            </Typography>

            {helper && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                {helper}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const DetailRow = ({ icon, label, value }: DetailRowProps) => {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          mt: 0.25,
          color: "text.secondary",
          display: "flex",
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};

const RouteStopsTimeline = ({
  routeNodes,
  currentStopIndex,
  passedStopId,
  dropOffStopId,
}: RouteStopsTimelineProps) => {
  const { t } = useTranslation();

  if (routeNodes.length === 0) {
    return <Alert severity="info">{t("runs.tracking.noRouteStops")}</Alert>;
  }

  return (
    <Stack spacing={0}>
      {routeNodes.map((routeNode, index) => {
        const isCurrent = index === currentStopIndex;

        const isPassed = index < currentStopIndex || routeNode.node.id === passedStopId;

        const hasDropOffRequest = routeNode.node.id === dropOffStopId;

        const isLast = index === routeNodes.length - 1;

        return (
          <Stack
            key={routeNode.node.id}
            direction="row"
            spacing={1.25}
            sx={{
              alignItems: "stretch",
              minHeight: 68,
            }}
          >
            <Stack
              sx={{
                width: 30,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: isCurrent ? 28 : 23,
                  height: isCurrent ? 28 : 23,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: isCurrent
                    ? "warning.main"
                    : isPassed
                      ? "success.main"
                      : "background.paper",
                  color: isCurrent || isPassed ? "common.white" : "text.secondary",
                  border: 2,
                  borderColor: isCurrent
                    ? "warning.dark"
                    : isPassed
                      ? "success.dark"
                      : "divider",
                  zIndex: 1,
                }}
              >
                {isCurrent ? (
                  <RadioButtonCheckedRoundedIcon
                    sx={{
                      fontSize: 17,
                    }}
                  />
                ) : isPassed ? (
                  <CheckCircleRoundedIcon
                    sx={{
                      fontSize: 15,
                    }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {routeNode.ordering}
                  </Typography>
                )}
              </Box>

              {!isLast && (
                <Box
                  sx={{
                    width: 3,
                    flex: 1,
                    minHeight: 35,
                    bgcolor: isPassed ? "success.main" : "divider",
                  }}
                />
              )}
            </Stack>

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                pb: 1.5,
              }}
            >
              <Stack
                direction="row"
                spacing={0.75}
                useFlexGap
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isCurrent ? 800 : 650,
                  }}
                >
                  {routeNode.node.name}
                </Typography>

                {isCurrent && (
                  <Chip
                    size="small"
                    color="warning"
                    label={t("runs.tracking.currentStop")}
                  />
                )}

                {isPassed && !isCurrent && (
                  <Chip
                    size="small"
                    color="success"
                    variant="outlined"
                    label={t("runs.tracking.passedStop")}
                  />
                )}

                {hasDropOffRequest && (
                  <Chip size="small" color="error" label={t("runs.tracking.dropOff")} />
                )}
              </Stack>

              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                {t("runs.tracking.stopSequenceValue", {
                  value: routeNode.ordering,
                })}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
};

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

  const routeId = runQuery.data?.trip.routeId;

  const routeQuery = useRoute(routeId);

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

  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";

  const backPath = params.orgId
    ? `/admin/dashboard/organizations/${orgId}/runs`
    : "/admin/dashboard/runs";

  const routeNodes = useMemo(() => {
    return [...(routeQuery.data?.routeNodes ?? [])].sort(
      (first, second) => first.ordering - second.ordering,
    );
  }, [routeQuery.data?.routeNodes]);

  const currentStopIndex = useMemo(() => {
    const sequence = liveTracking.stopSequence?.currentStopSequence;

    if (sequence !== undefined && sequence !== null) {
      const sequenceIndex = routeNodes.findIndex(
        (routeNode) => routeNode.ordering === sequence,
      );

      if (sequenceIndex >= 0) {
        return sequenceIndex;
      }
    }

    const passedStopId = liveTracking.stopSequence?.passedStopId;

    if (passedStopId) {
      const passedIndex = routeNodes.findIndex(
        (routeNode) => routeNode.node.id === passedStopId,
      );

      if (passedIndex >= 0) {
        return Math.min(passedIndex + 1, routeNodes.length - 1);
      }
    }

    return -1;
  }, [
    liveTracking.stopSequence?.currentStopSequence,
    liveTracking.stopSequence?.passedStopId,
    routeNodes,
  ]);

  const currentStop = currentStopIndex >= 0 ? routeNodes[currentStopIndex] : null;

  const lastPassedStop = useMemo(() => {
    const stopId = liveTracking.stopSequence?.passedStopId;

    if (!stopId) {
      return null;
    }

    return routeNodes.find((routeNode) => routeNode.node.id === stopId) ?? null;
  }, [liveTracking.stopSequence?.passedStopId, routeNodes]);

  const dropOffStop = useMemo(() => {
    const stopId = liveTracking.dropOffRequest?.stopId;

    if (!stopId) {
      return null;
    }

    return routeNodes.find((routeNode) => routeNode.node.id === stopId) ?? null;
  }, [liveTracking.dropOffRequest?.stopId, routeNodes]);

  const progressValue =
    routeNodes.length > 0 && currentStopIndex >= 0
      ? Math.min(100, Math.round(((currentStopIndex + 1) / routeNodes.length) * 100))
      : 0;

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

  const formattedOperatingDate = useMemo(() => {
    const value = runQuery.data?.operatingDate;

    if (!value) {
      return "—";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
    }).format(date);
  }, [locale, runQuery.data?.operatingDate]);

  const formattedVelocity = liveTracking.location
    ? new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
      }).format(liveTracking.location.velocity)
    : "—";

  if (!hasValidIds) {
    return <Alert severity="error">{t("runs.tracking.invalidRun")}</Alert>;
  }

  if (runQuery.isLoading) {
    return (
      <Stack
        sx={{
          minHeight: 360,
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

  const isRunInProgress = displayedStatus === "in_progress";

  return (
    <Stack spacing={3}>
      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            md: 2.5,
          },
          borderRadius: 3,
        }}
      >
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
            spacing={1.75}
            sx={{
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                flexShrink: 0,
              }}
            >
              <GpsFixedRoundedIcon
                sx={{
                  fontSize: 30,
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={1}
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
                {routeQuery.data?.name ?? run.trip.headsign}
                {" · "}
                {run.operatingTime}
                {" · "}
                {run.trip.headsign}
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
              borderRadius: 2,
            }}
          >
            {t("runs.tracking.backToRuns")}
          </Button>
        </Stack>
      </Paper>

      {isRunInProgress && !liveTracking.location && (
        <Alert severity="info">{t("runs.tracking.waitingForLocation")}</Alert>
      )}

      {!isRunInProgress && (
        <Alert severity={displayedStatus === "cancelled" ? "warning" : "info"}>
          {t("runs.tracking.runNotInProgress")}
        </Alert>
      )}

      {routeQuery.isError && (
        <Alert severity="error">{t("runs.tracking.routeLoadError")}</Alert>
      )}

      {liveTracking.dropOffRequest && (
        <Alert severity="warning">
          {t("runs.tracking.dropOffRequested", {
            stop: dropOffStop?.node.name ?? liveTracking.dropOffRequest.stopId,
          })}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <MetricCard
          icon={<ScheduleRoundedIcon />}
          label={t("runs.tracking.operatingTime")}
          value={run.operatingTime}
          helper={formattedOperatingDate}
        />

        <MetricCard
          icon={<SpeedRoundedIcon />}
          label={t("runs.tracking.velocity")}
          value={formattedVelocity}
          helper={t("runs.tracking.reportedValue")}
        />

        <MetricCard
          icon={<PlaceRoundedIcon />}
          label={t("runs.tracking.currentStop")}
          value={currentStop?.node.name ?? "—"}
          helper={
            routeNodes.length > 0 && currentStopIndex >= 0
              ? t("runs.tracking.stopProgress", {
                  current: currentStopIndex + 1,
                  total: routeNodes.length,
                })
              : undefined
          }
        />

        <MetricCard
          icon={<UpdateRoundedIcon />}
          label={t("runs.tracking.lastUpdate")}
          value={formattedTimestamp ?? "—"}
        />
      </Box>

      {routeNodes.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 3,
          }}
        >
          <Stack spacing={1}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 800,
                }}
              >
                {t("runs.tracking.routeProgress")}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                {progressValue}%
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 9,
                borderRadius: 999,
              }}
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
              sx={{
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                {t("runs.tracking.lastPassedStopValue", {
                  value: lastPassedStop?.node.name ?? "—",
                })}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                {t("runs.tracking.totalStopsValue", {
                  value: routeNodes.length,
                })}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            xl: "minmax(0, 2fr) minmax(330px, 0.8fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {routeQuery.isLoading ? (
          <Paper
            variant="outlined"
            sx={{
              minHeight: 680,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress />
          </Paper>
        ) : routeQuery.data ? (
          <RunTrackingMap
            route={routeQuery.data}
            location={liveTracking.location}
            currentStopSequence={liveTracking.stopSequence?.currentStopSequence}
            passedStopId={liveTracking.stopSequence?.passedStopId}
          />
        ) : (
          <Alert severity="error">{t("runs.tracking.routeLoadError")}</Alert>
        )}

        <Stack spacing={2}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <DirectionsBusRoundedIcon color="primary" />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {t("runs.tracking.runDetails")}
                  </Typography>
                </Stack>

                <Divider />

                <DetailRow
                  icon={<RouteRoundedIcon fontSize="small" />}
                  label={t("runs.tracking.route")}
                  value={routeQuery.data?.name ?? run.trip.routeId}
                />

                <DetailRow
                  icon={<PersonRoundedIcon fontSize="small" />}
                  label={t("runs.tracking.driver")}
                  value={
                    run.driver
                      ? `${run.driver.firstName} ${run.driver.lastName} — ${run.driver.phone}`
                      : t("runs.card.unassignedDriver")
                  }
                />

                <DetailRow
                  icon={<DirectionsBusRoundedIcon fontSize="small" />}
                  label={t("runs.tracking.bus")}
                  value={
                    run.bus
                      ? `${run.bus.plateNumber} — ${run.bus.busCode}`
                      : t("runs.card.unassignedBus")
                  }
                />

                <DetailRow
                  icon={<CalendarMonthRoundedIcon fontSize="small" />}
                  label={t("runs.tracking.operatingDate")}
                  value={formattedOperatingDate}
                />

                <DetailRow
                  icon={<GpsFixedRoundedIcon fontSize="small" />}
                  label={t("runs.tracking.lastPassedStop")}
                  value={lastPassedStop?.node.name ?? "—"}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                pb: 1,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <PlaceRoundedIcon color="primary" />

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {t("runs.tracking.routeStops")}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {t("runs.tracking.routeStopsDescription")}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>

            <Divider />

            <Box
              sx={{
                px: 2,
                pt: 2,
                maxHeight: {
                  xs: 470,
                  xl: 520,
                },
                overflowY: "auto",
              }}
            >
              <RouteStopsTimeline
                routeNodes={routeNodes}
                currentStopIndex={currentStopIndex}
                passedStopId={liveTracking.stopSequence?.passedStopId}
                dropOffStopId={liveTracking.dropOffRequest?.stopId}
              />
            </Box>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
};

export default RunTrackingPage;
