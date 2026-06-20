import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DriveEtaRoundedIcon from "@mui/icons-material/DriveEtaRounded";
import { Controller, useForm, useWatch } from "react-hook-form";
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
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<OperationalProfileFormInputValues, unknown, OperationalProfileFormValues>({
    resolver: zodResolver(operationalProfileSchema),
    mode: "onChange",
    defaultValues: {
      hireDate: defaultValues?.hireDate ?? "",
      status: defaultValues?.status ?? "ACTIVE",
      isDriver: defaultValues?.isDriver ?? false,
      licenseNumber: defaultValues?.licenseNumber ?? "",
      licenseExpiry: defaultValues?.licenseExpiry ?? "",
    },
  });

  const isDriver = Boolean(
    useWatch({
      control,
      name: "isDriver",
    }),
  );

  useEffect(() => {
    reset({
      hireDate: defaultValues?.hireDate ?? "",
      status: defaultValues?.status ?? "ACTIVE",
      isDriver: defaultValues?.isDriver ?? false,
      licenseNumber: defaultValues?.licenseNumber ?? "",
      licenseExpiry: defaultValues?.licenseExpiry ?? "",
    });
  }, [
    defaultValues?.hireDate,
    defaultValues?.status,
    defaultValues?.isDriver,
    defaultValues?.licenseNumber,
    defaultValues?.licenseExpiry,
    reset,
  ]);

  useEffect(() => {
    if (isDriver) {
      return;
    }

    const currentLicenseNumber = getValues("licenseNumber");

    const currentLicenseExpiry = getValues("licenseExpiry");

    if (currentLicenseNumber) {
      setValue("licenseNumber", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (currentLicenseExpiry) {
      setValue("licenseExpiry", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [getValues, isDriver, setValue]);

  const getErrorMessage = (message: unknown) =>
    typeof message === "string" ? t(message) : undefined;

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
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
                  disabled={loading}
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
                  required
                  type="date"
                  label={t("users.organizationUsers.hireDate")}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  disabled={loading}
                  error={Boolean(errors.hireDate)}
                  helperText={getErrorMessage(errors.hireDate?.message)}
                />
              )}
            />

            <Divider />

            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <DriveEtaRoundedIcon color="action" />

                <Typography sx={{ fontWeight: 800 }}>
                  {t("users.form.driverInformation")}
                </Typography>
              </Stack>

              <Controller
                name="isDriver"
                control={control}
                render={({ field }) => (
                  <FormControl error={Boolean(errors.isDriver)}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(field.value)}
                          onChange={(_event, checked) => field.onChange(checked)}
                          disabled={loading}
                        />
                      }
                      label={t("users.form.isDriver")}
                    />

                    <FormHelperText>
                      {errors.isDriver?.message
                        ? getErrorMessage(errors.isDriver.message)
                        : t("users.form.isDriverHelper")}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Collapse in={isDriver}>
                <Stack spacing={2} sx={{ pt: 1 }}>
                  <Controller
                    name="licenseNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        fullWidth
                        required={isDriver}
                        disabled={loading}
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
                        value={field.value ?? ""}
                        fullWidth
                        required={isDriver}
                        disabled={loading}
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
              </Collapse>
            </Stack>

            <Stack
              direction="row"
              sx={{
                justifyContent: "flex-end",
              }}
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

export default OperationalProfileForm;
