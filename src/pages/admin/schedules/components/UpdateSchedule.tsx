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
  return String(value).slice(0, 10);
};

const UpdateSchedule = ({ schedule }: UpdateScheduleProps) => {
  const { t } = useTranslation();
  const updateSchedule = useUpdateSchedule(schedule.organizationId, schedule.id);

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
      maxWidth="md"
      fullWidth
    >
      {({ handleClose }) => (
        <ScheduleForm
          showCard={false}
          loading={updateSchedule.isPending}
          submitLabel={t("schedules.actions.update")}
          defaultValues={{
            name: schedule.name ?? "",
            serviceCode: schedule.serviceCode ?? "",
            monday: Boolean(schedule.monday),
            tuesday: Boolean(schedule.tuesday),
            wednesday: Boolean(schedule.wednesday),
            thursday: Boolean(schedule.thursday),
            friday: Boolean(schedule.friday),
            saturday: Boolean(schedule.saturday),
            sunday: Boolean(schedule.sunday),
            color: schedule.color ?? "#3A7CDF",
            startDate: toDateInputValue(schedule.startDate),
            endDate: toDateInputValue(schedule.endDate),
            isActive: Boolean(schedule.isActive),
          }}
          onSubmit={(values) => handleSubmit(values, handleClose)}
        />
      )}
    </UpdatePopupAction>
  );
};

export default UpdateSchedule;