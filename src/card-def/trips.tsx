import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { TFunction } from "i18next";

import DeleteTrip from "../pages/admin/trips/components/DeleteTrip";
import ManageTripOperations from "../pages/admin/trips/components/ManageTripOperations";
import UpdateTrip from "../pages/admin/trips/components/UpdateTrip";
import type { Bus } from "../types/bus.types";
import type { OrganizationRoute } from "../types/organization.types";
import type { Schedule } from "../types/schedule.types";
import type { Trip } from "../types/trip.types";

type GetTripsCardProps = {
  t: TFunction;
  orgRoutes: OrganizationRoute[];
  schedules: Schedule[];
  buses: Bus[];
};

export const getTripsCard = ({
  t,
  orgRoutes,
  schedules,
  buses,
}: GetTripsCardProps) => {
  return (trip: Trip) => (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3 }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Stack
              spacing={0.25}
              sx={{ minWidth: 0 }}
            >
              <Typography
                sx={{
                  fontWeight: 900,
                  overflowWrap: "anywhere",
                }}
              >
                {trip.headsign}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {trip.route.name}
              </Typography>
            </Stack>

            <Chip
              size="small"
              color={
                trip.isActive
                  ? "success"
                  : "default"
              }
              label={
                trip.isActive
                  ? t("common.active")
                  : t("common.inactive")
              }
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "wrap" }}
          >
            <Chip
              size="medium"
              variant="outlined"
              label={`${t("trips.table.schedule")}: ${trip.schedule.name}`}
              sx={{ mb: 1 }}
            />
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {t("trips.table.defaultBus")}:{" "}
            {trip.defaultBus?.plateNumber ??
              t("trips.table.noDefaultBus")}
          </Typography>

          <Divider />

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ justifyContent: "flex-end" }}
          >
            <ManageTripOperations trip={trip} />

            <UpdateTrip
              trip={trip}
              orgRoutes={orgRoutes}
              schedules={schedules}
              buses={buses}
            />

            <DeleteTrip trip={trip} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};