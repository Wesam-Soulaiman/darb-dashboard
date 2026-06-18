import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";

import type { Place } from "../types/place.types";
import UpdatePlace from "../pages/admin/places/components/UpdatePlace";
import DeletePlace from "../pages/admin/places/components/DeletePlace";

interface PlacesCardProps {
  t: TFunction;
}

const getCenterText = (place: Place) => {
  const lon = place.center?.coordinates?.[0];
  const lat = place.center?.coordinates?.[1];

  if (lat === undefined || lon === undefined) {
    return "-";
  }

  return `${lat.toFixed(5)} - ${lon.toFixed(5)}`;
};

export const getPlacesCard = ({ t }: PlacesCardProps) => {
  return (place: Place) => (
    <Card
      key={place.id}
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
            <Typography
              noWrap
              sx={{
                fontWeight: 900,
                lineHeight: 1.4,
              }}
            >
              {place.name}
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
                {t("places.table.governateId")}
              </Typography>

              <Typography variant="body2">{place.governateId}</Typography>
            </Stack>

            <Stack spacing={0.75}>
              <Typography variant="caption" color="text.secondary">
                {t("places.table.center")}
              </Typography>

              <Typography variant="body2">{getCenterText(place)}</Typography>
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
            <UpdatePlace place={place} />
            <DeletePlace place={place} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
