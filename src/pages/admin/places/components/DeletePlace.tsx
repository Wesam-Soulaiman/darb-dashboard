import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import { useDeletePlace } from "../../../../hooks/locations/usePlaces";
import type { Place } from "../../../../types/place.types";

type DeletePlaceProps = {
  place: Place;
};

const DeletePlace = ({ place }: DeletePlaceProps) => {
  const { t } = useTranslation();
  const deletePlace = useDeletePlace();

  return (
    <DeletePopupAction
      item={place}
      loading={deletePlace.isPending}
      title={t("places.deleteTitle")}
      description={t("places.deleteDescription", {
        name: place.name,
      })}
      tooltip={t("common.delete")}
      confirmLabel={t("common.delete")}
      cancelLabel={t("common.cancel")}
      onConfirm={async (selectedPlace) => {
        await deletePlace.mutateAsync(selectedPlace.id);
      }}
    />
  );
};

export default DeletePlace;
