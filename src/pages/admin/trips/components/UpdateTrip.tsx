import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdateTrip } from "../../../../hooks/organizations/useTrips";
import type { TripFormValues } from "../../../../schemas/organizations/tripSchemas";
import type { Bus } from "../../../../types/bus.types";
import type { OrganizationRoute } from "../../../../types/organization.types";
import type { Schedule } from "../../../../types/schedule.types";
import type { Trip } from "../../../../types/trip.types";
import TripForm from "./TripForm";
import { buildTripPayload } from "./tripPayload";

type UpdateTripProps = {
  trip: Trip;
  orgRoutes: OrganizationRoute[];
  schedules: Schedule[];
  buses: Bus[];
};

const UpdateTrip = ({
  trip,
  orgRoutes,
  schedules,
  buses,
}: UpdateTripProps) => {
  const { t } = useTranslation();

  const updateTrip = useUpdateTrip(
    trip.organizationId,
    trip.id,
  );

  const handleSubmit = async (
    values: TripFormValues,
    handleClose: () => void,
  ) => {
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
          loading={updateTrip.isPending}
          submitLabel={t("trips.actions.update")}
          defaultValues={{
            routeId: trip.route.id,
            scheduleId: String(trip.schedule.id),
            headsign: trip.headsign,
            defaultBusId: trip.defaultBus
              ? String(trip.defaultBus.id)
              : "",
            blockId: trip.blockId ?? "",
            isActive: trip.isActive,
          }}
          onSubmit={(values) =>
            handleSubmit(values, handleClose)
          }
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateTrip;