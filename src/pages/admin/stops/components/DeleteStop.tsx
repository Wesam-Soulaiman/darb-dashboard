import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import { useDeleteStop } from "../../../../hooks/locations/useStops";
import type { Stop } from "../../../../types/stop.types";

type DeleteStopProps = {
  stop: Stop;
};

const DeleteStop = ({ stop }: DeleteStopProps) => {
  const { t } = useTranslation();
  const deleteStop = useDeleteStop();

  return (
    <DeletePopupAction
      item={stop}
      loading={deleteStop.isPending}
      title={t("stops.deleteTitle")}
      description={t("stops.deleteDescription", {
        name: stop.name || stop.id,
      })}
      tooltip={t("common.delete")}
      confirmLabel={t("common.delete")}
      cancelLabel={t("common.cancel")}
      onConfirm={async (selectedStop) => {
        await deleteStop.mutateAsync(selectedStop.id);
      }}
    />
  );
};

export default DeleteStop;
