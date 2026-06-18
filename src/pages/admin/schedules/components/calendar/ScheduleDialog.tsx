import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { useTranslation } from "react-i18next";

import DeletePopupAction from "../../../../../components/actions/DeletePopupAction";
import type { Schedule, ScheduleException } from "../../../../../types/schedule.types";
import type {
  ScheduleFormInputValues,
  ScheduleFormValues,
} from "../../../../../schemas/organizations/scheduleSchemas";
import ScheduleForm from "../ScheduleForm";
import type { ScheduleDialogMode } from "./scheduleCalendar.types";
import { formatDate } from "./scheduleCalendar.utils";

type ScheduleDialogProps = {
  open: boolean;
  mode: ScheduleDialogMode;
  schedule: Schedule | null;
  defaultValues?: Partial<ScheduleFormInputValues>;
  saving: boolean;
  deleting: boolean;
  exceptions: ScheduleException[] | undefined;
  exceptionsLoading: boolean;
  exceptionsError: boolean;
  exceptionDeleting: boolean;
  onClose: () => void;
  onSubmit: (values: ScheduleFormValues) => Promise<void> | void;
  onDeleteSchedule: (schedule: Schedule) => Promise<void> | void;
  onRetryExceptions: () => void;
  onOpenExceptionDialog: () => void;
  onDeleteException: (exception: ScheduleException) => Promise<void> | void;
};

const ScheduleDialog = ({
  open,
  mode,
  schedule,
  defaultValues,
  saving,
  deleting,
  exceptions,
  exceptionsLoading,
  exceptionsError,
  exceptionDeleting,
  onClose,
  onSubmit,
  onDeleteSchedule,
  onRetryExceptions,
  onOpenExceptionDialog,
  onDeleteException,
}: ScheduleDialogProps) => {
  const { t } = useTranslation();

  const isCreateMode = mode === "create";

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!saving && !deleting) onClose();
      }}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {isCreateMode ? t("schedules.createTitle") : t("schedules.updateTitle")}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {isCreateMode
                ? t("schedules.calendar.createDialogHint")
                : `${schedule?.name ?? ""} - ${schedule?.serviceCode ?? ""}`}
            </Typography>
          </Box>

          {!isCreateMode && schedule && (
            <DeletePopupAction<Schedule>
              item={schedule}
              title={t("schedules.delete.title")}
              description={t("schedules.delete.message", {
                name: schedule.name,
              })}
              tooltip={t("schedules.delete.tooltip")}
              confirmLabel={t("common.delete")}
              cancelLabel={t("common.cancel")}
              loading={deleting}
              onConfirm={onDeleteSchedule}
            />
          )}
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <ScheduleForm
            showCard={false}
            loading={saving}
            submitLabel={
              isCreateMode ? t("schedules.actions.create") : t("schedules.actions.update")
            }
            defaultValues={defaultValues}
            onSubmit={onSubmit}
          />

          {!isCreateMode && (
            <>
              <Divider />

              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {t("schedules.exceptions.listTitle")}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {t("schedules.exceptions.listDescription")}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<AddRoundedIcon />}
                    onClick={onOpenExceptionDialog}
                    sx={{ borderRadius: 2 }}
                  >
                    {t("schedules.exceptions.actions.add")}
                  </Button>
                </Stack>

                {exceptionsLoading && (
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <CircularProgress size={20} />
                    <Typography color="text.secondary">{t("common.loading")}</Typography>
                  </Stack>
                )}

                {exceptionsError && (
                  <Alert
                    severity="error"
                    action={
                      <Button color="inherit" size="small" onClick={onRetryExceptions}>
                        {t("common.retry")}
                      </Button>
                    }
                    sx={{ borderRadius: 2 }}
                  >
                    {t("schedules.exceptions.loadError")}
                  </Alert>
                )}

                {!exceptionsLoading &&
                  !exceptionsError &&
                  (exceptions?.length ?? 0) === 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: "divider",
                        textAlign: "center",
                      }}
                    >
                      <Typography color="text.secondary">
                        {t("schedules.exceptions.empty")}
                      </Typography>
                    </Paper>
                  )}

                <Stack spacing={1.5}>
                  {exceptions?.map((exception) => {
                    const isAdded = exception.exceptionType === 1;

                    return (
                      <Paper
                        key={exception.id}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: isAdded ? "success.light" : "error.light",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Stack spacing={1} sx={{ minWidth: 0 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: "center", flexWrap: "wrap" }}
                            >
                              <Chip
                                size="small"
                                color={isAdded ? "success" : "error"}
                                icon={
                                  isAdded ? (
                                    <EventAvailableRoundedIcon />
                                  ) : (
                                    <BlockRoundedIcon />
                                  )
                                }
                                label={t(
                                  `schedules.exceptions.types.${exception.exceptionType}`,
                                )}
                                sx={{ fontWeight: 800 }}
                              />

                              <Chip
                                size="small"
                                variant="outlined"
                                label={formatDate(exception.exceptionDate)}
                              />
                            </Stack>

                            <Typography
                              variant="body2"
                              color={exception.note ? "text.primary" : "text.secondary"}
                              sx={{
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {exception.note || t("schedules.exceptions.noNote")}
                            </Typography>
                          </Stack>

                          <DeletePopupAction<ScheduleException>
                            item={exception}
                            title={t("schedules.exceptions.delete.title")}
                            description={t("schedules.exceptions.delete.message", {
                              date: formatDate(exception.exceptionDate),
                            })}
                            tooltip={t("schedules.exceptions.actions.delete")}
                            confirmLabel={t("common.delete")}
                            cancelLabel={t("common.cancel")}
                            loading={exceptionDeleting}
                            onConfirm={onDeleteException}
                          />
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              </Stack>
            </>
          )}

          {isCreateMode && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {t("schedules.calendar.saveThenAddExceptions")}
            </Alert>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
