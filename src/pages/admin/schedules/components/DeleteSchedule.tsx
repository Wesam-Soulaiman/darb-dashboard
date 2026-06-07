import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import { useDeleteSchedule } from "../../../../hooks/organizations/useSchedules";
import type { Schedule } from "../../../../types/schedule.types";

type DeleteScheduleProps = {
  schedule: Schedule;
};

const DeleteSchedule = ({ schedule }: DeleteScheduleProps) => {
  const { t } = useTranslation();
  const deleteSchedule = useDeleteSchedule(schedule.organizationId);

  return (
    <DeletePopupAction<Schedule>
      item={schedule}
      title={t("schedules.delete.title")}
      description={t("schedules.delete.message", {
        name: schedule.name,
      })}
      tooltip={t("schedules.delete.tooltip")}
      confirmLabel={t("common.delete")}
      cancelLabel={t("common.cancel")}
      loading={deleteSchedule.isPending}
      onConfirm={(selectedSchedule) =>
        deleteSchedule.mutateAsync(selectedSchedule.id)
      }
    />
  );
};

export default DeleteSchedule;