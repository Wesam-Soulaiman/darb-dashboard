import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  createUserSchema,
  type CreateUserFormInputValues,
  type CreateUserFormValues,
} from "../../../../schemas/users/userSchemas";
import { useOrganizations } from "../../../../hooks/organizations/useOrganizations";
import type { Organization } from "../../../../types/organization.types";

type CreateUserFormProps = {
  showOrganizationField: boolean;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: CreateUserFormValues) => Promise<void> | void;
};

const CreateUserForm = ({
  showOrganizationField,
  loading = false,
  submitLabel,
  onSubmit,
}: CreateUserFormProps) => {
  const { t } = useTranslation();
  const organizations = useOrganizations();

  const organizationsList: Organization[] = organizations.data ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateUserFormInputValues, unknown, CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
      firstName: "",
      lastName: "",
      email: "",
      organizationId: null,
      isActive: true,
      hireDate: "",
      licenseNumber: "",
      licenseExpiry: "",
    },
  });

  const getErrorMessage = (message: unknown) =>
    typeof message === "string" ? t(message) : undefined;

  return (
    <Card variant="outlined" sx={{ borderColor: "divider", boxShadow: "none" }}>
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

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                    disabled={organizations.isLoading}
                    error={Boolean(errors.organizationId)}
                    helperText={getErrorMessage(errors.organizationId?.message)}
                  >
                    <MenuItem value="">
                      {t("users.form.noOrganization")}
                    </MenuItem>

                    {organizationsList.map((organization) => (
                      <MenuItem key={organization.id} value={organization.id}>
                        {organization.name} #{organization.id}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}

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

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(field.value)}
                      onChange={(_, checked) => field.onChange(checked)}
                    />
                  }
                  label={t("users.form.isActive")}
                />
              )}
            />

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

export default CreateUserForm;