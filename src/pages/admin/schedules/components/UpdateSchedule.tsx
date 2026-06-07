import { useTranslation } from "react-i18next";

import UpdatePopupAction from "../../../../components/actions/UpdatePopupAction";
import { useUpdateSchedule } from "../../../../hooks/organizations/useSchedules";
import type { Schedule } from "../../../../types/schedule.types";
import type { ScheduleFormValues } from "../../../../schemas/organizations/scheduleSchemas";
import ScheduleForm from "./ScheduleForm";

type UpdateScheduleProps = {
  schedule: Schedule;
};

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const UpdateSchedule = ({ schedule }: UpdateScheduleProps) => {
  const { t } = useTranslation();
  const updateSchedule = useUpdateSchedule(
    schedule.organizationId,
    schedule.id,
  );

  const handleSubmit = async (
    values: ScheduleFormValues,
    handleClose: () => void,
  ) => {
    await updateSchedule.mutateAsync(values);
    handleClose();
  };

  return (
    <UpdatePopupAction
      title={t("schedules.updateTitle")}
      tooltip={t("schedules.actions.update")}
      maxWidth="sm"
      fullWidth
    >
      {({ handleClose }) => (
        <ScheduleForm
          loading={updateSchedule.isPending}
          submitLabel={t("schedules.actions.update")}
          defaultValues={{
            name: schedule.name,
            serviceCode: schedule.serviceCode,
            monday: schedule.monday,
            tuesday: schedule.tuesday,
            wednesday: schedule.wednesday,
            thursday: schedule.thursday,
            friday: schedule.friday,
            saturday: schedule.saturday,
            sunday: schedule.sunday,
            startDate: toDateInputValue(schedule.startDate),
            endDate: toDateInputValue(schedule.endDate),
            isActive: schedule.isActive,
          }}
          onSubmit={(values) => handleSubmit(values, handleClose)}
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateSchedule;