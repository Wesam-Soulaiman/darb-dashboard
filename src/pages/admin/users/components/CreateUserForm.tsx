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
  createUserSchema,
  type CreateUserFormInputValues,
  type CreateUserFormValues,
} from "../../../../schemas/users/userSchemas";
import { useOrganizations } from "../../../../hooks/organizations/useOrganizations";

type CreateUserFormProps = {
  defaultValues?: Partial<CreateUserFormInputValues>;
  showOrganizationField?: boolean;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: CreateUserFormValues) => Promise<void> | void;
};

const CreateUserForm = ({
  defaultValues,
  showOrganizationField = false,
  loading = false,
  submitLabel,
  onSubmit,
}: CreateUserFormProps) => {
  const { t } = useTranslation();
  const organizations = useOrganizations();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateUserFormInputValues, unknown, CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
      firstName: "",
      lastName: "",
      email: "",
      organizationId: defaultValues?.organizationId ?? null,
      isActive: true,
      isDriver: false,
      hireDate: "",
      licenseNumber: "",
      licenseExpiry: "",
      ...defaultValues,
    },
  });

  const selectedOrganizationId = useWatch({
    control,
    name: "organizationId",
  });

  const isDriver = Boolean(
    useWatch({
      control,
      name: "isDriver",
    }),
  );

  const hasOrganization =
    selectedOrganizationId !== null &&
    selectedOrganizationId !== undefined &&
    selectedOrganizationId !== "";

  useEffect(() => {
    if (!hasOrganization && getValues("isDriver")) {
      setValue("isDriver", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [getValues, hasOrganization, setValue]);

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

  const organizationList = organizations.data ?? [];

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
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label={t("users.form.phone")}
                  error={Boolean(errors.phone)}
                  helperText={getErrorMessage(errors.phone?.message)}
                />
              )}
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label={t("users.form.firstName")}
                    error={Boolean(errors.firstName)}
                    helperText={getErrorMessage(errors.firstName?.message)}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label={t("users.form.lastName")}
                    error={Boolean(errors.lastName)}
                    helperText={getErrorMessage(errors.lastName?.message)}
                  />
                )}
              />
            </Stack>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  type="email"
                  label={t("users.form.email")}
                  error={Boolean(errors.email)}
                  helperText={getErrorMessage(errors.email?.message)}
                />
              )}
            />

            {showOrganizationField && (
              <Controller
                name="organizationId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label={t("users.form.organization")}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={organizations.isLoading || loading}
                    error={Boolean(errors.organizationId)}
                    helperText={getErrorMessage(errors.organizationId?.message)}
                  >
                    <MenuItem value="">{t("users.form.noOrganization")}</MenuItem>

                    {organizationList.map((organization) => (
                      <MenuItem key={organization.id} value={organization.id}>
                        {organization.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(field.value)}
                      onChange={(_event, checked) => field.onChange(checked)}
                      disabled={loading}
                    />
                  }
                  label={t("users.form.isActive")}
                />
              )}
            />

            <Divider />

            <Stack spacing={1}>
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
                          disabled={loading || !hasOrganization}
                        />
                      }
                      label={t("users.form.isDriver")}
                    />

                    <FormHelperText>
                      {errors.isDriver?.message
                        ? getErrorMessage(errors.isDriver.message)
                        : hasOrganization
                          ? t("users.form.isDriverHelper")
                          : t("users.form.driverRequiresOrganization")}
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

            <Divider />

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
                  error={Boolean(errors.hireDate)}
                  helperText={getErrorMessage(errors.hireDate?.message)}
                />
              )}
            />

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

export default CreateUserForm;
