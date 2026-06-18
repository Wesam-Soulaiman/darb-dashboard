import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdateStop } from "../../../../hooks/locations/useStops";
import type { Stop, StopCoordinates } from "../../../../types/stop.types";
import type {
  StopFormInputValues,
  StopFormValues,
} from "../../../../schemas/locations/stopSchemas";
import StopForm from "./StopForm";

type UpdateStopProps = {
  stop: Stop;
};

const DEFAULT_COORDINATES: StopFormInputValues["coordinates"] = {
  type: "Point",
  coordinates: [36.2765, 33.5138],
};

const normalizeStopCoordinates = (
  coordinates?: StopCoordinates | null,
): StopFormInputValues["coordinates"] => {
  if (
    coordinates?.type === "Point" &&
    Array.isArray(coordinates.coordinates) &&
    coordinates.coordinates.length === 2 &&
    typeof coordinates.coordinates[0] === "number" &&
    typeof coordinates.coordinates[1] === "number"
  ) {
    return {
      type: "Point",
      coordinates: [coordinates.coordinates[0], coordinates.coordinates[1]],
      bbox: Array.isArray(coordinates.bbox) ? coordinates.bbox : undefined,
    };
  }

  return DEFAULT_COORDINATES;
};

const UpdateStop = ({ stop }: UpdateStopProps) => {
  const { t } = useTranslation();
  const updateStop = useUpdateStop(stop.id);

  const handleSubmit = async (values: StopFormValues, handleClose: () => void) => {
    await updateStop.mutateAsync({
      name: values.name,
      placeId: values.placeId,
      coordinates: values.coordinates,
    });

    handleClose();
  };

  return (
    <UpdatePopupAction
      title={t("stops.editTitle")}
      tooltip={t("common.edit")}
      maxWidth="sm"
    >
      {({ handleClose }) => (
        <StopForm
          loading={updateStop.isPending}
          submitLabel={t("stops.actions.update")}
          defaultValues={{
            name: stop.name,
            placeId: stop.placeId,
            coordinates: normalizeStopCoordinates(stop.coordinates),
          }}
          onSubmit={(values) => handleSubmit(values, handleClose)}
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateStop;
