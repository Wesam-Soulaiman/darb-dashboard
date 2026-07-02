import { useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

import { useRoute, useRoutes, useUpdateRoute } from "../../../hooks/locations/useRoutes";
import { useRouteRecorder } from "../../../hooks/locations/useRouteRecorder";

import {
  getSpeedKmh,
  recordedPointsToGeoJsonLine,
} from "../../../utils/routeRecorder.utils";

import RouteRecorderMap from "./components/RouteRecorderMap";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  helper?: ReactNode;
};

const parseNumberField = (value: string, fallback: number): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
};

const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1_000);

  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const getStatusColor = (
  status: ReturnType<typeof useRouteRecorder>["status"],
): "default" | "success" | "warning" | "primary" | "error" => {
  if (status === "recording") {
    return "success";
  }

  if (status === "paused") {
    return "warning";
  }

  if (status === "finished") {
    return "primary";
  }

  if (status === "error") {
    return "error";
  }

  return "default";
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

const RouteRecorderPage = () => {
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [copied, setCopied] = useState(false);

  const locale = i18n.language.startsWith("ar") ? "ar-SY" : "en-US";

  const routesQuery = useRoutes({
    limit: 100,
    search: search.trim() || undefined,
  });

  const routeQuery = useRoute(selectedRouteId || undefined);

  const updateRoute = useUpdateRoute(selectedRouteId);

  const recorder = useRouteRecorder();

  const routes = routesQuery.data?.data ?? [];

  const selectedRoute =
    routeQuery.data ?? routes.find((route) => route.id === selectedRouteId) ?? null;

  const formattedDistance = useMemo(() => {
    if (recorder.distanceMeters >= 1_000) {
      return `${new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
      }).format(recorder.distanceMeters / 1_000)} km`;
    }

    return `${new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(recorder.distanceMeters)} m`;
  }, [locale, recorder.distanceMeters]);

  const formattedLastAccuracy =
    recorder.lastPoint?.accuracy !== null && recorder.lastPoint?.accuracy !== undefined
      ? `${new Intl.NumberFormat(locale, {
          maximumFractionDigits: 0,
        }).format(recorder.lastPoint.accuracy)} m`
      : "—";

  const lastSpeedKmh = getSpeedKmh(recorder.lastPoint?.speed);

  const formattedLastSpeed =
    lastSpeedKmh !== null
      ? `${new Intl.NumberFormat(locale, {
          maximumFractionDigits: 1,
        }).format(lastSpeedKmh)} km/h`
      : "—";

  const handleSaveToRoute = async () => {
    if (!selectedRoute || !recorder.canSave) {
      return;
    }

    await updateRoute.mutateAsync({
      name: selectedRoute.name,
      originPlaceId: selectedRoute.originPlaceId,
      destinationPlaceId: selectedRoute.destinationPlaceId,
      mode: selectedRoute.mode,
      price: selectedRoute.price,
      line: recordedPointsToGeoJsonLine(recorder.simplifiedPoints),
    });
  };

  const handleCopyGeoJson = async () => {
    if (!recorder.canSave) {
      return;
    }

    const line = recordedPointsToGeoJsonLine(recorder.simplifiedPoints);

    await navigator.clipboard.writeText(JSON.stringify(line, null, 2));

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2_000);
  };

  const saveDisabled =
    !selectedRoute || !recorder.canSave || recorder.isRecording || updateRoute.isPending;

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
                  {t("routes.recorder.title")}
                </Typography>

                <Chip
                  size="small"
                  color={getStatusColor(recorder.status)}
                  label={t(`routes.recorder.status.${recorder.status}`)}
                />
              </Stack>

              <Typography
                sx={{
                  color: "text.secondary",
                }}
              >
                {t("routes.recorder.subtitle")}
              </Typography>
            </Box>
          </Stack>

          <Button
            component={RouterLink}
            to="/admin/dashboard/routes"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              marginInlineStart: {
                md: "auto",
              },
              borderRadius: 2,
            }}
          >
            {t("routes.recorder.backToRoutes")}
          </Button>
        </Stack>
      </Paper>

      {!recorder.isSupported && (
        <Alert severity="error">{t("routes.recorder.geolocationUnsupported")}</Alert>
      )}

      {!recorder.isSecureContext && (
        <Alert severity="error">{t("routes.recorder.insecureContext")}</Alert>
      )}

      {recorder.errorKey && <Alert severity="error">{t(recorder.errorKey)}</Alert>}

      {recorder.lastRejectedPoint && (
        <Alert severity="warning">
          {t("routes.recorder.rejectedPoint", {
            accuracy: Math.round(recorder.lastRejectedPoint.accuracy ?? 0),
          })}
        </Alert>
      )}

      <Alert severity="info">{t("routes.recorder.permissionNote")}</Alert>

      {recorder.status === "finished" && (
        <Alert severity="success">{t("routes.recorder.editModeHint")}</Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Stack spacing={3}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack spacing={2.25}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <RouteRoundedIcon color="primary" />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {t("routes.recorder.routeSelection")}
                  </Typography>
                </Stack>

                <TextField
                  fullWidth
                  label={t("routes.recorder.routeSearch")}
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                />

                <TextField
                  select
                  fullWidth
                  label={t("routes.recorder.route")}
                  value={selectedRouteId}
                  onChange={(event) => {
                    setSelectedRouteId(event.target.value);
                  }}
                  disabled={routesQuery.isLoading}
                  helperText={t("routes.recorder.routeHint")}
                >
                  <MenuItem value="">{t("routes.recorder.selectRoute")}</MenuItem>

                  {routes.map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.name}
                    </MenuItem>
                  ))}
                </TextField>

                {selectedRouteId && routeQuery.isLoading && (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress size={18} />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {t("routes.recorder.loadingRoute")}
                    </Typography>
                  </Stack>
                )}

                {!selectedRoute && (
                  <Alert severity="warning">{t("routes.recorder.noRouteSelected")}</Alert>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack spacing={2.25}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <TuneRoundedIcon color="primary" />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {t("routes.recorder.settings")}
                  </Typography>
                </Stack>

                <TextField
                  fullWidth
                  type="number"
                  label={t("routes.recorder.accuracyThresholdMeters")}
                  value={recorder.options.accuracyThresholdMeters}
                  onChange={(event) => {
                    recorder.setOptions({
                      accuracyThresholdMeters: Math.max(
                        5,
                        parseNumberField(
                          event.target.value,
                          recorder.options.accuracyThresholdMeters,
                        ),
                      ),
                    });
                  }}
                  slotProps={{
                    htmlInput: {
                      min: 5,
                      step: 5,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label={t("routes.recorder.minDistanceMeters")}
                  value={recorder.options.minDistanceMeters}
                  onChange={(event) => {
                    recorder.setOptions({
                      minDistanceMeters: Math.max(
                        1,
                        parseNumberField(
                          event.target.value,
                          recorder.options.minDistanceMeters,
                        ),
                      ),
                    });
                  }}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      step: 1,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label={t("routes.recorder.simplifyToleranceMeters")}
                  value={recorder.options.simplifyToleranceMeters}
                  onChange={(event) => {
                    recorder.setOptions({
                      simplifyToleranceMeters: Math.max(
                        0,
                        parseNumberField(
                          event.target.value,
                          recorder.options.simplifyToleranceMeters,
                        ),
                      ),
                    });
                  }}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: 1,
                    },
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Stack spacing={2.25}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <GpsFixedRoundedIcon color="primary" />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {t("routes.recorder.recordingControls")}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{
                  flexWrap: "wrap",
                }}
              >
                {(recorder.status === "idle" ||
                  recorder.status === "finished" ||
                  recorder.status === "error") && (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrowRoundedIcon />}
                    onClick={recorder.start}
                    disabled={!recorder.isSupported || !recorder.isSecureContext}
                  >
                    {t("routes.recorder.start")}
                  </Button>
                )}

                {recorder.status === "recording" && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<PauseRoundedIcon />}
                      onClick={recorder.pause}
                    >
                      {t("routes.recorder.pause")}
                    </Button>

                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<StopRoundedIcon />}
                      onClick={recorder.finish}
                    >
                      {t("routes.recorder.finish")}
                    </Button>
                  </>
                )}

                {recorder.status === "paused" && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowRoundedIcon />}
                      onClick={recorder.resume}
                    >
                      {t("routes.recorder.resume")}
                    </Button>

                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<StopRoundedIcon />}
                      onClick={recorder.finish}
                    >
                      {t("routes.recorder.finish")}
                    </Button>
                  </>
                )}

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteSweepRoundedIcon />}
                  onClick={recorder.reset}
                  disabled={recorder.status === "recording"}
                >
                  {t("routes.recorder.reset")}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<RemoveCircleOutlineRoundedIcon />}
                  onClick={recorder.removeLastPoint}
                  disabled={
                    recorder.simplifiedPoints.length === 0 ||
                    recorder.status === "recording"
                  }
                >
                  {t("routes.recorder.removeLastPoint")}
                </Button>
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Button
                  variant="contained"
                  startIcon={
                    updateRoute.isPending ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <SaveRoundedIcon />
                    )
                  }
                  disabled={saveDisabled}
                  onClick={handleSaveToRoute}
                >
                  {updateRoute.isPending
                    ? t("routes.recorder.saving")
                    : t("routes.recorder.saveToRoute")}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ContentCopyRoundedIcon />}
                  disabled={!recorder.canSave}
                  onClick={handleCopyGeoJson}
                >
                  {copied
                    ? t("routes.recorder.copySuccess")
                    : t("routes.recorder.copyGeoJson")}
                </Button>

                {recorder.isRecording && (
                  <Alert severity="warning">
                    {t("routes.recorder.saveDisabledRecording")}
                  </Alert>
                )}

                <Alert severity="info">{t("routes.recorder.saveInfo")}</Alert>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(5, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <MetricCard
          icon={<GpsFixedRoundedIcon />}
          label={t("routes.recorder.metrics.rawPoints")}
          value={recorder.points.length}
        />

        <MetricCard
          icon={<RouteRoundedIcon />}
          label={t("routes.recorder.metrics.savedPoints")}
          value={recorder.simplifiedPoints.length}
        />

        <MetricCard
          icon={<StraightenRoundedIcon />}
          label={t("routes.recorder.metrics.distance")}
          value={formattedDistance}
        />

        <MetricCard
          icon={<TimerRoundedIcon />}
          label={t("routes.recorder.metrics.duration")}
          value={formatDuration(recorder.elapsedMs)}
        />

        <MetricCard
          icon={<SpeedRoundedIcon />}
          label={t("routes.recorder.metrics.lastSpeed")}
          value={formattedLastSpeed}
          helper={t("routes.recorder.metrics.lastAccuracy", {
            value: formattedLastAccuracy,
          })}
        />
      </Box>

      <RouteRecorderMap
        routeName={selectedRoute?.name}
        existingRouteCoordinates={selectedRoute?.line?.coordinates}
        recordedPoints={recorder.points}
        simplifiedPoints={recorder.simplifiedPoints}
        currentPoint={recorder.lastPoint}
        status={recorder.status}
        isEditable={recorder.status === "finished"}
        onMoveRecordedPoint={recorder.updateRecordedPoint}
        onDeleteRecordedPoint={recorder.deleteRecordedPoint}
      />
    </Stack>
  );
};

export default RouteRecorderPage;
