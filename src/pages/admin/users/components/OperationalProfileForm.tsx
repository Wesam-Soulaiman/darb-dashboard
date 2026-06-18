import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
  operationalProfileSchema,
  type OperationalProfileFormInputValues,
  type OperationalProfileFormValues,
} from "../../../../schemas/users/userSchemas";

type OperationalProfileFormProps = {
  defaultValues?: Partial<OperationalProfileFormInputValues>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: OperationalProfileFormValues) => Promise<void> | void;
};

const OperationalProfileForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
}: OperationalProfileFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<OperationalProfileFormInputValues, unknown, OperationalProfileFormValues>({
    resolver: zodResolver(operationalProfileSchema),
    mode: "onChange",
    defaultValues: {
      hireDate: defaultValues?.hireDate ?? "",
      status: defaultValues?.status ?? "ACTIVE",
      licenseNumber: defaultValues?.licenseNumber ?? "",
      licenseExpiry: defaultValues?.licenseExpiry ?? "",
    },
  });

  useEffect(() => {
    reset({
      hireDate: defaultValues?.hireDate ?? "",
      status: defaultValues?.status ?? "ACTIVE",
      licenseNumber: defaultValues?.licenseNumber ?? "",
      licenseExpiry: defaultValues?.licenseExpiry ?? "",
    });
  }, [
    defaultValues?.hireDate,
    defaultValues?.status,
    defaultValues?.licenseNumber,
    defaultValues?.licenseExpiry,
    reset,
  ]);

  const getErrorMessage = (message: unknown) =>
    typeof message === "string" ? t(message) : undefined;

  return (
    <Card variant="outlined" sx={{ borderColor: "divider", boxShadow: "none" }}>
      <CardContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  required
                  label={t("users.organizationUsers.status")}
                  value={field.value}
                  onChange={field.onChange}
                  error={Boolean(errors.status)}
                  helperText={getErrorMessage(errors.status?.message)}
                >
                  <MenuItem value="ACTIVE">{t("users.status.ACTIVE")}</MenuItem>
                  <MenuItem value="ON_LEAVE">{t("users.status.ON_LEAVE")}</MenuItem>
                  <MenuItem value="TERMINATED">{t("users.status.TERMINATED")}</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="hireDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label={t("users.organizationUsers.hireDate")}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  error={Boolean(errors.hireDate)}
                  helperText={getErrorMessage(errors.hireDate?.message)}
                />
              )}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="licenseNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("users.organizationUsers.licenseNumber")}
                    error={Boolean(errors.licenseNumber)}
                    helperText={getErrorMessage(errors.licenseNumber?.message)}
                  />
                )}
              />

              <Controller
                name="licenseExpiry"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label={t("users.organizationUsers.licenseExpiry")}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    error={Boolean(errors.licenseExpiry)}
                    helperText={getErrorMessage(errors.licenseExpiry?.message)}
                  />
                )}
              />
            </Stack>

            <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
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

export default OperationalProfileForm;
