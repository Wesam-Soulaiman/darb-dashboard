import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdatePlace } from "../../../../hooks/locations/usePlaces";
import type { Place, PlaceCenter } from "../../../../types/place.types";
import type {
  PlaceFormInputValues,
  PlaceFormValues,
} from "../../../../schemas/locations/placeSchemas";
import PlaceForm from "./PlaceForm";

type UpdatePlaceProps = {
  place: Place;
};

const DEFAULT_CENTER: PlaceFormInputValues["center"] = {
  type: "Point",
  coordinates: [36.2765, 33.5138],
};

const normalizePlaceCenter = (
  center?: PlaceCenter | null,
): PlaceFormInputValues["center"] => {
  if (
    center?.type === "Point" &&
    Array.isArray(center.coordinates) &&
    center.coordinates.length === 2 &&
    typeof center.coordinates[0] === "number" &&
    typeof center.coordinates[1] === "number"
  ) {
    return {
      type: "Point",
      coordinates: [center.coordinates[0], center.coordinates[1]],
      bbox: Array.isArray(center.bbox) ? center.bbox : undefined,
    };
  }

  return DEFAULT_CENTER;
};

const UpdatePlace = ({ place }: UpdatePlaceProps) => {
  const { t } = useTranslation();
  const updatePlace = useUpdatePlace(place.id);

  const handleSubmit = async (
    values: PlaceFormValues,
    handleClose: () => void,
  ) => {
    await updatePlace.mutateAsync({
      name: values.name,
      governateId: values.governateId,
      center: values.center,
    });

    handleClose();
  };

  return (
    <UpdatePopupAction
      title={t("places.editTitle")}
      tooltip={t("common.edit")}
      maxWidth="sm"
    >
      {({ handleClose }) => (
        <PlaceForm
          loading={updatePlace.isPending}
          submitLabel={t("places.actions.update")}
          defaultValues={{
            name: place.name,
            governateId: place.governateId,
            center: normalizePlaceCenter(place.center),
          }}
          onSubmit={(values) => handleSubmit(values, handleClose)}
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdatePlace;