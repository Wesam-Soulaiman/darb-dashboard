import { useMemo } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import dayjs from "dayjs";
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

  const defaultValues = useMemo(
    () => ({
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
    }),
    [],
  );

  const handleSubmit = async (values: ScheduleFormValues, handleClose: () => void) => {
    await createSchedule.mutateAsync(values);
    handleClose();
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={(event) => {
            event.currentTarget.blur();

            requestAnimationFrame(() => {
              handleOpen();
            });
          }}
          sx={{
            borderRadius: 2,
            px: 2.5,
            alignSelf: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          {t("schedules.actions.create")}
        </Button>
      )}
      DialogRender={({ props, handleClose }) => (
        <Dialog
          {...props}
          maxWidth="md"
          fullWidth
          disableRestoreFocus
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                maxHeight: {
                  xs: "calc(100dvh - 16px)",
                  sm: "calc(100dvh - 64px)",
                },
              },
            },
          }}
        >
          <DialogTitle>{t("schedules.createTitle")}</DialogTitle>

          <DialogContent
            dividers
            sx={{
              px: {
                xs: 2,
                sm: 3,
              },
              py: 2.5,

              "& .MuiFormControl-root": {
                m: 0,
              },
            }}
          >
            <ScheduleForm
              showCard={false}
              loading={createSchedule.isPending}
              submitLabel={t("schedules.actions.create")}
              defaultValues={defaultValues}
              disableSubmitWhenPristine={false}
              onSubmit={(values) => handleSubmit(values, handleClose)}
            />
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default CreateSchedule;
