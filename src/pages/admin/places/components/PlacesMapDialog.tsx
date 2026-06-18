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
import type { Place } from "../../../../types/place.types";
import { useMyLocationContext } from "../../../../contexts/MyLocationContext";
import UpdatePlace from "./UpdatePlace";
import DeletePlace from "./DeletePlace";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

type MapPoint = {
  place: Place;
  lat: number;
  lon: number;
};

type PlacesMapDialogProps = {
  places: Place[];
  loading?: boolean;

  pageIndex?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
};

const DEFAULT_CENTER: [number, number] = [33.5138, 36.2765];

const getPlacePoint = (place: Place): MapPoint | null => {
  const lon = place.center?.coordinates?.[0];
  const lat = place.center?.coordinates?.[1];

  if (typeof lat !== "number" || typeof lon !== "number") {
    return null;
  }

  return {
    place,
    lat,
    lon,
  };
};

const FitPlacesBounds = ({ points }: { points: MapPoint[] }) => {
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

const PlacesMapDialog = ({
  places,
  loading = false,

  pageIndex = 0,
  hasNextPage = false,
  hasPreviousPage = false,
  onNextPage,
  onPreviousPage,
}: PlacesMapDialogProps) => {
  const { t, i18n } = useTranslation();
  const { location } = useMyLocationContext();

  const [open, setOpen] = useState(false);

  const isRtl = i18n.resolvedLanguage === "ar";

  const points = useMemo(() => {
    return places
      .map((place) => getPlacePoint(place))
      .filter((point): point is MapPoint => Boolean(point));
  }, [places]);

  const center: [number, number] =
    points.length > 0
      ? [points[0].lat, points[0].lon]
      : location
        ? [location.lat, location.lon]
        : DEFAULT_CENTER;

  const handlePreviousPage = () => {
    onPreviousPage?.();
  };

  const handleNextPage = () => {
    onNextPage?.();
  };

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
        {t("places.map.showPlaces")}
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

              <FitPlacesBounds points={points} />

              {points.map(({ place, lat, lon }) => (
                <Marker key={place.id} position={[lat, lon]}>
                  <Popup>
                    <Stack spacing={1.25} sx={{ minWidth: 220 }}>
                      <Stack spacing={0.25}>
                        <Typography sx={{ fontWeight: 800 }}>{place.name}</Typography>

                        <Typography variant="body2" color="text.secondary">
                          {t("places.table.governateId")}: {place.governateId}
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
                        <UpdatePlace place={place} />
                        <DeletePlace place={place} />
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
                {t("places.map.noPlacesTitle")}
              </Typography>

              <Typography color="text.secondary">
                {t("places.map.noPlacesDescription")}
              </Typography>
            </Stack>
          )}

          <Chip
            label={t("places.map.visibleCount", {
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
              onClick={handlePreviousPage}
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
              onClick={handleNextPage}
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

export default PlacesMapDialog;
