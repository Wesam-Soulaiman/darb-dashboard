import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardContent, Stack, TextField } from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  myProfileSchema,
  type MyProfileFormInputValues,
  type MyProfileFormValues,
} from "../../../../schemas/users/userSchemas";

type MyProfileFormProps = {
  defaultValues: MyProfileFormInputValues;
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: MyProfileFormValues) => Promise<void> | void;
};

const MyProfileForm = ({
  defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
}: MyProfileFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<MyProfileFormInputValues, unknown, MyProfileFormValues>({
    resolver: zodResolver(myProfileSchema),
    mode: "onChange",
    defaultValues,
  });

  const getErrorMessage = (message: unknown) =>
    typeof message === "string" ? t(message) : undefined;

  return (
    <Card variant="outlined" sx={{ borderColor: "divider", boxShadow: "none" }}>
      <CardContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
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

export default MyProfileForm;
