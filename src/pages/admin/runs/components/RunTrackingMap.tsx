import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Chip, Paper, Stack, Typography, useTheme } from "@mui/material";
import CenterFocusStrongRoundedIcon from "@mui/icons-material/CenterFocusStrongRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import L, { type LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip as LeafletTooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useTranslation } from "react-i18next";

import type { TransitRoute } from "../../../../types/route.types";
import type { RunLiveLocation } from "../../../../types/run-realtime.types";

import "leaflet/dist/leaflet.css";

type MapPosition = [number, number];

type RunTrackingMapProps = {
  route: TransitRoute;
  location: RunLiveLocation | null;
  currentStopSequence?: number | null;
  passedStopId?: string | null;
};

type MapViewportControllerProps = {
  fitPositions: MapPosition[];
  busPosition: MapPosition | null;
  followBus: boolean;
  fitRequest: number;
};

type MapInteractionControllerProps = {
  onManualMove: () => void;
};

const DEFAULT_POSITION: MapPosition = [33.5138, 36.2765];

const toLeafletPosition = (coordinates?: [number, number]): MapPosition | null => {
  if (!coordinates || coordinates.length !== 2) {
    return null;
  }

  const [longitude, latitude] = coordinates;

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return null;
  }

  return [latitude, longitude];
};

const MapViewportController = ({
  fitPositions,
  busPosition,
  followBus,
  fitRequest,
}: MapViewportControllerProps) => {
  const map = useMap();

  const hasInitialFit = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [map]);

  useEffect(() => {
    if (fitPositions.length === 0) {
      return;
    }

    if (hasInitialFit.current && fitRequest === 0) {
      return;
    }

    const bounds = L.latLngBounds(fitPositions);

    if (!bounds.isValid()) {
      return;
    }

    map.fitBounds(bounds, {
      padding: [42, 42],
      maxZoom: 16,
      animate: true,
    });

    hasInitialFit.current = true;
  }, [fitPositions, fitRequest, map]);

  useEffect(() => {
    if (!followBus || !busPosition) {
      return;
    }

    map.panTo(busPosition, {
      animate: true,
      duration: 0.45,
    });
  }, [busPosition, followBus, map]);

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

const createStopIcon = ({
  sequence,
  backgroundColor,
  foregroundColor,
  borderColor,
  size,
}: {
  sequence: number;
  backgroundColor: string;
  foregroundColor: string;
  borderColor: string;
  size: number;
}) => {
  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${backgroundColor};
          color: ${foregroundColor};
          border: 3px solid ${borderColor};
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.24);
        "
      >
        ${sequence}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const createBusIcon = (backgroundColor: string, foregroundColor: string) => {
  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${backgroundColor};
          color: ${foregroundColor};
          border: 4px solid white;
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.32);
          font-size: 23px;
        "
      >
        🚌
      </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  });
};

const RunTrackingMap = ({
  route,
  location,
  currentStopSequence,
  passedStopId,
}: RunTrackingMapProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [followBus, setFollowBus] = useState(true);

  const [fitRequest, setFitRequest] = useState(0);

  const routeNodes = useMemo(() => {
    return [...(route.routeNodes ?? [])].sort(
      (first, second) => first.ordering - second.ordering,
    );
  }, [route.routeNodes]);

  const routeLinePositions = useMemo(() => {
    return (route.line.coordinates ?? [])
      .map(toLeafletPosition)
      .filter((position): position is MapPosition => position !== null);
  }, [route.line.coordinates]);

  const stops = useMemo(() => {
    return routeNodes
      .map((routeNode) => {
        const position = toLeafletPosition(routeNode.node.coordinates.coordinates);

        if (!position) {
          return null;
        }

        return {
          id: routeNode.node.id,
          name: routeNode.node.name,
          ordering: routeNode.ordering,
          position,
        };
      })
      .filter((stop): stop is NonNullable<typeof stop> => stop !== null);
  }, [routeNodes]);

  const fallbackLinePositions = useMemo(() => {
    return stops.map((stop) => stop.position);
  }, [stops]);

  const displayedLinePositions =
    routeLinePositions.length >= 2 ? routeLinePositions : fallbackLinePositions;

  const busPosition = useMemo(() => {
    return toLeafletPosition(location?.coordinates.coordinates);
  }, [location?.coordinates.coordinates]);

  const fitPositions = useMemo(() => {
    const positions = [...displayedLinePositions, ...stops.map((stop) => stop.position)];

    if (positions.length === 0 && busPosition) {
      return [busPosition];
    }

    return positions;
  }, [busPosition, displayedLinePositions, stops]);

  const initialCenter: LatLngExpression =
    busPosition ?? fitPositions[0] ?? DEFAULT_POSITION;

  const busIcon = useMemo(
    () => createBusIcon(theme.palette.primary.main, theme.palette.primary.contrastText),
    [theme.palette.primary.contrastText, theme.palette.primary.main],
  );

  const handleFitRoute = () => {
    setFollowBus(false);

    setFitRequest((current) => current + 1);
  };

  const handleToggleFollow = () => {
    setFollowBus((current) => !current);
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
          sm: "row",
        }}
        spacing={1.5}
        sx={{
          p: 2,
          alignItems: {
            xs: "stretch",
            sm: "center",
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
              width: 40,
              height: 40,
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
              {route.name}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              {t("runs.tracking.mapDescription")}
            </Typography>
          </Box>

          <Chip
            size="small"
            label={t("runs.tracking.stopsCount", {
              count: routeNodes.length,
            })}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            marginInlineStart: {
              sm: "auto",
            },
            flexWrap: "wrap",
          }}
        >
          <Button
            size="small"
            variant={followBus ? "contained" : "outlined"}
            startIcon={<MyLocationRoundedIcon />}
            disabled={!busPosition}
            onClick={handleToggleFollow}
          >
            {followBus ? t("runs.tracking.followingBus") : t("runs.tracking.followBus")}
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<CenterFocusStrongRoundedIcon />}
            disabled={fitPositions.length === 0}
            onClick={handleFitRoute}
          >
            {t("runs.tracking.showFullRoute")}
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          position: "relative",
          height: {
            xs: 470,
            md: 680,
          },
        }}
      >
        <MapContainer
          key={route.id}
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
            fitPositions={fitPositions}
            busPosition={busPosition}
            followBus={followBus}
            fitRequest={fitRequest}
          />

          <MapInteractionController
            onManualMove={() => {
              setFollowBus(false);
            }}
          />

          {displayedLinePositions.length >= 2 && (
            <Polyline
              positions={displayedLinePositions}
              pathOptions={{
                color: theme.palette.primary.main,
                weight: 6,
                opacity: 0.78,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          )}

          {stops.map((stop) => {
            const isCurrent =
              currentStopSequence !== null &&
              currentStopSequence !== undefined &&
              stop.ordering === currentStopSequence;

            const isPassed =
              stop.id === passedStopId ||
              (currentStopSequence !== null &&
                currentStopSequence !== undefined &&
                stop.ordering < currentStopSequence);

            const backgroundColor = isCurrent
              ? theme.palette.warning.main
              : isPassed
                ? theme.palette.success.main
                : theme.palette.background.paper;

            const foregroundColor =
              isCurrent || isPassed
                ? theme.palette.common.white
                : theme.palette.text.primary;

            const borderColor = isCurrent
              ? theme.palette.warning.dark
              : isPassed
                ? theme.palette.success.dark
                : theme.palette.primary.main;

            const icon = createStopIcon({
              sequence: stop.ordering,
              backgroundColor,
              foregroundColor,
              borderColor,
              size: isCurrent ? 34 : 29,
            });

            return (
              <Marker
                key={stop.id}
                position={stop.position}
                icon={icon}
                zIndexOffset={isCurrent ? 500 : 0}
              >
                <LeafletTooltip direction="top" offset={[0, -16]}>
                  <Stack spacing={0.25}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                      }}
                    >
                      {stop.ordering}. {stop.name}
                    </Typography>

                    {isCurrent && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "warning.main",
                        }}
                      >
                        {t("runs.tracking.currentStop")}
                      </Typography>
                    )}

                    {isPassed && !isCurrent && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "success.main",
                        }}
                      >
                        {t("runs.tracking.passedStop")}
                      </Typography>
                    )}
                  </Stack>
                </LeafletTooltip>
              </Marker>
            );
          })}

          {busPosition && (
            <Marker position={busPosition} icon={busIcon} zIndexOffset={1000}>
              <Popup>
                <Stack spacing={0.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {t("runs.tracking.busLocation")}
                  </Typography>

                  <Typography variant="caption">
                    {t("runs.tracking.velocityValue", {
                      value: location?.velocity ?? 0,
                    })}
                  </Typography>
                </Stack>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {!busPosition && (
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
              {t("runs.tracking.noLiveLocation")}
            </Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
};

export default RunTrackingMap;
