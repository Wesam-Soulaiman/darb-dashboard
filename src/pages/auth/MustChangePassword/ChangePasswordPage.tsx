import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useChangeMyPassword } from "../../../hooks/auth/useChangeMyPassword";
import { useAuthContext } from "../../../contexts/AuthContext";
import {
  changePasswordSchema,
  type ChangePasswordFormInputValues,
  type ChangePasswordFormValues,
} from "../../../schemas/auth/changePasswordSchema";

const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const { logout } = useAuthContext();
  const changePassword = useChangeMyPassword();

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

  const onSubmit = async (values: ChangePasswordFormValues) => {
    await changePassword.mutateAsync({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    logout();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          variant="outlined"
          sx={{
            borderColor: "divider",
            boxShadow: "none",
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <LockResetRoundedIcon fontSize="large" />
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {t("auth.changePassword.title")}
                </Typography>

                <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                  {t("auth.changePassword.subtitle")}
                </Typography>
              </Stack>

              <Alert severity="warning">
                {t("auth.changePassword.mustChangeMessage")}
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

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SaveRoundedIcon />}
                    disabled={!isValid || !isDirty || changePassword.isPending}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                    }}
                  >
                    {changePassword.isPending
                      ? t("common.saving")
                      : t("auth.changePassword.submit")}
                  </Button>
                </Stack>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                {t("auth.changePassword.loginAgainMessage")}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ChangePasswordPage;
