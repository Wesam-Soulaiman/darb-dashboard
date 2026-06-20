import { useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";

import type { LatLngExpression } from "leaflet";
import type { RunLiveLocation } from "../../../../types/run-realtime.types";

type RunTrackingMapProps = {
  location: RunLiveLocation | null;
};

type MapPositionControllerProps = {
  position: LatLngExpression | null;
};

const DEFAULT_POSITION: LatLngExpression = [33.5138, 36.2765];

const MapPositionController = ({ position }: MapPositionControllerProps) => {
  const map = useMap();

  const initialized = useRef(false);

  useEffect(() => {
    if (!position) {
      return;
    }

    if (!initialized.current) {
      map.setView(position, Math.max(map.getZoom(), 15));

      initialized.current = true;
      return;
    }

    /**
     * بعد أول تمركز لا نغير Zoom المستخدم.
     */
    map.panTo(position, {
      animate: true,
      duration: 0.4,
    });
  }, [map, position]);

  return null;
};

const RunTrackingMap = ({ location }: RunTrackingMapProps) => {
  const { t } = useTranslation();

  const position: LatLngExpression | null = location
    ? [location.coordinates.coordinates[1], location.coordinates.coordinates[0]]
    : null;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: {
            xs: 420,
            md: 600,
          },
        }}
      >
        <MapContainer
          center={position ?? DEFAULT_POSITION}
          zoom={13}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapPositionController position={position} />

          {position && (
            <CircleMarker center={position} radius={10}>
              <Popup>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {t("runs.tracking.busLocation")}
                </Typography>

                {location && (
                  <Typography variant="caption">
                    {t("runs.tracking.velocityValue", {
                      value: location.velocity,
                    })}
                  </Typography>
                )}
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </Box>
    </Paper>
  );
};

export default RunTrackingMap;
