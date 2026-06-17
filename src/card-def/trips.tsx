import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import type { TFunction } from "i18next";

import DeleteTrip from "../pages/admin/trips/components/DeleteTrip";
import ManageTripOperations from "../pages/admin/trips/components/ManageTripOperations";
import UpdateTrip from "../pages/admin/trips/components/UpdateTrip";
import type { Bus } from "../types/bus.types";
import type { OrganizationRoute } from "../types/organization.types";
import type { Schedule } from "../types/schedule.types";
import type { Trip, TripDriverRef } from "../types/trip.types";

type GetTripsCardProps = {
  t: TFunction;
  orgRoutes: OrganizationRoute[];
  schedules: Schedule[];
  buses: Bus[];
  drivers: TripDriverRef[];
};

export const getTripsCard = ({
  t,
  orgRoutes,
  schedules,
  buses,
  drivers,
}: GetTripsCardProps) => {
  return (trip: Trip) => (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
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
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  overflowWrap: "anywhere",
                }}
              >
                {trip.headsign}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {trip.route.name}
              </Typography>
            </Stack>

            <Chip
              size="small"
              color={trip.isActive ? "success" : "default"}
              label={trip.isActive ? t("common.active") : t("common.inactive")}
            />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              size="medium"
              variant="outlined"
              label={`${t("trips.table.schedule")}: ${trip.schedule.name}`}
              sx={{ mb: 1 }}
            />
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.25,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                minWidth: 0,
                p: 1.25,
                alignItems: "center",
                border: "1px solid",
                borderColor: trip.defaultDriver ? "divider" : "error.light",
                borderRadius: 2,
              }}
            >
              <PersonRoundedIcon color={trip.defaultDriver ? "primary" : "error"} />

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("trips.table.defaultDriver")}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {trip.defaultDriver
                    ? `${trip.defaultDriver.firstName} ${trip.defaultDriver.lastName}`
                    : t("trips.table.noDefaultDriver")}
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                minWidth: 0,
                p: 1.25,
                alignItems: "center",
                border: "1px solid",
                borderColor: trip.defaultBus ? "divider" : "error.light",
                borderRadius: 2,
              }}
            >
              <DirectionsBusRoundedIcon color={trip.defaultBus ? "primary" : "error"} />

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("trips.table.defaultBus")}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {trip.defaultBus
                    ? `${trip.defaultBus.plateNumber} — ${trip.defaultBus.busCode}`
                    : t("trips.table.noDefaultBus")}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
            <ManageTripOperations trip={trip} />

            <UpdateTrip
              trip={trip}
              orgRoutes={orgRoutes}
              schedules={schedules}
              buses={buses}
              drivers={drivers}
            />

            <DeleteTrip trip={trip} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
