import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

type GtfsTimePickerProps = {
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  minutesStep?: number;
  maxDayOffset?: number;
};

type ParsedGtfsTime = {
  pickerValue: Dayjs;
  dayOffset: number;
};

const DEFAULT_TIME = "08:00:00";

const GTFS_TIME_REGEX = /^\d{2,}:[0-5]\d:[0-5]\d$/;

const parseGtfsTime = (value: string): ParsedGtfsTime => {
  const normalized = GTFS_TIME_REGEX.test(value.trim()) ? value.trim() : DEFAULT_TIME;

  const [hours, minutes, seconds] = normalized.split(":").map(Number);

  const dayOffset = Math.floor(hours / 24);
  const hourOfDay = hours % 24;

  return {
    dayOffset,

    pickerValue: dayjs().startOf("day").hour(hourOfDay).minute(minutes).second(seconds),
  };
};

const toGtfsTime = (value: Dayjs, dayOffset: number) => {
  const totalHours = dayOffset * 24 + value.hour();

  return `${String(totalHours).padStart(2, "0")}:${String(value.minute()).padStart(
    2,
    "0",
  )}:00`;
};

const blurActiveElement = () => {
  const activeElement = document.activeElement as HTMLElement | null;

  if (activeElement && activeElement !== document.body) {
    activeElement.blur();
  }
};

const GtfsTimePicker = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error = false,
  helperText,
  required = false,
  disabled = false,
  minutesStep = 1,
  maxDayOffset = 2,
}: GtfsTimePickerProps) => {
  const { t } = useTranslation();

  const parsedValue = useMemo(() => parseGtfsTime(value), [value]);

  const [open, setOpen] = useState(false);

  const [draftTime, setDraftTime] = useState<Dayjs>(parsedValue.pickerValue);

  const [draftDayOffset, setDraftDayOffset] = useState(parsedValue.dayOffset);

  useEffect(() => {
    if (open) return;

    setDraftTime(parsedValue.pickerValue);
    setDraftDayOffset(parsedValue.dayOffset);
  }, [open, parsedValue]);

  const handleOpen = () => {
    if (disabled) return;

    setDraftTime(parsedValue.pickerValue);
    setDraftDayOffset(parsedValue.dayOffset);
    setOpen(true);
  };

  const handleClose = () => {
    blurActiveElement();
    setOpen(false);
    onBlur?.();
  };

  const handleApply = () => {
    onChange(toGtfsTime(draftTime, draftDayOffset));

    handleClose();
  };

  const dayOffsetOptions = Array.from(
    {
      length: Math.max(0, maxDayOffset) + 1,
    },
    (_, index) => index,
  );

  return (
    <FormControl fullWidth error={error}>
      <TextField
        fullWidth
        name={name}
        label={label}
        value={value || DEFAULT_TIME}
        required={required}
        disabled={disabled}
        error={error}
        helperText={helperText}
        onClick={handleOpen}
        slotProps={{
          htmlInput: {
            readOnly: true,
            style: {
              cursor: disabled ? "default" : "pointer",
            },
          },

          input: {
            endAdornment: <AccessTimeRoundedIcon color="action" />,
          },
        }}
        sx={{
          "& .MuiInputBase-root": {
            cursor: disabled ? "default" : "pointer",
          },
        }}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
            },
          },
        }}
      >
        <DialogTitle>
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {label}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("trips.timePicker.description")}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1.5}>
            <StaticTimePicker
              value={draftTime}
              onChange={(newValue) => {
                if (newValue?.isValid()) {
                  setDraftTime(newValue.second(0));
                }
              }}
              ampm={false}
              views={["hours", "minutes"]}
              openTo="hours"
              minutesStep={minutesStep}
              slotProps={{
                actionBar: {
                  actions: [],
                },
              }}
            />

            <TextField
              select
              fullWidth
              label={t("trips.timePicker.serviceDay")}
              value={draftDayOffset}
              onChange={(event) => setDraftDayOffset(Number(event.target.value))}
            >
              {dayOffsetOptions.map((offset) => (
                <MenuItem key={offset} value={offset}>
                  {offset === 0
                    ? t("trips.timePicker.sameDay")
                    : t("trips.timePicker.nextDay", {
                        count: offset,
                      })}
                </MenuItem>
              ))}
            </TextField>

            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: "action.hover",
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {t("trips.timePicker.gtfsValue")}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  fontFamily: "monospace",
                }}
              >
                {toGtfsTime(draftTime, draftDayOffset)}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Button color="inherit" variant="outlined" onClick={handleClose}>
            {t("common.cancel")}
          </Button>

          <Button variant="contained" onClick={handleApply}>
            {t("common.done")}
          </Button>
        </DialogActions>
      </Dialog>
    </FormControl>
  );
};

GtfsTimePicker.displayName = "GtfsTimePicker";

export default GtfsTimePicker;
