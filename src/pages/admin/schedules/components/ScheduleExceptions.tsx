import { useState } from "react";
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
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DeletePopupAction from "../../../../components/actions/DeletePopupAction";
import PopupButton from "../../../../components/PopupButton";
import {
  useCreateScheduleException,
  useDeleteScheduleException,
  useScheduleExceptions,
} from "../../../../hooks/organizations/useSchedules";
import {
  scheduleExceptionSchema,
  type ScheduleExceptionFormInputValues,
  type ScheduleExceptionFormValues,
} from "../../../../schemas/organizations/scheduleSchemas";
import type {
  Schedule,
  ScheduleException,
  ScheduleExceptionType,
} from "../../../../types/schedule.types";

type ScheduleExceptionsProps = {
  schedule: Schedule;
};

const getExceptionColor = (
  type: ScheduleExceptionType,
): "success" | "error" => {
  return type === 1 ? "success" : "error";
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ar-SY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ar-SY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ScheduleExceptions = ({ schedule }: ScheduleExceptionsProps) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const exceptions = useScheduleExceptions(
    schedule.organizationId,
    schedule.id,
    isDialogOpen,
  );

  const createException = useCreateScheduleException(
    schedule.organizationId,
    schedule.id,
  );

  const deleteException = useDeleteScheduleException(
    schedule.organizationId,
    schedule.id,
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<
    ScheduleExceptionFormInputValues,
    unknown,
    ScheduleExceptionFormValues
  >({
    resolver: zodResolver(scheduleExceptionSchema),
    mode: "onChange",
    defaultValues: {
      exceptionDate: "",
      exceptionType: 1,
      note: "",
    },
  });

  const getErrorMessage = (message: unknown) => {
    if (typeof message !== "string") return undefined;
    return t(message);
  };

  const handleCreateException = async (
    values: ScheduleExceptionFormValues,
  ) => {
    await createException.mutateAsync({
      exceptionDate: values.exceptionDate,
      exceptionType: values.exceptionType as ScheduleExceptionType,
      note: values.note,
    });

    reset({
      exceptionDate: "",
      exceptionType: 1,
      note: "",
    });
  };

  const handleDeleteException = async (exception: ScheduleException) => {
    await deleteException.mutateAsync(exception.id);
  };

  const handleDialogClose = (
    event: object,
    reason: "backdropClick" | "escapeKeyDown",
    originalOnClose?: (
      event: object,
      reason: "backdropClick" | "escapeKeyDown",
    ) => void,
  ) => {
    if (createException.isPending || deleteException.isPending) {
      return;
    }

    setIsDialogOpen(false);
    originalOnClose?.(event, reason);
  };

  return (
    <PopupButton
      ButtonComponentRender={({ handleOpen }) => (
        <Tooltip title={t("schedules.exceptions.title")}>
          <IconButton
            color="primary"
            onClick={() => {
              setIsDialogOpen(true);
              handleOpen();
            }}
          >
            <EventBusyRoundedIcon />
          </IconButton>
        </Tooltip>
      )}
      DialogRender={({ props }) => (
        <Dialog
          {...props}
          maxWidth="md"
          fullWidth
          onClose={(event, reason) =>
            handleDialogClose(event, reason, props.onClose)
          }
          slotProps={{
            paper: {
              sx: {
                borderRadius: { xs: 0, sm: 3 },
                maxHeight: { xs: "100%", sm: "90vh" },
              },
            },
          }}
        >
          <DialogTitle
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <EventBusyRoundedIcon />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {t("schedules.exceptions.title")}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {schedule.name} — {schedule.serviceCode}
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>

          <DialogContent
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: "background.default",
            }}
          >
            <Stack spacing={3} sx={{pt: 3}}>
              <Paper
                component="form"
                noValidate
                elevation={0}
                onSubmit={handleSubmit(handleCreateException)}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Stack spacing={2.5}>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 900 }}
                    >
                      {t("schedules.exceptions.addTitle")}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {t("schedules.exceptions.addDescription")}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(190px, 0.8fr) minmax(210px, 1fr)",
                      },
                      gap: 2,
                    }}
                  >
                    <Controller
                      name="exceptionDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          required
                          label={t("schedules.exceptions.form.date")}
                          error={Boolean(errors.exceptionDate)}
                          helperText={getErrorMessage(
                            errors.exceptionDate?.message,
                          )}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="exceptionType"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          fullWidth
                          required
                          label={t("schedules.exceptions.form.type")}
                          value={field.value}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          error={Boolean(errors.exceptionType)}
                          helperText={getErrorMessage(
                            errors.exceptionType?.message,
                          )}
                        >
                          <MenuItem value={1}>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: "center" }}
                            >
                              <EventAvailableRoundedIcon
                                color="success"
                                fontSize="small"
                              />

                              <span>
                                {t("schedules.exceptions.types.1")}
                              </span>
                            </Stack>
                          </MenuItem>

                          <MenuItem value={2}>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignItems: "center" }}
                            >
                              <BlockRoundedIcon
                                color="error"
                                fontSize="small"
                              />

                              <span>
                                {t("schedules.exceptions.types.2")}
                              </span>
                            </Stack>
                          </MenuItem>
                        </TextField>
                      )}
                    />

                    <Controller
                      name="note"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          minRows={3}
                          maxRows={6}
                          label={t("schedules.exceptions.form.note")}
                          placeholder={t(
                            "schedules.exceptions.form.notePlaceholder",
                          )}
                          error={Boolean(errors.note)}
                          helperText={
                            getErrorMessage(errors.note?.message) ??
                            t("schedules.exceptions.form.noteHint")
                          }
                          sx={{
                            gridColumn: {
                              xs: "auto",
                              md: "1 / -1",
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{
                      justifyContent: "flex-end",
                      alignItems: { xs: "stretch", sm: "center" },
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={
                        createException.isPending ? (
                          <CircularProgress
                            size={18}
                            color="inherit"
                          />
                        ) : (
                          <AddRoundedIcon />
                        )
                      }
                      disabled={!isValid || createException.isPending}
                      sx={{
                        minWidth: { sm: 160 },
                        minHeight: 44,
                        borderRadius: 2,
                      }}
                    >
                      {createException.isPending
                        ? t("common.saving")
                        : t("schedules.exceptions.actions.add")}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              <Divider />

              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 900 }}
                    >
                      {t("schedules.exceptions.listTitle")}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {t("schedules.exceptions.listDescription")}
                    </Typography>
                  </Box>

                  {!exceptions.isLoading && (
                    <Chip
                      size="medium"
                      label={exceptions.data?.length ?? 0}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Stack>

                {exceptions.isLoading && (
                  <Paper
                    elevation={0}
                    sx={{
                      minHeight: 160,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                      <CircularProgress size={30} />

                      <Typography color="text.secondary">
                        {t("common.loading")}
                      </Typography>
                    </Stack>
                  </Paper>
                )}

                {exceptions.isError && (
                  <Alert
                    severity="error"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => exceptions.refetch()}
                      >
                        {t("common.retry")}
                      </Button>
                    }
                  >
                    {t("schedules.exceptions.loadError")}
                  </Alert>
                )}

                {!exceptions.isLoading &&
                  !exceptions.isError &&
                  (exceptions.data?.length ?? 0) === 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        minHeight: 180,
                        p: 3,
                        display: "grid",
                        placeItems: "center",
                        textAlign: "center",
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 3,
                        bgcolor: "background.paper",
                      }}
                    >
                      <Stack
                        spacing={1.5}
                        sx={{
                          maxWidth: 360,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            bgcolor: "action.hover",
                            color: "text.secondary",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <EventBusyRoundedIcon />
                        </Box>

                        <Typography sx={{ fontWeight: 800 }}>
                          {t("schedules.exceptions.empty")}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {t("schedules.exceptions.emptyDescription")}
                        </Typography>
                      </Stack>
                    </Paper>
                  )}

                {!exceptions.isLoading &&
                  !exceptions.isError &&
                  exceptions.data?.map((exception) => {
                    const isAdded = exception.exceptionType === 1;
                    return (
                      <Paper
                        key={exception.id}
                        elevation={0}
                        sx={{
                          overflow: "hidden",
                          borderRadius: 3,
                          bgcolor: "background.paper",
                        }}
                      >
                        <Box
                          sx={{
                            height: 4,
                            bgcolor: isAdded
                              ? "success.main"
                              : "error.main",
                          }}
                        />

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          sx={{
                            p: 2,
                            alignItems: {
                              xs: "stretch",
                              sm: "flex-start",
                            },
                            justifyContent: "space-between",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{
                              minWidth: 0,
                              alignItems: "flex-start",
                              flex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                flexShrink: 0,
                                display: "grid",
                                placeItems: "center",
                                bgcolor: isAdded
                                  ? "success.light"
                                  : "error.light",
                                color: isAdded
                                  ? "success.dark"
                                  : "error.dark",
                              }}
                            >
                              {isAdded ? (
                                <EventAvailableRoundedIcon />
                              ) : (
                                <BlockRoundedIcon />
                              )}
                            </Box>

                            <Stack
                              spacing={1.25}
                              sx={{
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                sx={{
                                  alignItems: {
                                    xs: "flex-start",
                                    sm: "center",
                                  },
                                  flexWrap: "wrap",
                                }}
                              >
                                <Chip
                                  size="medium"
                                  color={getExceptionColor(
                                    exception.exceptionType,
                                  )}
                                  label={t(
                                    `schedules.exceptions.types.${exception.exceptionType}`,
                                  )}
                                  sx={{ fontWeight: 800 }}
                                />

                                <Chip
                                  size="medium"
                                  variant="outlined"
                                  icon={<CalendarMonthRoundedIcon />}
                                  label={formatDate(
                                    exception.exceptionDate,
                                  )}
                                />
                              </Stack>

                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: 2,
                                  bgcolor: "action.hover",
                                  minHeight: 52,
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <NotesRoundedIcon
                                    fontSize="small"
                                    color="action"
                                    sx={{ mt: 0.25, flexShrink: 0 }}
                                  />

                                  <Typography
                                    variant="body2"
                                    color={
                                      exception.note
                                        ? "text.primary"
                                        : "text.secondary"
                                    }
                                    sx={{
                                      whiteSpace: "pre-wrap",
                                      overflowWrap: "anywhere",
                                      lineHeight: 1.7,
                                    }}
                                  >
                                    {exception.note ||
                                      t(
                                        "schedules.exceptions.noNote",
                                      )}
                                  </Typography>
                                </Stack>
                              </Box>

                              <Stack
                                direction="row"
                                spacing={0.75}
                                sx={{
                                  alignItems: "center",
                                  color: "text.secondary",
                                }}
                              >
                                <AccessTimeRoundedIcon
                                  sx={{ fontSize: 16 }}
                                />

                                <Typography variant="caption">
                                  {t(
                                    "schedules.exceptions.createdAt",
                                  )}
                                  : {formatDateTime(exception.createdAt)}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>

                          <Box
                            sx={{
                              alignSelf: {
                                xs: "flex-end",
                                sm: "flex-start",
                              },
                            }}
                          >
                            <DeletePopupAction<ScheduleException>
                              item={exception}
                              title={t("schedules.exceptions.delete.title")}
                              description={t("schedules.exceptions.delete.message", {
                                date: formatDate(exception.exceptionDate),
                              })}
                              tooltip={t("schedules.exceptions.actions.delete")}
                              confirmLabel={t("common.delete")}
                              cancelLabel={t("common.cancel")}
                              loading={deleteException.isPending}
                              onConfirm={handleDeleteException}
                            />
                          </Box>
                        </Stack>
                      </Paper>
                    );
                  })}
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    />
  );
};

export default ScheduleExceptions;