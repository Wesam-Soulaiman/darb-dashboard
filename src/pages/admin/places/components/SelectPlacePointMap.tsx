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
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";
import { useMyLocationContext } from "../../../../contexts/MyLocationContext";

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

type MapPoint = [number, number]; // [lat, lon]

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

type RecenterMapProps = {
  center: MapPoint;
};

const RecenterMap = ({ center }: RecenterMapProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

type SelectPlacePointMapProps = {
  point: MapPoint;
  onSelectPoint?: (point: MapPoint) => void;
};

const SelectPlacePointMap = ({
  point,
  onSelectPoint,
}: SelectPlacePointMapProps) => {
  const { t } = useTranslation();
  const { location, requestLocation, isLoading } = useMyLocationContext();

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MapPoint>(point);

  const handleOpen = () => {
    setPosition(point);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      <Tooltip title={t("places.map.selectPoint")}>
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
            center={position}
            zoom={15}
            style={{
              height: "100%",
              width: "100%",
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

          <Button onClick={handleClose}>{t("common.cancel")}</Button>

          <Button
            variant="contained"
            onClick={() => {
              onSelectPoint?.(position);
              handleClose();
            }}
          >
            {t("places.map.savePoint")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SelectPlacePointMap;