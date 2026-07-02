import { useMemo, useState } from "react";
import type { ComponentType, ReactElement } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Slide,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import { routingService } from "../../../../services/routing/routingService";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const Transition = Slide as ComponentType<
  TransitionProps & {
    children: ReactElement;
  }
>;

type MapPoint = [number, number];

type SelectRouteLineMapProps = {
  points: MapPoint[];
  onSelectLine?: (points: MapPoint[]) => void;
};

type LineClickHandlerProps = {
  onAddPoint: (point: MapPoint) => void;
};

type EditablePointIconOptions = {
  label: number;
  backgroundColor: string;
  foregroundColor: string;
  borderColor: string;
};

const DEFAULT_CENTER: MapPoint = [33.5138, 36.2765];

const MIN_LINE_POINTS = 2;

const createEditablePointIcon = ({
  label,
  backgroundColor,
  foregroundColor,
  borderColor,
}: EditablePointIconOptions) => {
  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: 32px;
          height: 32px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${backgroundColor};
          color: ${foregroundColor};
          border: 3px solid ${borderColor};
          font-size: 12px;
          font-weight: 900;
          cursor: grab;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
          user-select: none;
        "
      >
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const LineClickHandler = ({ onAddPoint }: LineClickHandlerProps) => {
  useMapEvents({
    click(event) {
      onAddPoint([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
};

const SelectRouteLineMap = ({ points, onSelectLine }: SelectRouteLineMapProps) => {
  const { t } = useTranslation();

  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [draftPoints, setDraftPoints] = useState<MapPoint[]>(points);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [routingError, setRoutingError] = useState<string | null>(null);

  const editablePointColors = useMemo(
    () => ({
      backgroundColor: theme.palette.background.paper,
      foregroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    }),
    [theme.palette.background.paper, theme.palette.primary.main],
  );

  const handleOpen = () => {
    setDraftPoints(points);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUndo = () => {
    setDraftPoints((current) => current.slice(0, -1));
  };

  const handleClear = () => {
    setDraftPoints([]);
  };

  const handleSave = () => {
    onSelectLine?.(draftPoints);
    setOpen(false);
  };

  const handleAddPoint = (point: MapPoint) => {
    setDraftPoints((current) => [...current, point]);
  };

  const handleMovePoint = (pointIndex: number, nextPoint: MapPoint) => {
    setDraftPoints((current) =>
      current.map((point, index) => (index === pointIndex ? nextPoint : point)),
    );
  };

  const handleDeletePoint = (pointIndex: number) => {
    setDraftPoints((current) => {
      if (current.length <= MIN_LINE_POINTS) {
        return current;
      }

      return current.filter((_, index) => index !== pointIndex);
    });
  };

  const handleGenerateRouteOnRoads = async () => {
    if (draftPoints.length < 2 || routingLoading) {
      return;
    }

    setRoutingLoading(true);
    setRoutingError(null);

    try {
      const result = await routingService.generateRouteOnRoads({
        points: draftPoints,
      });

      setDraftPoints(result.points);
    } catch (error) {
      setRoutingError(
        error instanceof Error ? error.message : t("routes.map.routingError"),
      );
    } finally {
      setRoutingLoading(false);
    }
  };

  return (
    <>
      <Tooltip title={t("routes.map.selectLine")}>
        <IconButton color="primary" onClick={handleOpen}>
          <MapRoundedIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{
          transition: Transition,
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {routingError && (
            <Box
              sx={{
                position: "absolute",
                zIndex: 1000,
                top: 16,
                insetInlineStart: 16,
                insetInlineEnd: 16,
                pointerEvents: "none",
              }}
            >
              <Alert severity="error">{routingError}</Alert>
            </Box>
          )}
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={13}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {draftPoints.length > 1 && (
              <Polyline
                positions={draftPoints}
                pathOptions={{
                  color: theme.palette.primary.main,
                  weight: 5,
                  opacity: 0.85,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            )}

            {draftPoints.map((point, index) => {
              const icon = createEditablePointIcon({
                label: index + 1,
                ...editablePointColors,
              });

              return (
                <Marker
                  key={`${point[0]}-${point[1]}-${index}`}
                  position={point}
                  icon={icon}
                  draggable
                  eventHandlers={{
                    dragend(event) {
                      const marker = event.target as L.Marker;

                      const nextPosition = marker.getLatLng();

                      handleMovePoint(index, [nextPosition.lat, nextPosition.lng]);
                    },
                  }}
                >
                  <Popup>
                    <Stack spacing={1.25}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            color: "primary.main",
                            display: "flex",
                          }}
                        >
                          <DragIndicatorRoundedIcon fontSize="small" />
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                          }}
                        >
                          {t("routes.map.pointTitle", {
                            value: index + 1,
                          })}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                        }}
                      >
                        {t("routes.map.dragPointHint")}
                      </Typography>

                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteRoundedIcon />}
                        disabled={draftPoints.length <= MIN_LINE_POINTS}
                        onClick={() => {
                          handleDeletePoint(index);
                        }}
                      >
                        {t("routes.map.deletePoint")}
                      </Button>

                      {draftPoints.length <= MIN_LINE_POINTS && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                          }}
                        >
                          {t("routes.map.minPointsHint")}
                        </Typography>
                      )}
                    </Stack>
                  </Popup>
                </Marker>
              );
            })}

            <LineClickHandler onAddPoint={handleAddPoint} />
          </MapContainer>
        </DialogContent>

        <DialogActions>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            sx={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                flexWrap: "wrap",
              }}
            >
              <Button
                startIcon={<UndoRoundedIcon />}
                onClick={handleUndo}
                disabled={draftPoints.length === 0}
              >
                {t("routes.map.undoPoint")}
              </Button>

              <Button
                color="error"
                startIcon={<DeleteSweepRoundedIcon />}
                onClick={handleClear}
                disabled={draftPoints.length === 0}
              >
                {t("routes.map.clearLine")}
              </Button>
              <Button
                startIcon={
                  routingLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <AutoFixHighRoundedIcon />
                  )
                }
                onClick={handleGenerateRouteOnRoads}
                disabled={draftPoints.length < 2 || routingLoading}
              >
                {routingLoading
                  ? t("routes.map.generatingRoute")
                  : t("routes.map.generateRouteOnRoads")}
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Button onClick={handleClose}>{t("common.cancel")}</Button>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={draftPoints.length < MIN_LINE_POINTS}
              >
                {t("routes.map.saveLine")}
              </Button>
            </Stack>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SelectRouteLineMap;
