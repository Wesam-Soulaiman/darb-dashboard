import type { TripFormValues } from "../../../../schemas/organizations/tripSchemas";
import type { CreateTripPayload } from "../../../../types/trip.types";

export const buildTripPayload = (values: TripFormValues): CreateTripPayload => {
  return {
    routeId: values.routeId,
    scheduleId: Number(values.scheduleId),
    headsign: values.headsign.trim(),

    defaultDriverId: Number(values.defaultDriverId),
    defaultBusId: Number(values.defaultBusId),

    directionId: 0,

    ...(values.blockId
      ? {
          blockId: values.blockId.trim(),
        }
      : {}),

    isActive: values.isActive,
  };
};
