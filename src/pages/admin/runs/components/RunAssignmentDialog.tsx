import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { getApiErrorMessage } from "../../../../api/apiError";
import { useUpdateRun } from "../../../../hooks/organizations/useRuns";
import {
  runAssignmentSchema,
  type RunAssignmentFormInputValues,
  type RunAssignmentFormValues,
} from "../../../../schemas/organizations/runSchemas";

import type { Bus } from "../../../../types/bus.types";
import type { Run } from "../../../../types/run.types";
import type { UserListItem } from "../../../../types/user.types";

type RunAssignmentDialogProps = {
  run: Run;
  drivers: UserListItem[];
  buses: Bus[];
  optionsLoading?: boolean;
};

const RunAssignmentDialog = ({
  run,
  drivers,
  buses,
  optionsLoading = false,
}: RunAssignmentDialogProps) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const updateRun = useUpdateRun(run.organizationId, run.id);

  const defaultValues = useMemo(
    () => ({
      driverId: run.driver ? String(run.driver.id) : "",
      busId: run.bus ? String(run.bus.id) : "",
    }),
    [run.bus, run.driver],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<RunAssignmentFormInputValues, unknown, RunAssignmentFormValues>({
    resolver: zodResolver(runAssignmentSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleOpen = () => {
    updateRun.reset();
    reset(defaultValues);
    setOpen(true);
  };

  const handleClose = () => {
    if (updateRun.isPending) {
      return;
    }

    setOpen(false);
  };

  const handleSave = async (values: RunAssignmentFormValues) => {
    try {
      await updateRun.mutateAsync({
        driverId: Number(values.driverId),
        busId: Number(values.busId),
      });

      setOpen(false);
    } catch {
      return;
    }
  };

  const getValidationMessage = (message: unknown) => {
    return typeof message === "string" ? t(message) : undefined;
  };

  const noDrivers = drivers.length === 0;

  const noBuses = buses.length === 0;

  const currentDriverExists =
    run.driver !== null ? drivers.some((driver) => driver.id === run.driver?.id) : false;

  const currentBusExists =
    run.bus !== null ? buses.some((bus) => bus.id === run.bus?.id) : false;

  const errorMessage = updateRun.isError
    ? getApiErrorMessage(updateRun.error, t("runs.toast.updateError"))
    : null;

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<EditRoundedIcon />}
        onClick={handleOpen}
      >
        {t("runs.actions.editAssignment")}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
            },
          },
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit(handleSave)}>
          <DialogTitle>{t("runs.assignment.title")}</DialogTitle>

          <DialogContent>
            <Stack
              spacing={2.5}
              sx={{
                pt: 1,
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                }}
              >
                {t("runs.assignment.description", {
                  time: run.operatingTime,
                  headsign: run.trip.headsign,
                })}
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {t("runs.assignment.currentDriver")}:
                    </Box>{" "}
                    {run.driver
                      ? `${run.driver.firstName} ${run.driver.lastName} — ${run.driver.phone}`
                      : t("runs.card.unassignedDriver")}
                  </Typography>

                  <Typography variant="body2">
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {t("runs.assignment.currentBus")}:
                    </Box>{" "}
                    {run.bus
                      ? `${run.bus.plateNumber} — ${run.bus.busCode}`
                      : t("runs.card.unassignedBus")}
                  </Typography>
                </Stack>
              </Paper>

              {(noDrivers || noBuses) && !optionsLoading && (
                <Alert severity="warning">
                  {t("runs.assignment.optionsUnavailable")}
                </Alert>
              )}

              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

              <Controller
                name="driverId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    required
                    label={t("runs.assignment.driver")}
                    error={Boolean(errors.driverId)}
                    helperText={
                      getValidationMessage(errors.driverId?.message) ??
                      t("runs.assignment.driverHint")
                    }
                    disabled={optionsLoading || updateRun.isPending || noDrivers}
                  >
                    <MenuItem value="">{t("runs.assignment.selectDriver")}</MenuItem>

                    {run.driver && !currentDriverExists && (
                      <MenuItem value={String(run.driver.id)}>
                        {run.driver.firstName} {run.driver.lastName} — {run.driver.phone}
                      </MenuItem>
                    )}

                    {drivers.map((driver) => (
                      <MenuItem key={driver.id} value={String(driver.id)}>
                        {driver.firstName} {driver.lastName} — {driver.phone}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="busId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    required
                    label={t("runs.assignment.bus")}
                    error={Boolean(errors.busId)}
                    helperText={
                      getValidationMessage(errors.busId?.message) ??
                      t("runs.assignment.busHint")
                    }
                    disabled={optionsLoading || updateRun.isPending || noBuses}
                  >
                    <MenuItem value="">{t("runs.assignment.selectBus")}</MenuItem>

                    {run.bus && !currentBusExists && (
                      <MenuItem value={String(run.bus.id)}>
                        {run.bus.plateNumber} — {run.bus.busCode}
                      </MenuItem>
                    )}

                    {buses.map((bus) => (
                      <MenuItem key={bus.id} value={String(bus.id)}>
                        {bus.plateNumber} — {bus.busCode}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2.5,
            }}
          >
            <Button onClick={handleClose} disabled={updateRun.isPending}>
              {t("common.cancel")}
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={
                updateRun.isPending ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SaveRoundedIcon />
                )
              }
              disabled={
                updateRun.isPending ||
                optionsLoading ||
                noDrivers ||
                noBuses ||
                !isDirty ||
                !isValid
              }
            >
              {updateRun.isPending ? t("common.saving") : t("runs.assignment.save")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default RunAssignmentDialog;
