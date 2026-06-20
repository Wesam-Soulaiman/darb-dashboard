import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { getApiErrorMessage } from "../../../../api/apiError";
import { useCancelRun } from "../../../../hooks/organizations/useRuns";
import {
  cancelRunSchema,
  type CancelRunFormValues,
} from "../../../../schemas/organizations/runSchemas";

import type { Run } from "../../../../types/run.types";

type CancelRunActionProps = {
  run: Run;
};

const CancelRunAction = ({ run }: CancelRunActionProps) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const cancelRun = useCancelRun(run.organizationId, run.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CancelRunFormValues>({
    resolver: zodResolver(cancelRunSchema),
    mode: "onChange",
    defaultValues: {
      reason: "",
    },
  });

  const handleOpen = () => {
    cancelRun.reset();
    reset({
      reason: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    if (cancelRun.isPending) {
      return;
    }

    setOpen(false);
  };

  const handleCancelRun = async (values: CancelRunFormValues) => {
    try {
      await cancelRun.mutateAsync({
        reason: values.reason.trim(),
      });

      setOpen(false);

      reset({
        reason: "",
      });
    } catch {
      // يبقى Dialog مفتوحًا لعرض خطأ الباك.
    }
  };

  const errorMessage = cancelRun.isError
    ? getApiErrorMessage(cancelRun.error, t("runs.toast.cancelError"))
    : null;

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color="error"
        startIcon={<CancelRoundedIcon />}
        onClick={handleOpen}
      >
        {t("runs.actions.cancelRun")}
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
        <Box component="form" noValidate onSubmit={handleSubmit(handleCancelRun)}>
          <DialogTitle>{t("runs.cancel.title")}</DialogTitle>

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
                {t("runs.cancel.description", {
                  time: run.operatingTime,
                  headsign: run.trip.headsign,
                })}
              </Typography>

              <Alert severity="warning">{t("runs.cancel.warning")}</Alert>

              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    multiline
                    minRows={4}
                    maxRows={8}
                    label={t("runs.cancel.reason")}
                    placeholder={t("runs.cancel.reasonPlaceholder")}
                    error={Boolean(errors.reason)}
                    helperText={
                      errors.reason?.message
                        ? t(errors.reason.message)
                        : t("runs.cancel.reasonHint")
                    }
                    disabled={cancelRun.isPending}
                    slotProps={{
                      htmlInput: {
                        maxLength: 500,
                      },
                    }}
                  />
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2.5,
            }}
          >
            <Button onClick={handleClose} disabled={cancelRun.isPending}>
              {t("common.back")}
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="error"
              startIcon={
                cancelRun.isPending ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <CancelRoundedIcon />
                )
              }
              disabled={cancelRun.isPending || !isValid}
            >
              {cancelRun.isPending
                ? t("runs.cancel.cancelling")
                : t("runs.cancel.confirm")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default CancelRunAction;
