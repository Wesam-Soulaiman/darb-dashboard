import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  scheduleSchema,
  type ScheduleFormInputValues,
  type ScheduleFormValues,
} from "../../../../schemas/organizations/scheduleSchemas";

type ScheduleFormProps = {
  defaultValues?: Partial<ScheduleFormInputValues>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: ScheduleFormValues) => Promise<void> | void;
};

const DAYS: Array<{
  key:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
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

const ScheduleForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
}: ScheduleFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
  } = useForm<ScheduleFormInputValues, unknown, ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      serviceCode: defaultValues?.serviceCode ?? "",
      monday: defaultValues?.monday ?? true,
      tuesday: defaultValues?.tuesday ?? true,
      wednesday: defaultValues?.wednesday ?? true,
      thursday: defaultValues?.thursday ?? true,
      friday: defaultValues?.friday ?? false,
      saturday: defaultValues?.saturday ?? false,
      sunday: defaultValues?.sunday ?? true,
      startDate: defaultValues?.startDate ?? "",
      endDate: defaultValues?.endDate ?? "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

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

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
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

            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 800 }}>
                {t("schedules.form.operatingDays")}
              </Typography>

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
                        fontWeight: 700,
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

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    required
                    label={t("schedules.form.startDate")}
                    error={Boolean(errors.startDate)}
                    helperText={getErrorMessage(errors.startDate?.message)}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    required
                    label={t("schedules.form.endDate")}
                    error={Boolean(errors.endDate)}
                    helperText={getErrorMessage(errors.endDate?.message)}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                )}
              />
            </Stack>

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
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

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                disabled={!isValid || loading || !isDirty}
              >
                {loading ? t("common.saving") : submitLabel}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;