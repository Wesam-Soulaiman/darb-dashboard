import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslation } from "react-i18next";

import PopupButton from "../../../../components/PopupButton";
import { useCreateSchedule } from "../../../../hooks/organizations/useSchedules";
import type { ScheduleFormValues } from "../../../../schemas/organizations/scheduleSchemas";
import ScheduleForm from "./ScheduleForm";

type CreateScheduleProps = {
  orgId: number;
};

const CreateSchedule = ({ orgId }: CreateScheduleProps) => {
  const { t } = useTranslation();
  const createSchedule = useCreateSchedule(orgId);

  const handleSubmit = async (
    values: ScheduleFormValues,
    handleClose: () => void,
  ) => {
    await createSchedule.mutateAsync(values);
    handleClose();
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpen}
          sx={{
            borderRadius: 2,
            px: 2.5,
            alignSelf: { xs: "stretch", sm: "center" },
          }}
        >
          {t("schedules.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog {...props} maxWidth="sm" fullWidth>
          <DialogTitle>{t("schedules.createTitle")}</DialogTitle>

          <DialogContent dividers>
            <ScheduleForm
              loading={createSchedule.isPending}
              submitLabel={t("schedules.actions.create")}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreateSchedule;