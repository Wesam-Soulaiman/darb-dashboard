import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";
import type { Stop } from "../../../../types/stop.types";
import type { Place } from "../../../../types/place.types";
import { useMyLocationContext } from "../../../../contexts/MyLocationContext";
import UpdateStop from "./UpdateStop";
import DeleteStop from "./DeleteStop";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

type StopMapPoint = {
  stop: Stop;
  placeName: string;
  lat: number;
  lon: number;
};

type StopsMapDialogProps = {
  stops: Stop[];
  places: Place[];
  loading?: boolean;

  pageIndex?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
};

const DEFAULT_CENTER: [number, number] = [33.5138, 36.2765];

const getStopPoint = (stop: Stop, places: Place[]): StopMapPoint | null => {
  const lon = stop.coordinates?.coordinates?.[0];
  const lat = stop.coordinates?.coordinates?.[1];

  if (typeof lat !== "number" || typeof lon !== "number") {
    return null;
  }

  const place = places.find((item) => item.id === stop.placeId);

  return {
    stop,
    placeName: place?.name ?? String(stop.placeId),
    lat,
    lon,
  };
};

const FitStopsBounds = ({ points }: { points: StopMapPoint[] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      return;
    }

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lon], 14);
      return;
    }

    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lon]));

    map.fitBounds(bounds, {
      padding: [48, 48],
    });
  }, [map, points]);

  return null;
};

const StopsMapDialog = ({
  stops,
  places,
  loading = false,

  pageIndex = 0,
  hasNextPage = false,
  hasPreviousPage = false,
  onNextPage,
  onPreviousPage,
}: StopsMapDialogProps) => {
  const { t, i18n } = useTranslation();
  const { location } = useMyLocationContext();

  const [open, setOpen] = useState(false);

  const isRtl = i18n.resolvedLanguage === "ar";

  const points = useMemo(() => {
    return stops
      .map((stop) => getStopPoint(stop, places))
      .filter((point): point is StopMapPoint => Boolean(point));
  }, [stops, places]);

  const center: [number, number] =
    points.length > 0
      ? [points[0].lat, points[0].lon]
      : location
        ? [location.lat, location.lon]
        : DEFAULT_CENTER;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<MapRoundedIcon />}
        onClick={() => setOpen(true)}
        disabled={loading}
        sx={{
          borderRadius: 2,
          px: 2.5,
          alignSelf: { xs: "stretch", sm: "center" },
        }}
      >
        {t("stops.map.showStops")}
      </Button>

      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <DialogContent sx={{ p: 0, position: "relative" }}>
          {points.length > 0 ? (
            <MapContainer
              center={center}
              zoom={12}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FitStopsBounds points={points} />

              {points.map(({ stop, placeName, lat, lon }) => (
                <Marker key={stop.id} position={[lat, lon]}>
                  <Popup>
                    <Stack spacing={1.25} sx={{ minWidth: 220 }}>
                      <Stack spacing={0.25}>
                        <Typography sx={{ fontWeight: 800 }}>
                          {stop.name || t("stops.defaultName")}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {t("stops.table.place")}: {placeName}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {lat.toFixed(6)}, {lon.toFixed(6)}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <UpdateStop stop={stop} />
                        <DeleteStop stop={stop} />
                      </Stack>
                    </Stack>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <Stack
              spacing={1}
              sx={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 3,
              }}
            >
              <MapRoundedIcon fontSize="large" color="disabled" />

              <Typography sx={{ fontWeight: 800 }}>
                {t("stops.map.noStopsTitle")}
              </Typography>

              <Typography color="text.secondary">
                {t("stops.map.noStopsDescription")}
              </Typography>
            </Stack>
          )}

          <Chip
            label={t("stops.map.visibleCount", {
              count: points.length,
            })}
            color="primary"
            sx={{
              position: "absolute",
              top: 16,
              insetInlineStart: 16,
              zIndex: 1000,
              fontWeight: 800,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 4,
              borderRadius: 999,
              px: 1,
              py: 0.75,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              disabled={!hasPreviousPage || loading}
              onClick={onPreviousPage}
            >
              {isRtl ? <NavigateNextRoundedIcon /> : <NavigateBeforeRoundedIcon />}
            </IconButton>

            <Typography
              variant="body2"
              sx={{
                px: 1,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {t("pagination.page")} {pageIndex + 1}
            </Typography>

            <IconButton
              size="small"
              disabled={!hasNextPage || loading}
              onClick={onNextPage}
            >
              {isRtl ? <NavigateBeforeRoundedIcon /> : <NavigateNextRoundedIcon />}
            </IconButton>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button startIcon={<CloseRoundedIcon />} onClick={() => setOpen(false)}>
            {t("common.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StopsMapDialog;
