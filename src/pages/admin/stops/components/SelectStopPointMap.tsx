import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Slide,
  Tooltip,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";
import { useMyLocationContext } from "../../../../contexts/MyLocationContext";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
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

type LocationMarkerProps = {
  setPosition: (position: MapPoint) => void;
};

const LocationMarker = ({ setPosition }: LocationMarkerProps) => {
  useMapEvents({
    click(event) {
      setPosition([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
};

const RecenterMap = ({ center }: { center: MapPoint }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

type SelectStopPointMapProps = {
  point: MapPoint;
  onSelectPoint?: (point: MapPoint) => void;
};

const SelectStopPointMap = ({ point, onSelectPoint }: SelectStopPointMapProps) => {
  const { t } = useTranslation();
  const { location, requestLocation, isLoading } = useMyLocationContext();

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MapPoint>(point);

  const handleOpen = () => {
    setPosition(point);
    setOpen(true);
  };

  const handleUseMyLocation = () => {
    if (!location) {
      requestLocation();
      return;
    }

    setPosition([location.lat, location.lon]);
  };

  return (
    <>
      <Tooltip title={t("stops.map.selectPoint")}>
        <IconButton color="primary" onClick={handleOpen}>
          <MapRoundedIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        slots={{ transition: Transition }}
      >
        <DialogContent sx={{ p: 0 }}>
          <MapContainer
            center={position}
            zoom={15}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap center={position} />
            <Marker position={position} />
            <LocationMarker setPosition={setPosition} />
          </MapContainer>
        </DialogContent>

        <DialogActions>
          <Button
            startIcon={<MyLocationRoundedIcon />}
            onClick={handleUseMyLocation}
            disabled={isLoading}
          >
            {t("location.actions.useMyLocation")}
          </Button>

          <Button onClick={() => setOpen(false)}>{t("common.cancel")}</Button>

          <Button
            variant="contained"
            onClick={() => {
              onSelectPoint?.(position);
              setOpen(false);
            }}
          >
            {t("stops.map.savePoint")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SelectStopPointMap;
