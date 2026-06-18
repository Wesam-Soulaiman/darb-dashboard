import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  changePasswordSchema,
  type ChangePasswordFormInputValues,
  type ChangePasswordFormValues,
} from "../../../../schemas/auth/changePasswordSchema";

type ChangeMyPasswordFormProps = {
  loading?: boolean;
  submitLabel: string;
  onSubmit: (values: ChangePasswordFormValues) => Promise<void> | void;
};

const ChangeMyPasswordForm = ({
  loading = false,
  submitLabel,
  onSubmit,
}: ChangeMyPasswordFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<ChangePasswordFormInputValues, unknown, ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const getErrorMessage = (message: unknown) =>
    typeof message === "string" ? t(message) : undefined;

  return (
    <Card variant="outlined" sx={{ borderColor: "divider", boxShadow: "none" }}>
      <CardContent>
        <Stack spacing={2.5}>
          <Alert severity="info">
            <Stack spacing={0.5}>
              <Typography sx={{ fontWeight: 800 }}>
                {t("auth.changePassword.title")}
              </Typography>

              <Typography variant="body2">
                {t("auth.changePassword.loginAgainMessage")}
              </Typography>
            </Stack>
          </Alert>

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="password"
                    label={t("auth.changePassword.currentPassword")}
                    error={Boolean(errors.currentPassword)}
                    helperText={getErrorMessage(errors.currentPassword?.message)}
                  />
                )}
              />

              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="password"
                    label={t("auth.changePassword.newPassword")}
                    error={Boolean(errors.newPassword)}
                    helperText={getErrorMessage(errors.newPassword?.message)}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="password"
                    label={t("auth.changePassword.confirmPassword")}
                    error={Boolean(errors.confirmPassword)}
                    helperText={getErrorMessage(errors.confirmPassword?.message)}
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
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChangeMyPasswordForm;
