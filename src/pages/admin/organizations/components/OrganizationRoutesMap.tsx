import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
  Box
} from "@mui/material";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";
import type { OrganizationRoute } from "../../../../types/organization.types";

type MapPoint = [number, number];

type RouteLineItem = {
  id: string;
  name: string;
  mode?: string;
  price?: string;
  points: MapPoint[];
};

type OrganizationRoutesMapProps = {
  orgRoutes?: OrganizationRoute[];
  loading?: boolean;
};

const DEFAULT_CENTER: MapPoint = [33.5138, 36.2765];

const startIcon = L.divIcon({
  className: "route-start-marker",
  html: `<div style="
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: #2e7d32;
    color: white;
    display: grid;
    place-items: center;
    font-weight: 900;
    border: 2px solid white;
    box-shadow: 0 8px 20px rgba(0,0,0,.25);
  ">A</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const endIcon = L.divIcon({
  className: "route-end-marker",
  html: `<div style="
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: #d32f2f;
    color: white;
    display: grid;
    place-items: center;
    font-weight: 900;
    border: 2px solid white;
    box-shadow: 0 8px 20px rgba(0,0,0,.25);
  ">B</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const getRoutePoints = (orgRoute: OrganizationRoute): RouteLineItem | null => {
  const route = orgRoute.route;
  const coordinates = route.line?.coordinates;

  if (!Array.isArray(coordinates)) {
    return null;
  }

  const points = coordinates
    .map((point) => {
      if (!Array.isArray(point)) {
        return null;
      }

      const [lon, lat] = point;

      if (typeof lat !== "number" || typeof lon !== "number") {
        return null;
      }

      return [lat, lon] as MapPoint;
    })
    .filter((point): point is MapPoint => Boolean(point));

  if (points.length < 2) {
    return null;
  }

  return {
    id: route.id,
    name: route.name,
    mode: route.mode,
    price: route.price
      ? `${route.price.amount} ${route.price.currency}`
      : undefined,
    points,
  };
};

const FitRoutesBounds = ({ routes }: { routes: RouteLineItem[] }) => {
  const map = useMap();

  useEffect(() => {
    const points = routes.flatMap((route) => route.points);

    if (points.length === 0) {
      map.setView(DEFAULT_CENTER, 12);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }

    map.fitBounds(L.latLngBounds(points), {
      padding: [48, 48],
    });
  }, [map, routes]);

  return null;
};

const OrganizationRoutesMap = ({
  orgRoutes = [],
  loading = false,
}: OrganizationRoutesMapProps) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const routeLines = useMemo(() => {
    return orgRoutes
      .map((orgRoute) => getRoutePoints(orgRoute))
      .filter((route): route is RouteLineItem => Boolean(route));
  }, [orgRoutes]);

  const center = routeLines[0]?.points[0] ?? DEFAULT_CENTER;

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
        {t("organizations.profile.openRoutesMap")}
      </Button>

      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <DialogContent sx={{ p: 0, position: "relative" }}>
          {routeLines.length > 0 ? (
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

              <FitRoutesBounds routes={routeLines} />

              {routeLines.map((route) => {
                const startPoint = route.points[0];
                const endPoint = route.points[route.points.length - 1];

                return (
                  <Box component="span" key={route.id}>
                    <Polyline positions={route.points}>
                      <Popup>
                        <Stack spacing={1.25} sx={{ minWidth: 220 }}>
                          <Stack spacing={0.25}>
                            <Typography sx={{ fontWeight: 900 }}>
                              {route.name}
                            </Typography>

                            {route.mode ? (
                              <Typography variant="body2" color="text.secondary">
                                {t("organizations.profile.mode")}: {route.mode}
                              </Typography>
                            ) : null}

                            {route.price ? (
                              <Typography variant="body2" color="text.secondary">
                                {t("organizations.profile.price")}: {route.price}
                              </Typography>
                            ) : null}
                          </Stack>
                        </Stack>
                      </Popup>
                    </Polyline>

                    <Marker position={startPoint} icon={startIcon}>
                      <Popup>
                        <Typography sx={{ fontWeight: 900 }}>
                          {t("organizations.profile.routeStart")}
                        </Typography>
                        <Typography variant="body2">{route.name}</Typography>
                      </Popup>
                    </Marker>

                    <Marker position={endPoint} icon={endIcon}>
                      <Popup>
                        <Typography sx={{ fontWeight: 900 }}>
                          {t("organizations.profile.routeEnd")}
                        </Typography>
                        <Typography variant="body2">{route.name}</Typography>
                      </Popup>
                    </Marker>
                  </Box>
                );
              })}
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
                {t("organizations.profile.noRoutesOnMapTitle")}
              </Typography>

              <Typography color="text.secondary">
                {t("organizations.profile.noRoutesOnMapDescription")}
              </Typography>
            </Stack>
          )}

          <Chip
            label={t("organizations.profile.visibleRoutes", {
              count: routeLines.length,
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
        </DialogContent>

        <DialogActions>
          <Button
            startIcon={<CloseRoundedIcon />}
            onClick={() => setOpen(false)}
          >
            {t("common.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrganizationRoutesMap;