import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";

import type { Stop } from "../types/stop.types";
import type { Place } from "../types/place.types";
import UpdateStop from "../pages/admin/stops/components/UpdateStop";
import DeleteStop from "../pages/admin/stops/components/DeleteStop";

interface StopsCardProps {
  t: TFunction;
  places: Place[];
}

const getCoordinatesText = (stop: Stop) => {
  const lon = stop.coordinates?.coordinates?.[0];
  const lat = stop.coordinates?.coordinates?.[1];

  if (lat === undefined || lon === undefined) {
    return "-";
  }

  return `${lat.toFixed(5)} - ${lon.toFixed(5)}`;
};

export const getStopsCard = ({ t, places }: StopsCardProps) => {
  return (stop: Stop) => {
    const place = places.find((item) => item.id === stop.placeId);

    return (
      <Card
        key={stop.id}
        variant="outlined"
        sx={{
          overflow: "hidden",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography noWrap sx={{ fontWeight: 900, lineHeight: 1.4 }}>
                {stop.name || t("stops.defaultName")}
              </Typography>
            </Stack>

            <Divider />

            <Stack
              spacing={0.75}
              direction={{ xs: "row" }}
              sx={{ justifyContent: "space-between" }}
            >
              <Stack spacing={0.75}>
                <Typography variant="caption" color="text.secondary">
                  {t("stops.table.place")}
                </Typography>

                <Typography variant="body2">{place?.name ?? stop.placeId}</Typography>
              </Stack>

              <Stack spacing={0.75}>
                <Typography variant="caption" color="text.secondary">
                  {t("stops.table.coordinates")}
                </Typography>

                <Typography variant="body2">{getCoordinatesText(stop)}</Typography>
              </Stack>
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
        </CardContent>
      </Card>
    );
  };
};
