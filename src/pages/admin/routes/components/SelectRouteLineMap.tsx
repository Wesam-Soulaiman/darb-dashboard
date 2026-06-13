import { useState } from "react";
import {
  Button,
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
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const Transition = Slide as React.ComponentType<
  TransitionProps & {
    children: React.ReactElement;
  }
>;

type MapPoint = [number, number];

type SelectRouteLineMapProps = {
  points: MapPoint[];
  onSelectLine?: (points: MapPoint[]) => void;
};

const DEFAULT_CENTER: MapPoint = [33.5138, 36.2765];

const LineClickHandler = ({
  onAddPoint,
}: {
  onAddPoint: (point: MapPoint) => void;
}) => {
  useMapEvents({
    click(event) {
      onAddPoint([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
};

const SelectRouteLineMap = ({
  points,
  onSelectLine,
}: SelectRouteLineMapProps) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [draftPoints, setDraftPoints] = useState<MapPoint[]>(points);

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
              <Polyline positions={draftPoints} />
            )}

            {draftPoints.map((point, index) => (
              <Marker
                key={`${point[0]}-${point[1]}-${index}`}
                position={point}
              />
            ))}

            <LineClickHandler
              onAddPoint={(point) => {
                setDraftPoints((current) => [...current, point]);
              }}
            />
          </MapContainer>
        </DialogContent>

        <DialogActions>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1}>
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
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button onClick={handleClose}>
                {t("common.cancel")}
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={draftPoints.length < 2}
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