import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import LoadingDataError from "../../../components/LoadingDataError";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useRoute } from "../../../hooks/locations/useRoutes";
import {
  useReplaceTripFrequencies,
  useReplaceTripStopTimes,
  useTrip,
} from "../../../hooks/organizations/useTrips";
import TripFrequencyWindows from "./components/setup/TripFrequencyWindows";
import TripMetroPlanner from "./components/setup/TripMetroPlanner";
import TripSetupPreview from "./components/setup/TripSetupPreview";
import type {
  TripSetupFrequencyWindow,
  TripSetupStop,
} from "./components/setup/tripSetup.types";
import {
  buildFrequencyWindows,
  buildTripSetupStops,
  cloneFrequencyWindows,
  cloneTripSetupStops,
  createDefaultFrequencyWindow,
  mapFrequencyWindowsToPayload,
  mapStopsToPayload,
  validateTripSetup,
} from "./components/setup/tripSetup.utils";
import { alpha } from "@mui/material/styles";

type TripSummaryItemProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  secondary?: React.ReactNode;
};

const TripSummaryItem = ({ icon, label, value, secondary }: TripSummaryItemProps) => {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={(theme) => ({
        minWidth: 0,
        p: 1.75,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        transition: theme.transitions.create(
          ["border-color", "box-shadow", "transform"],
          {
            duration: theme.transitions.duration.shorter,
          },
        ),
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: `0 8px 24px ${alpha(
            theme.palette.common.black,
            theme.palette.mode === "dark" ? 0.18 : 0.06,
          )}`,
          transform: "translateY(-2px)",
        },
      })}
    >
      <Box
        sx={(theme) => ({
          width: 44,
          height: 44,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          borderRadius: 2.5,
          color: "primary.main",
          bgcolor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === "dark" ? 0.18 : 0.09,
          ),
        })}
      >
        {icon}
      </Box>

      <Stack spacing={0.25} sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontWeight: 900,
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </Typography>

        {secondary && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {secondary}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

const TripSetupPage = () => {
  const { t } = useTranslation();
  const params = useParams();

  const { user } = useAuthContext();

  const routeOrgId = Number(params.orgId);
  const userOrgId = Number(user?.organizationId);
  const tripId = Number(params.tripId);

  const orgId = Number.isFinite(routeOrgId) && routeOrgId > 0 ? routeOrgId : userOrgId;

  const hasValidIds =
    Number.isFinite(orgId) && orgId > 0 && Number.isFinite(tripId) && tripId > 0;

  const tripDetails = useTrip(orgId, tripId, hasValidIds);

  const routeDetails = useRoute(tripDetails.data?.route.id);

  const replaceStopTimes = useReplaceTripStopTimes(orgId, tripId);

  const replaceFrequencies = useReplaceTripFrequencies(orgId, tripId);

  const [stops, setStops] = useState<TripSetupStop[]>([]);

  const [initialStops, setInitialStops] = useState<TripSetupStop[]>([]);

  const [repeated, setRepeated] = useState(false);

  const [initialRepeated, setInitialRepeated] = useState(false);

  const [frequencyWindows, setFrequencyWindows] = useState<TripSetupFrequencyWindow[]>(
    [],
  );

  const [initialFrequencyWindows, setInitialFrequencyWindows] = useState<
    TripSetupFrequencyWindow[]
  >([]);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(false);
    setStops([]);
    setInitialStops([]);
    setFrequencyWindows([]);
    setInitialFrequencyWindows([]);
  }, [tripId]);

  const routeStops = useMemo(() => {
    return [...(routeDetails.data?.routeNodes ?? [])].sort(
      (first, second) => first.ordering - second.ordering,
    );
  }, [routeDetails.data?.routeNodes]);

  useEffect(() => {
    if (initialized || !tripDetails.data || !routeDetails.data) {
      return;
    }

    const nextStops = buildTripSetupStops(routeStops, tripDetails.data.stopTimes ?? []);

    const savedWindows = buildFrequencyWindows(tripDetails.data.frequencies ?? []);

    const nextRepeated = savedWindows.length > 0;

    const nextWindows = nextRepeated ? savedWindows : [createDefaultFrequencyWindow()];

    setStops(cloneTripSetupStops(nextStops));

    setInitialStops(cloneTripSetupStops(nextStops));

    setRepeated(nextRepeated);
    setInitialRepeated(nextRepeated);

    setFrequencyWindows(cloneFrequencyWindows(nextWindows));

    setInitialFrequencyWindows(cloneFrequencyWindows(nextWindows));

    setInitialized(true);
  }, [initialized, routeDetails.data, routeStops, tripDetails.data]);

  const hasUnsavedChanges = useMemo(() => {
    if (!initialized) {
      return false;
    }

    return (
      JSON.stringify({
        stops,
        repeated,
        frequencyWindows,
      }) !==
      JSON.stringify({
        stops: initialStops,
        repeated: initialRepeated,
        frequencyWindows: initialFrequencyWindows,
      })
    );
  }, [
    frequencyWindows,
    initialFrequencyWindows,
    initialRepeated,
    initialStops,
    initialized,
    repeated,
    stops,
  ]);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const saving = replaceStopTimes.isPending || replaceFrequencies.isPending;

  const enabledStopsCount = stops.filter((stop) => stop.enabled).length;

  const handleRepeatedChange = (value: boolean) => {
    setRepeated(value);

    if (value && frequencyWindows.length === 0) {
      setFrequencyWindows([createDefaultFrequencyWindow()]);
    }
  };

  const handleReset = () => {
    setStops(cloneTripSetupStops(initialStops));

    setRepeated(initialRepeated);

    setFrequencyWindows(cloneFrequencyWindows(initialFrequencyWindows));
  };

  const handleSave = async () => {
    const validation = validateTripSetup(stops, repeated, frequencyWindows);

    if (!validation.valid) {
      toast.error(t(`trips.setup.validation.${validation.error}`));

      return;
    }

    await replaceStopTimes.mutateAsync(mapStopsToPayload(stops));

    await replaceFrequencies.mutateAsync(
      mapFrequencyWindowsToPayload(frequencyWindows, repeated),
    );

    setInitialStops(cloneTripSetupStops(stops));

    setInitialRepeated(repeated);

    setInitialFrequencyWindows(cloneFrequencyWindows(frequencyWindows));
  };

  const backPath = params.orgId
    ? `/admin/dashboard/organizations/${orgId}/trips`
    : "/admin/dashboard/trips";

  if (!hasValidIds) {
    return <Alert severity="error">{t("trips.setup.invalidTrip")}</Alert>;
  }

  if (tripDetails.isError) {
    return <LoadingDataError refetch={tripDetails.refetch} />;
  }

  if (routeDetails.isError) {
    return <LoadingDataError refetch={routeDetails.refetch} />;
  }

  if (
    tripDetails.isLoading ||
    routeDetails.isLoading ||
    !tripDetails.data ||
    !routeDetails.data ||
    !initialized
  ) {
    return (
      <Stack
        spacing={2}
        sx={{
          minHeight: 360,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />

        <Typography color="text.secondary">{t("trips.setup.loading")}</Typography>
      </Stack>
    );
  }

  const trip = tripDetails.data;

  return (
    <Stack spacing={3} sx={{ pb: 3 }}>
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
          spacing={1.5}
          sx={{
            minWidth: 0,
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                overflowWrap: "anywhere",
              }}
            >
              {t("trips.setup.title")}
            </Typography>
          </Box>
        </Stack>

        <Button
          component={RouterLink}
          to={backPath}
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            borderRadius: 2.5,
            flexShrink: 0,
          }}
        >
          {t("trips.setup.back")}
        </Button>
      </Stack>

      <Card
        variant="outlined"
        sx={(theme) => ({
          position: "relative",
          overflow: "hidden",
          borderColor: "divider",
          boxShadow: "none",
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.1,
                )} 0%, ${theme.palette.background.paper} 42%)`
              : `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.06,
                )} 0%, ${theme.palette.background.paper} 45%)`,
        })}
      >
        <Box
          sx={(theme) => ({
            position: "absolute",
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: theme.palette.primary.main,
          })}
        />

        <CardContent
          sx={{
            p: { xs: 2, md: 3 },
            "&:last-child": {
              pb: { xs: 2, md: 3 },
            },
          }}
        >
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  minWidth: 0,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={(theme) => ({
                    width: 52,
                    height: 52,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 3,
                    color: "primary.main",
                    bgcolor: alpha(
                      theme.palette.primary.main,
                      theme.palette.mode === "dark" ? 0.18 : 0.09,
                    ),
                  })}
                >
                  <RouteRoundedIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {trip.headsign}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    {t("trips.setup.summary.description")}
                  </Typography>
                </Box>
              </Stack>

              <Chip
                size="small"
                color={trip.isActive ? "success" : "default"}
                variant={trip.isActive ? "filled" : "outlined"}
                label={trip.isActive ? t("common.active") : t("common.inactive")}
                sx={{
                  alignSelf: { xs: "flex-start", sm: "center" },
                  fontWeight: 800,
                }}
              />
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                  xl: "repeat(4, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <TripSummaryItem
                icon={<RouteRoundedIcon fontSize="small" />}
                label={t("trips.setup.summary.route")}
                value={trip.route.name}
              />

              <TripSummaryItem
                icon={<EventAvailableRoundedIcon fontSize="small" />}
                label={t("trips.setup.summary.schedule")}
                value={trip.schedule.name}
                secondary={trip.schedule.serviceCode}
              />

              <TripSummaryItem
                icon={<DirectionsBusRoundedIcon fontSize="small" />}
                label={t("trips.setup.summary.bus")}
                value={trip.defaultBus?.plateNumber ?? t("trips.table.noDefaultBus")}
                secondary={trip.defaultBus?.busCode}
              />

              <TripSummaryItem
                icon={<FlagRoundedIcon fontSize="small" />}
                label={t("trips.setup.summary.block")}
                value={trip.blockId || t("common.notAvailable")}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Chip
          color={enabledStopsCount >= 2 ? "success" : "error"}
          icon={<RouteRoundedIcon />}
          label={t("trips.setup.progress.stops", {
            count: enabledStopsCount,
          })}
        />

        <Chip
          color={!repeated || frequencyWindows.length > 0 ? "success" : "error"}
          icon={<RepeatRoundedIcon />}
          label={
            repeated
              ? t("trips.setup.progress.frequency", {
                  count: frequencyWindows.length,
                })
              : t("trips.setup.progress.fixedTimes")
          }
        />

        <Chip
          variant="outlined"
          color={hasUnsavedChanges ? "warning" : "success"}
          label={
            hasUnsavedChanges
              ? t("trips.setup.unsavedChanges")
              : t("trips.setup.allSaved")
          }
        />
      </Stack>

      {routeStops.length === 0 ? (
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 900 }}>
            {t("trips.setup.noRouteStopsTitle")}
          </Typography>

          <Typography variant="body2">
            {t("trips.setup.noRouteStopsDescription")}
          </Typography>
        </Alert>
      ) : (
        <>
          <TripMetroPlanner stops={stops} disabled={saving} onChange={setStops} />

          <Divider />

          <TripFrequencyWindows
            repeated={repeated}
            windows={frequencyWindows}
            disabled={saving}
            onRepeatedChange={handleRepeatedChange}
            onChange={setFrequencyWindows}
          />

          <Divider />

          <TripSetupPreview trip={trip} hasUnsavedChanges={hasUnsavedChanges} />
        </>
      )}

      <Card
        variant="outlined"
        sx={{
          position: "sticky",
          bottom: { xs: 8, sm: 10 },
          zIndex: 10,
          borderRadius: 1,
          bgcolor: "background.paper",
          boxShadow: 12,
          backdropFilter: "blur(12px)",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.25, sm: 2 },
            "&:last-child": {
              pb: { xs: 1.25, sm: 2 },
            },
          }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.35,
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                  },
                }}
              >
                {hasUnsavedChanges
                  ? t("trips.setup.unsavedChanges")
                  : t("trips.setup.allSaved")}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {t("trips.setup.saveDescription")}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                flexShrink: 0,
                alignItems: "center",
              }}
            >
              <Button
                type="button"
                color="inherit"
                variant="outlined"
                size="small"
                startIcon={<RestartAltRoundedIcon />}
                onClick={handleReset}
                disabled={!hasUnsavedChanges || saving}
                aria-label={t("trips.setup.reset")}
                sx={{
                  minWidth: { xs: 40, sm: "auto" },
                  width: { xs: 40, sm: "auto" },
                  height: 40,
                  px: { xs: 0, sm: 1.5 },
                  borderRadius: 2,

                  "& .MuiButton-startIcon": {
                    m: { xs: 0, sm: "0 0 0 8px" },
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                  }}
                >
                  {t("trips.setup.reset")}
                </Box>
              </Button>

              <Button
                type="button"
                variant="contained"
                size="small"
                startIcon={
                  saving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SaveRoundedIcon />
                  )
                }
                onClick={handleSave}
                disabled={!hasUnsavedChanges || saving || routeStops.length === 0}
                sx={{
                  height: 40,
                  minWidth: { xs: 96, sm: 180 },
                  px: { xs: 1.5, sm: 2.5 },
                  borderRadius: 2,
                  whiteSpace: "nowrap",
                  fontWeight: 800,
                }}
              >
                {saving ? t("common.saving") : t("trips.setup.save")}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default TripSetupPage;
