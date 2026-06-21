import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Chip, Paper, Stack, Typography, useTheme } from "@mui/material";
import CenterFocusStrongRoundedIcon from "@mui/icons-material/CenterFocusStrongRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import L, { type LatLngExpression } from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  Tooltip as LeafletTooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useTranslation } from "react-i18next";

import {
  geoJsonLineToMapPoints,
  recordedPointsToMapPoints,
  type RecordedRoutePoint,
  type RouteRecorderStatus,
} from "../../../../utils/routeRecorder.utils";

import "leaflet/dist/leaflet.css";

type MapPosition = [number, number];

type RouteRecorderMapProps = {
  routeName?: string;
  existingRouteCoordinates?: [number, number][];
  recordedPoints: RecordedRoutePoint[];
  simplifiedPoints: RecordedRoutePoint[];
  currentPoint: RecordedRoutePoint | null;
  status: RouteRecorderStatus;
};

type MapViewportControllerProps = {
  positions: MapPosition[];
  currentPosition: MapPosition | null;
  followCurrentPosition: boolean;
  fitRequest: number;
};

type MapInteractionControllerProps = {
  onManualMove: () => void;
};

const DEFAULT_CENTER: MapPosition = [33.5138, 36.2765];

const MapViewportController = ({
  positions,
  currentPosition,
  followCurrentPosition,
  fitRequest,
}: MapViewportControllerProps) => {
  const map = useMap();

  const fittedInitiallyRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [map]);

  useEffect(() => {
    if (positions.length === 0) {
      return;
    }

    if (fittedInitiallyRef.current && fitRequest === 0) {
      return;
    }

    const bounds = L.latLngBounds(positions);

    if (!bounds.isValid()) {
      return;
    }

    map.fitBounds(bounds, {
      padding: [44, 44],
      maxZoom: 17,
      animate: true,
    });

    fittedInitiallyRef.current = true;
  }, [fitRequest, map, positions]);

  useEffect(() => {
    if (!followCurrentPosition || !currentPosition) {
      return;
    }

    map.panTo(currentPosition, {
      animate: true,
      duration: 0.45,
    });
  }, [currentPosition, followCurrentPosition, map]);

  return null;
};

const MapInteractionController = ({ onManualMove }: MapInteractionControllerProps) => {
  useMapEvents({
    dragstart() {
      onManualMove();
    },
  });

  return null;
};

const RouteRecorderMap = ({
  routeName,
  existingRouteCoordinates,
  recordedPoints,
  simplifiedPoints,
  currentPoint,
  status,
}: RouteRecorderMapProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [followCurrentPosition, setFollowCurrentPosition] = useState(true);
  const [fitRequest, setFitRequest] = useState(0);

  const existingRoutePositions = useMemo(() => {
    return geoJsonLineToMapPoints(existingRouteCoordinates);
  }, [existingRouteCoordinates]);

  const recordedRoutePositions = useMemo(() => {
    return recordedPointsToMapPoints(simplifiedPoints);
  }, [simplifiedPoints]);

  const rawRoutePositions = useMemo(() => {
    return recordedPointsToMapPoints(recordedPoints);
  }, [recordedPoints]);

  const currentLatitude = currentPoint?.latitude;
  const currentLongitude = currentPoint?.longitude;

  const currentPosition = useMemo(() => {
    if (currentLatitude === undefined || currentLongitude === undefined) {
      return null;
    }

    return [currentLatitude, currentLongitude] as MapPosition;
  }, [currentLatitude, currentLongitude]);

  const allPositions = useMemo(() => {
    return [
      ...existingRoutePositions,
      ...recordedRoutePositions,
      ...(currentPosition ? [currentPosition] : []),
    ];
  }, [currentPosition, existingRoutePositions, recordedRoutePositions]);

  const initialCenter: LatLngExpression =
    currentPosition ??
    recordedRoutePositions[0] ??
    existingRoutePositions[0] ??
    DEFAULT_CENTER;

  const startPosition = recordedRoutePositions[0] ?? null;
  const endPosition =
    recordedRoutePositions.length > 1
      ? recordedRoutePositions[recordedRoutePositions.length - 1]
      : null;

  const handleFitAll = () => {
    setFollowCurrentPosition(false);
    setFitRequest((current) => current + 1);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={1.5}
        sx={{
          p: 2,
          alignItems: {
            xs: "stretch",
            md: "center",
          },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              flexShrink: 0,
            }}
          >
            <RouteRoundedIcon />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                fontWeight: 800,
              }}
            >
              {routeName || t("routes.recorder.mapTitle")}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              {t("routes.recorder.mapDescription")}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            marginInlineStart: {
              md: "auto",
            },
            flexWrap: "wrap",
          }}
        >
          <Chip
            size="small"
            color={status === "recording" ? "success" : "default"}
            label={t(`routes.recorder.status.${status}`)}
          />

          <Button
            size="small"
            variant={followCurrentPosition ? "contained" : "outlined"}
            startIcon={<MyLocationRoundedIcon />}
            disabled={!currentPosition}
            onClick={() => {
              setFollowCurrentPosition((current) => !current);
            }}
          >
            {followCurrentPosition
              ? t("routes.recorder.followingLocation")
              : t("routes.recorder.followLocation")}
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<CenterFocusStrongRoundedIcon />}
            disabled={allPositions.length === 0}
            onClick={handleFitAll}
          >
            {t("routes.recorder.showFullRecording")}
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          position: "relative",
          height: {
            xs: 480,
            md: 660,
          },
        }}
      >
        <MapContainer
          center={initialCenter}
          zoom={13}
          zoomControl
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapViewportController
            positions={allPositions}
            currentPosition={currentPosition}
            followCurrentPosition={followCurrentPosition}
            fitRequest={fitRequest}
          />

          <MapInteractionController
            onManualMove={() => {
              setFollowCurrentPosition(false);
            }}
          />

          {existingRoutePositions.length >= 2 && (
            <Polyline
              positions={existingRoutePositions}
              pathOptions={{
                color: theme.palette.text.secondary,
                weight: 4,
                opacity: 0.45,
                dashArray: "8 8",
              }}
            />
          )}

          {rawRoutePositions.length >= 2 && (
            <Polyline
              positions={rawRoutePositions}
              pathOptions={{
                color: theme.palette.warning.main,
                weight: 3,
                opacity: 0.35,
              }}
            />
          )}

          {recordedRoutePositions.length >= 2 && (
            <Polyline
              positions={recordedRoutePositions}
              pathOptions={{
                color: theme.palette.primary.main,
                weight: 6,
                opacity: 0.85,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          )}

          {startPosition && (
            <CircleMarker
              center={startPosition}
              radius={8}
              pathOptions={{
                color: theme.palette.success.dark,
                fillColor: theme.palette.success.main,
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <LeafletTooltip direction="top">
                {t("routes.recorder.startPoint")}
              </LeafletTooltip>
            </CircleMarker>
          )}

          {endPosition && (
            <CircleMarker
              center={endPosition}
              radius={8}
              pathOptions={{
                color: theme.palette.error.dark,
                fillColor: theme.palette.error.main,
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <LeafletTooltip direction="top">
                {t("routes.recorder.endPoint")}
              </LeafletTooltip>
            </CircleMarker>
          )}

          {currentPosition && (
            <CircleMarker
              center={currentPosition}
              radius={12}
              pathOptions={{
                color: theme.palette.primary.dark,
                fillColor: theme.palette.primary.main,
                fillOpacity: 0.9,
                weight: 4,
              }}
            >
              <Popup>
                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {t("routes.recorder.currentLocation")}
                  </Typography>

                  <Typography variant="caption">
                    {currentPoint?.accuracy !== null
                      ? `${Math.round(currentPoint?.accuracy ?? 0)} m`
                      : "—"}
                  </Typography>
                </Stack>
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>

        {recordedRoutePositions.length === 0 && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              zIndex: 500,
              bottom: 18,
              insetInlineStart: 18,
              px: 2,
              py: 1,
              borderRadius: 2,
              pointerEvents: "none",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
              }}
            >
              {t("routes.recorder.noPoints")}
            </Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
};

export default RouteRecorderMap;
