import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdateTrip } from "../../../../hooks/organizations/useTrips";
import type { TripFormValues } from "../../../../schemas/organizations/tripSchemas";
import type { Bus } from "../../../../types/bus.types";
import type { OrganizationRoute } from "../../../../types/organization.types";
import type { Schedule } from "../../../../types/schedule.types";
import type { Trip, TripDriverRef } from "../../../../types/trip.types";
import TripForm from "./TripForm";
import { buildTripPayload } from "./tripPayload";

type UpdateTripProps = {
  trip: Trip;
  orgRoutes: OrganizationRoute[];
  schedules: Schedule[];
  buses: Bus[];
  drivers: TripDriverRef[];
};

const UpdateTrip = ({ trip, orgRoutes, schedules, buses, drivers }: UpdateTripProps) => {
  const { t } = useTranslation();

  const updateTrip = useUpdateTrip(trip.organizationId, trip.id);

  const handleSubmit = async (values: TripFormValues, handleClose: () => void) => {
    await updateTrip.mutateAsync(buildTripPayload(values));

    handleClose();
  };

  return (
    <UpdatePopupAction
      title={t("trips.updateTitle")}
      tooltip={t("trips.actions.update")}
      maxWidth="md"
      fullWidth
    >
      {({ handleClose }) => (
        <TripForm
          orgRoutes={orgRoutes}
          schedules={schedules}
          buses={buses}
          drivers={drivers}
          loading={updateTrip.isPending}
          submitLabel={t("trips.actions.update")}
          defaultValues={{
            routeId: trip.route.id,
            scheduleId: String(trip.schedule.id),
            headsign: trip.headsign,
            defaultDriverId: trip.defaultDriver ? String(trip.defaultDriver.id) : "",
            defaultBusId: trip.defaultBus ? String(trip.defaultBus.id) : "",
            blockId: trip.blockId ?? "",
            isActive: trip.isActive,
          }}
          onSubmit={(values) => handleSubmit(values, handleClose)}
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateTrip;
