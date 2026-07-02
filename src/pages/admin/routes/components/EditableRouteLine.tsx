import { useMemo } from "react";
import { Button, Stack, Typography, useTheme } from "@mui/material";
import L from "leaflet";
import { Marker, Polyline, Popup } from "react-leaflet";
import { useTranslation } from "react-i18next";

type RoutePoint = [number, number]; // [latitude, longitude]

type EditableRouteLineProps = {
  points: RoutePoint[];
  onChange: (points: RoutePoint[]) => void;
  disabled?: boolean;
  minPoints?: number;
};

const createEditablePointIcon = ({
  label,
  backgroundColor,
  foregroundColor,
  borderColor,
}: {
  label: number;
  backgroundColor: string;
  foregroundColor: string;
  borderColor: string;
}) => {
  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: 30px;
          height: 30px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${backgroundColor};
          color: ${foregroundColor};
          border: 3px solid ${borderColor};
          font-size: 11px;
          font-weight: 900;
          cursor: grab;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
        "
      >
        ${label}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const EditableRouteLine = ({
  points,
  onChange,
  disabled = false,
  minPoints = 2,
}: EditableRouteLineProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const pointIconColors = useMemo(
    () => ({
      backgroundColor: theme.palette.background.paper,
      foregroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    }),
    [theme.palette.background.paper, theme.palette.primary.main],
  );

  const handleMovePoint = (pointIndex: number, nextPoint: RoutePoint) => {
    if (disabled) {
      return;
    }

    onChange(points.map((point, index) => (index === pointIndex ? nextPoint : point)));
  };

  const handleDeletePoint = (pointIndex: number) => {
    if (disabled || points.length <= minPoints) {
      return;
    }

    onChange(points.filter((_, index) => index !== pointIndex));
  };

  return (
    <>
      {points.length >= 2 && (
        <Polyline
          positions={points}
          pathOptions={{
            color: theme.palette.primary.main,
            weight: 5,
            opacity: 0.85,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      )}

      {points.map((point, index) => {
        const icon = createEditablePointIcon({
          label: index + 1,
          ...pointIconColors,
        });

        return (
          <Marker
            key={`route-point-${index}`}
            position={point}
            icon={icon}
            draggable={!disabled}
            eventHandlers={{
              dragend(event) {
                const marker = event.target as L.Marker;
                const nextPosition = marker.getLatLng();

                handleMovePoint(index, [nextPosition.lat, nextPosition.lng]);
              },
            }}
          >
            <Popup>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {t("routes.lineEditor.pointTitle", {
                    value: index + 1,
                  })}
                </Typography>

                <Typography variant="caption">
                  {t("routes.lineEditor.dragPointHint")}
                </Typography>

                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  disabled={disabled || points.length <= minPoints}
                  onClick={() => {
                    handleDeletePoint(index);
                  }}
                >
                  {t("routes.lineEditor.deletePoint")}
                </Button>
              </Stack>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default EditableRouteLine;
