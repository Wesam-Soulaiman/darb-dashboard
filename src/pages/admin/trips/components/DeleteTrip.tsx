import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import { useDeleteTrip } from "../../../../hooks/organizations/useTrips";
import type { Trip } from "../../../../types/trip.types";

type DeleteTripProps = {
  trip: Trip;
};

const DeleteTrip = ({ trip }: DeleteTripProps) => {
  const { t } = useTranslation();

  const deleteTrip = useDeleteTrip(trip.organizationId);

  return (
    <DeletePopupAction<Trip>
      item={trip}
      title={t("trips.delete.title")}
      description={t("trips.delete.message", {
        headsign: trip.headsign,
      })}
      tooltip={t("trips.delete.tooltip")}
      confirmLabel={t("common.delete")}
      cancelLabel={t("common.cancel")}
      loading={deleteTrip.isPending}
      onConfirm={(selectedTrip) => deleteTrip.mutateAsync(selectedTrip.id)}
    />
  );
};

export default DeleteTrip;
