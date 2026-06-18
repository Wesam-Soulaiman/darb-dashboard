import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import DatePickerInput from "../../../../components/inputs/DatePickerInput";
import ColorPickerField from "../../../../components/inputs/ColorPickerField";
import {
  scheduleSchema,
  type ScheduleFormInputValues,
  type ScheduleFormValues,
} from "../../../../schemas/organizations/scheduleSchemas";

type ScheduleFormProps = {
  defaultValues?: Partial<ScheduleFormInputValues>;
  loading?: boolean;
  submitLabel: string;
  showCard?: boolean;
  showReset?: boolean;
  disableSubmitWhenPristine?: boolean;
  onSubmit: (values: ScheduleFormValues) => Promise<void> | void;
};

const DEFAULT_SCHEDULE_COLOR = "#3A7CDFFF";

const DAYS: Array<{
  key: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  labelKey: string;
}> = [
  { key: "monday", labelKey: "schedules.days.monday" },
  { key: "tuesday", labelKey: "schedules.days.tuesday" },
  { key: "wednesday", labelKey: "schedules.days.wednesday" },
  { key: "thursday", labelKey: "schedules.days.thursday" },
  { key: "friday", labelKey: "schedules.days.friday" },
  { key: "saturday", labelKey: "schedules.days.saturday" },
  { key: "sunday", labelKey: "schedules.days.sunday" },
];

const normalizeColorValue = (value?: string | null) => {
  if (!value) return DEFAULT_SCHEDULE_COLOR;

  const color = String(value).trim();

  if (/^#[0-9a-fA-F]{8}$/.test(color)) {
    return color.toUpperCase();
  }

  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return `${color.toUpperCase()}FF`;
  }

  return DEFAULT_SCHEDULE_COLOR;
};

const ScheduleForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  showCard = true,
  showReset = true,
  disableSubmitWhenPristine = true,
  onSubmit,
}: ScheduleFormProps) => {
  const { t } = useTranslation();

  const defaultName = defaultValues?.name ?? "";
  const defaultServiceCode = defaultValues?.serviceCode ?? "";
  const defaultMonday = defaultValues?.monday ?? true;
  const defaultTuesday = defaultValues?.tuesday ?? true;
  const defaultWednesday = defaultValues?.wednesday ?? true;
  const defaultThursday = defaultValues?.thursday ?? true;
  const defaultFriday = defaultValues?.friday ?? false;
  const defaultSaturday = defaultValues?.saturday ?? false;
  const defaultSunday = defaultValues?.sunday ?? true;
  const defaultColor = normalizeColorValue(defaultValues?.color);
  const defaultStartDate = defaultValues?.startDate ?? "";
  const defaultEndDate = defaultValues?.endDate ?? "";
  const defaultIsActive = defaultValues?.isActive ?? true;

  const normalizedDefaultValues = useMemo<ScheduleFormInputValues>(
    () => ({
      name: defaultName,
      serviceCode: defaultServiceCode,
      monday: defaultMonday,
      tuesday: defaultTuesday,
      wednesday: defaultWednesday,
      thursday: defaultThursday,
      friday: defaultFriday,
      saturday: defaultSaturday,
      sunday: defaultSunday,
      color: defaultColor,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      isActive: defaultIsActive,
    }),
    [
      defaultName,
      defaultServiceCode,
      defaultMonday,
      defaultTuesday,
      defaultWednesday,
      defaultThursday,
      defaultFriday,
      defaultSaturday,
      defaultSunday,
      defaultColor,
      defaultStartDate,
      defaultEndDate,
      defaultIsActive,
    ],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<ScheduleFormInputValues, unknown, ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    mode: "onChange",
    defaultValues: normalizedDefaultValues,
  });

  useEffect(() => {
    reset(normalizedDefaultValues);
  }, [normalizedDefaultValues, reset]);

  const selectedDays = watch();

  const getErrorMessage = (message: unknown) => {
    if (typeof message !== "string") return undefined;
    return t(message);
  };

  const toggleDay = (key: (typeof DAYS)[number]["key"]) => {
    setValue(key, !selectedDays[key], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const applyDayPreset = (preset: "all" | "workdays" | "weekend" | "clear") => {
    const nextValues = {
      monday: preset === "all" || preset === "workdays",
      tuesday: preset === "all" || preset === "workdays",
      wednesday: preset === "all" || preset === "workdays",
      thursday: preset === "all" || preset === "workdays",
      friday: preset === "all" || preset === "weekend",
      saturday: preset === "all" || preset === "weekend",
      sunday: preset === "all" || preset === "workdays",
    };

    Object.entries(nextValues).forEach(([key, value]) => {
      setValue(key as keyof typeof nextValues, value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });
  };

  const activeDaysCount = DAYS.filter((day) => selectedDays[day.key]).length;

  const formContent = (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 2,
          }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label={t("schedules.form.name")}
                error={Boolean(errors.name)}
                helperText={getErrorMessage(errors.name?.message)}
              />
            )}
          />

          <Controller
            name="serviceCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                label={t("schedules.form.serviceCode")}
                error={Boolean(errors.serviceCode)}
                helperText={
                  getErrorMessage(errors.serviceCode?.message) ??
                  t("schedules.form.serviceCodeHint")
                }
              />
            )}
          />

          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                name={field.name}
                label={t("schedules.form.startDate")}
                value={field.value ? dayjs(field.value) : null}
                onChange={(value) => {
                  field.onChange(
                    value && value.isValid() ? value.format("YYYY-MM-DD") : "",
                  );
                }}
                onBlur={field.onBlur}
                required
                error={Boolean(errors.startDate)}
                helperText={getErrorMessage(errors.startDate?.message)}
              />
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                name={field.name}
                label={t("schedules.form.endDate")}
                value={field.value ? dayjs(field.value) : null}
                onChange={(value) => {
                  field.onChange(
                    value && value.isValid() ? value.format("YYYY-MM-DD") : "",
                  );
                }}
                onBlur={field.onBlur}
                required
                error={Boolean(errors.endDate)}
                helperText={getErrorMessage(errors.endDate?.message)}
              />
            )}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPickerField
                name={field.name}
                label={t("schedules.form.color")}
                value={field.value}
                required
                error={Boolean(errors.color)}
                helperText={
                  getErrorMessage(errors.color?.message) ?? t("schedules.form.colorHint")
                }
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                sx={{
                  m: 0,
                  px: 2,
                  minHeight: 56,
                }}
                control={
                  <Switch
                    checked={Boolean(field.value)}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                }
                label={t("schedules.form.isActive")}
              />
            )}
          />
        </Box>

        <Stack spacing={1}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ fontWeight: 900 }}>
              {t("schedules.form.operatingDays")}
            </Typography>

            <Chip
              size="medium"
              variant="outlined"
              label={`${activeDaysCount} / 7`}
              sx={{ fontWeight: 800 }}
            />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              size="medium"
              label={t("schedules.calendar.presetAllDays")}
              onClick={() => applyDayPreset("all")}
              sx={{ mb: 1, fontWeight: 800 }}
            />

            <Chip
              size="medium"
              label={t("schedules.calendar.presetWorkdays")}
              onClick={() => applyDayPreset("workdays")}
              sx={{ mb: 1, fontWeight: 800 }}
            />

            <Chip
              size="medium"
              label={t("schedules.calendar.presetWeekend")}
              onClick={() => applyDayPreset("weekend")}
              sx={{ mb: 1, fontWeight: 800 }}
            />

            <Chip
              size="medium"
              label={t("schedules.calendar.clearDays")}
              color="error"
              variant="outlined"
              onClick={() => applyDayPreset("clear")}
              sx={{ mb: 1, fontWeight: 800 }}
            />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {DAYS.map((day) => {
              const checked = Boolean(selectedDays[day.key]);

              return (
                <Chip
                  key={day.key}
                  label={t(day.labelKey)}
                  color={checked ? "primary" : "default"}
                  variant={checked ? "filled" : "outlined"}
                  onClick={() => toggleDay(day.key)}
                  sx={{
                    mb: 1,
                    fontWeight: 800,
                  }}
                />
              );
            })}
          </Stack>

          {errors.monday?.message && (
            <Typography variant="caption" color="error">
              {getErrorMessage(errors.monday.message)}
            </Typography>
          )}
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "flex-end" }}
        >
          {showReset && (
            <Button
              type="button"
              color="inherit"
              variant="outlined"
              startIcon={<RestartAltRoundedIcon />}
              onClick={() => reset(normalizedDefaultValues)}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              {t("common.reset")}
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveRoundedIcon />
              )
            }
            disabled={!isValid || loading || (disableSubmitWhenPristine && !isDirty)}
            sx={{ borderRadius: 2, minWidth: 150 }}
          >
            {loading ? t("common.saving") : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>{formContent}</CardContent>
    </Card>
  );
};

export default ScheduleForm;
