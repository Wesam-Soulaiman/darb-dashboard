import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { TFunction } from "i18next";

import type { Place } from "../types/place.types";
import type { TransitRoute } from "../types/route.types";
import UpdateRoute from "../pages/admin/routes/components/UpdateRoute";
import DeleteRoute from "../pages/admin/routes/components/DeleteRoute";
import ManageRouteStops from "../pages/admin/routes/components/ManageRouteStops";

interface RoutesCardProps {
  t: TFunction;
  places: Place[];
}

const getPlaceName = (places: Place[], id: number) => {
  return places.find((place) => place.id === id)?.name ?? String(id);
};

export const getRoutesCard = ({ t, places }: RoutesCardProps) => {
  return (route: TransitRoute) => (
    <Card
      key={route.id}
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.75}>
            <Typography noWrap sx={{ fontWeight: 900, lineHeight: 1.4 }}>
              {route.name}
            </Typography>

            <Chip
              label={t(`routes.modes.${route.mode}`)}
              size="small"
              variant="outlined"
              sx={{ width: "fit-content" }}
            />
          </Stack>

          <Divider />

          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary">
              {t("routes.table.originPlace")}
            </Typography>

            <Typography variant="body2">
              {getPlaceName(places, route.originPlaceId)}
            </Typography>
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary">
              {t("routes.table.destinationPlace")}
            </Typography>

            <Typography variant="body2">
              {getPlaceName(places, route.destinationPlaceId)}
            </Typography>
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="caption" color="text.secondary">
              {t("routes.table.price")}
            </Typography>

            <Typography variant="body2">
              {route.price?.amount} {route.price?.currency}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <ManageRouteStops route={route} />
            <UpdateRoute route={route} />
            <DeleteRoute route={route} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};