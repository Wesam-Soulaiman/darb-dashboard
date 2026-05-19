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
  userSchema,
  type UserFormInputValues,
  type UserFormValues,
} from "../../../../schemas/users/userSchemas";
import { useOrganizations } from "../../../../hooks/organizations/useOrganizations";

type UserFormProps = {
  defaultValues?: Partial<UserFormInputValues>;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
};

const UserForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
}: UserFormProps) => {
  const { t } = useTranslation();
  const organizations = useOrganizations();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<UserFormInputValues, unknown, UserFormValues>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      phone: defaultValues?.phone ?? "",
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      email: defaultValues?.email ?? "",
      organizationId: defaultValues?.organizationId ?? null,
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
        borderRadius: 4,
        overflow: "hidden",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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

            <Controller
              name="organizationId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label={t("users.form.organization")}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    field.onChange(event.target.value || null);
                  }}
                  error={Boolean(errors.organizationId)}
                  helperText={getErrorMessage(errors.organizationId?.message)}
                  disabled={organizations.isLoading}
                >
                  <MenuItem value="">{t("users.form.noOrganization")}</MenuItem>

                  {(organizations.data ?? []).map((organization) => (
                    <MenuItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </MenuItem>
                  ))}
                </TextField>
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

export default UserForm;