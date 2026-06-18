import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import { useDeleteBus } from "../../../../hooks/organizations/useBuses";
import type { Bus } from "../../../../types/bus.types";

type DeleteBusProps = {
  bus: Bus;
};

const DeleteBus = ({ bus }: DeleteBusProps) => {
  const { t } = useTranslation();
  const deleteBus = useDeleteBus(bus.organizationId);

  return (
    <DeletePopupAction<Bus>
      item={bus}
      title={t("buses.delete.title")}
      description={t("buses.delete.message", {
        plateNumber: bus.plateNumber,
      })}
      tooltip={t("buses.delete.tooltip")}
      confirmLabel={t("common.delete")}
      cancelLabel={t("common.cancel")}
      loading={deleteBus.isPending}
      onConfirm={(selectedBus) => deleteBus.mutateAsync(selectedBus.id)}
    />
  );
};

export default DeleteBus;
