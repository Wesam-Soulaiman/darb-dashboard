import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { TFunction } from "i18next";

import type { Bus, BusStatus } from "../types/bus.types";
import UpdateBus from "../pages/admin/buses/components/UpdateBus";
import DeleteBus from "../pages/admin/buses/components/DeleteBus";

type GetBusesCardProps = {
  t: TFunction;
};

const getStatusColor = (
  status: BusStatus,
): "success" | "info" | "warning" | "error" | "default" => {
  switch (status) {
    case "AVAILABLE":
      return "success";
    case "IN_SERVICE":
      return "info";
    case "MAINTENANCE":
      return "warning";
    case "OUT_OF_SERVICE":
      return "error";
    default:
      return "default";
  }
};

export const getBusesCard = ({ t }: GetBusesCardProps) => {
  return (bus: Bus) => (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={0.5}>
              <Typography sx={{ fontWeight: 900 }}>
                {bus.plateNumber}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {bus.busCode}
              </Typography>
            </Stack>

            <Chip
              label={t(`buses.statuses.${bus.status}`)}
              color={getStatusColor(bus.status)}
              size="small"
            />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              label={t(`buses.types.${bus.type}`)}
              size="small"
              variant="outlined"
            />

            <Chip
              label={`${t("buses.table.capacity")}: ${bus.capacity}`}
              size="small"
              variant="outlined"
            />

            <Chip
              label={`${bus.manufacturer} ${bus.model}`}
              size="small"
              variant="outlined"
            />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {t("buses.table.year")}: {bus.year}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <UpdateBus bus={bus} />
            <DeleteBus bus={bus} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};