import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdateBus } from "../../../../hooks/organizations/useBuses";
import type { Bus } from "../../../../types/bus.types";
import type { UpdateBusFormValues } from "../../../../schemas/organizations/busSchemas";
import BusForm from "./BusForm";

type UpdateBusProps = {
  bus: Bus;
};

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const UpdateBus = ({ bus }: UpdateBusProps) => {
  const { t } = useTranslation();
  const updateBus = useUpdateBus(bus.organizationId, bus.id);

  const handleSubmit = async (
    values: UpdateBusFormValues,
    handleClose: () => void,
  ) => {
    await updateBus.mutateAsync({
      plateNumber: values.plateNumber,
      type: values.type,
      capacity: values.capacity,
      manufacturer: values.manufacturer,
      model: values.model,
      year: values.year,
      registrationExpiry: values.registrationExpiry,
      status: values.status,
      lastMaintenanceDate: values.lastMaintenanceDate,
      nextMaintenanceDate: values.nextMaintenanceDate,
    });

    handleClose();
  };

  return (
    <UpdatePopupAction
      title={t("buses.updateTitle")}
      tooltip={t("buses.actions.update")}
      maxWidth="sm"
      fullWidth
    >
      {({ handleClose }) => (
        <BusForm
          mode="update"
          loading={updateBus.isPending}
          submitLabel={t("buses.actions.update")}
          defaultValues={{
            plateNumber: bus.plateNumber,
            type: bus.type,
            capacity: bus.capacity,
            manufacturer: bus.manufacturer,
            model: bus.model,
            year: bus.year,
            status: bus.status,
            registrationExpiry: toDateInputValue(bus.registrationExpiry),
            lastMaintenanceDate: toDateInputValue(bus.lastMaintenanceDate),
            nextMaintenanceDate: toDateInputValue(bus.nextMaintenanceDate),
          }}
          onSubmit={(values) =>
            handleSubmit(values as UpdateBusFormValues, handleClose)
          }
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateBus;