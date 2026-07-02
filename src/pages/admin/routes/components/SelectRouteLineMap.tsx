import { useMemo, useState } from "react";
import type { ComponentType, ReactElement } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Slide,
  Stack,
  Tooltip,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import L from "leaflet";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";

import { routingService } from "../../../../services/routing/routingService";
import EditableRouteLine from "./EditableRouteLine";

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

const DEFAULT_CENTER: MapPoint = [33.5138, 36.2765];

const MIN_LINE_POINTS = 2;

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

  const [open, setOpen] = useState(false);
  const [draftPoints, setDraftPoints] = useState<MapPoint[]>(points);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [routingError, setRoutingError] = useState<string | null>(null);

  const mapCenter = useMemo<MapPoint>(() => {
    return draftPoints[0] ?? points[0] ?? DEFAULT_CENTER;
  }, [draftPoints, points]);

  const handleOpen = () => {
    setDraftPoints(points);
    setRoutingError(null);
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
    setRoutingError(null);
  };

  const handleSave = () => {
    onSelectLine?.(draftPoints);
    setOpen(false);
  };

  const handleAddPoint = (point: MapPoint) => {
    setDraftPoints((current) => [...current, point]);
    setRoutingError(null);
  };

  const handleGenerateRouteOnRoads = async () => {
    if (draftPoints.length < MIN_LINE_POINTS || routingLoading) {
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
            center={mapCenter}
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

            <EditableRouteLine
              points={draftPoints}
              onChange={setDraftPoints}
              minPoints={MIN_LINE_POINTS}
            />

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
                disabled={draftPoints.length < MIN_LINE_POINTS || routingLoading}
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
