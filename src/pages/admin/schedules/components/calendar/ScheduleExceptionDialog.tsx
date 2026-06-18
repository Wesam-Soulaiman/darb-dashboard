import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { useTranslation } from "react-i18next";

import type { ScheduleExceptionType } from "../../../../../types/schedule.types";
import type { ExceptionDraft, UpdateExceptionDraft } from "./scheduleCalendar.types";

type ScheduleExceptionDialogProps = {
  open: boolean;
  draft: ExceptionDraft;
  loading: boolean;
  onChange: UpdateExceptionDraft;
  onClose: () => void;
  onSubmit: () => void;
};

const ScheduleExceptionDialog = ({
  open,
  draft,
  loading,
  onChange,
  onClose,
  onSubmit,
}: ScheduleExceptionDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!loading) onClose();
      }}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: draft.exceptionType === 1 ? "success.main" : "error.main",
              color: "#fff",
              display: "grid",
              placeItems: "center",
            }}
          >
            {draft.exceptionType === 1 ? (
              <EventAvailableRoundedIcon />
            ) : (
              <BlockRoundedIcon />
            )}
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {t("schedules.exceptions.addTitle")}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("schedules.exceptions.addDescription")}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5}>
          <TextField
            type="date"
            fullWidth
            required
            label={t("schedules.exceptions.form.date")}
            value={draft.exceptionDate}
            onChange={(event) => onChange("exceptionDate", event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            select
            fullWidth
            required
            label={t("schedules.exceptions.form.type")}
            value={draft.exceptionType}
            onChange={(event) =>
              onChange(
                "exceptionType",
                Number(event.target.value) as ScheduleExceptionType,
              )
            }
          >
            <MenuItem value={1}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <EventAvailableRoundedIcon color="success" fontSize="small" />
                <span>{t("schedules.exceptions.types.1")}</span>
              </Stack>
            </MenuItem>

            <MenuItem value={2}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <BlockRoundedIcon color="error" fontSize="small" />
                <span>{t("schedules.exceptions.types.2")}</span>
              </Stack>
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label={t("schedules.exceptions.form.note")}
            placeholder={t("schedules.exceptions.form.notePlaceholder")}
            helperText={t("schedules.exceptions.form.noteHint")}
            value={draft.note}
            onChange={(event) => onChange("note", event.target.value)}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              color="inherit"
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <AddRoundedIcon />
                )
              }
              onClick={onSubmit}
              disabled={loading}
              sx={{ borderRadius: 2, minWidth: 150 }}
            >
              {loading ? t("common.saving") : t("schedules.exceptions.actions.add")}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleExceptionDialog;
