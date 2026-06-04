import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  createBusSchema,
  updateBusSchema,
  type BusFormInputValues,
  type BusFormValues,
} from "../../../../schemas/organizations/busSchemas";
import type { BusStatus, BusType } from "../../../../types/bus.types";

type BusFormProps = {
  defaultValues?: Partial<BusFormInputValues>;
  loading?: boolean;
  submitLabel: string;
  mode?: "create" | "update";
  onSubmit: (values: BusFormValues) => Promise<void> | void;
};

const BUS_TYPES: BusType[] = ["STANDARD", "MINIBUS", "ARTICULATED"];

const BUS_STATUSES: BusStatus[] = [
  "AVAILABLE",
  "IN_SERVICE",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
];

const BusForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  mode = "create",
  onSubmit,
}: BusFormProps) => {
  const { t } = useTranslation();
  const isUpdateMode = mode === "update";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<BusFormInputValues, unknown, BusFormValues>({
    resolver: zodResolver(isUpdateMode ? updateBusSchema : createBusSchema),
    mode: "onChange",
    defaultValues: {
      plateNumber: defaultValues?.plateNumber ?? "",
      type: defaultValues?.type ?? "STANDARD",
      capacity: defaultValues?.capacity ?? 1,
      manufacturer: defaultValues?.manufacturer ?? "",
      model: defaultValues?.model ?? "",
      year: defaultValues?.year ?? new Date().getFullYear(),
      registrationExpiry: defaultValues?.registrationExpiry ?? "",
      status: defaultValues?.status ?? "AVAILABLE",
      lastMaintenanceDate: defaultValues?.lastMaintenanceDate ?? "",
      nextMaintenanceDate: defaultValues?.nextMaintenanceDate ?? "",
    },
  });

  const getErrorMessage = (message: unknown) => {
    if (typeof message !== "string") return undefined;
    return t(message);
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
              name="plateNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label={t("buses.form.plateNumber")}
                  error={Boolean(errors.plateNumber)}
                  helperText={getErrorMessage(errors.plateNumber?.message)}
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  required
                  label={t("buses.form.type")}
                  value={field.value ?? "STANDARD"}
                  onChange={(event) => field.onChange(event.target.value)}
                  error={Boolean(errors.type)}
                  helperText={getErrorMessage(errors.type?.message)}
                >
                  {BUS_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`buses.types.${type}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {isUpdateMode && (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    required
                    label={t("buses.form.status")}
                    value={field.value ?? "AVAILABLE"}
                    onChange={(event) => field.onChange(event.target.value)}
                    error={Boolean(errors.status)}
                    helperText={getErrorMessage(errors.status?.message)}
                  >
                    {BUS_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {t(`buses.statuses.${status}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}

            <Controller
              name="capacity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  fullWidth
                  required
                  label={t("buses.form.capacity")}
                  error={Boolean(errors.capacity)}
                  helperText={getErrorMessage(errors.capacity?.message)}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="manufacturer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label={t("buses.form.manufacturer")}
                  error={Boolean(errors.manufacturer)}
                  helperText={getErrorMessage(errors.manufacturer?.message)}
                />
              )}
            />

            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label={t("buses.form.model")}
                  error={Boolean(errors.model)}
                  helperText={getErrorMessage(errors.model?.message)}
                />
              )}
            />

            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  fullWidth
                  required
                  label={t("buses.form.year")}
                  error={Boolean(errors.year)}
                  helperText={getErrorMessage(errors.year?.message)}
                  slotProps={{
                    htmlInput: {
                      min: 1950,
                      max: 2100,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="registrationExpiry"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  fullWidth
                  required
                  label={t("buses.form.registrationExpiry")}
                  error={Boolean(errors.registrationExpiry)}
                  helperText={getErrorMessage(
                    errors.registrationExpiry?.message,
                  )}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}
            />

            {isUpdateMode && (
              <>
                <Controller
                  name="lastMaintenanceDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      fullWidth
                      label={t("buses.form.lastMaintenanceDate")}
                      error={Boolean(errors.lastMaintenanceDate)}
                      helperText={getErrorMessage(
                        errors.lastMaintenanceDate?.message,
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
                  name="nextMaintenanceDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      fullWidth
                      label={t("buses.form.nextMaintenanceDate")}
                      error={Boolean(errors.nextMaintenanceDate)}
                      helperText={getErrorMessage(
                        errors.nextMaintenanceDate?.message,
                      )}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  )}
                />
              </>
            )}

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

export default BusForm;