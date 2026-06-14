import type { TripFormValues } from "../../../../schemas/organizations/tripSchemas";
import type { CreateTripPayload } from "../../../../types/trip.types";

export const buildTripPayload = (
  values: TripFormValues,
): CreateTripPayload => {
  const defaultBusId = values.defaultBusId
    ? Number(values.defaultBusId)
    : undefined;

  return {
    routeId: values.routeId,

    scheduleId: Number(values.scheduleId),

    headsign: values.headsign.trim(),

    directionId: 0,

    ...(Number.isFinite(defaultBusId) && defaultBusId
      ? {
          defaultBusId,
        }
      : {}),

    ...(values.blockId
      ? {
          blockId: values.blockId.trim(),
        }
      : {}),

    isActive: values.isActive,
  };
};