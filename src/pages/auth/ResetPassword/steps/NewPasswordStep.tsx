import { zodResolver } from "@hookform/resolvers/zod";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  resetNewPasswordSchema,
  type ResetNewPasswordFormValues,
} from "../../../../schemas/auth/resetPasswordSchemas";

type NewPasswordStepProps = {
  onBack: () => void;
  onSubmit: (password: string) => Promise<void>;
};

export default function NewPasswordStep({
  onBack,
  onSubmit,
}: NewPasswordStepProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordInputType = useMemo(
    () => (showPassword ? "text" : "password"),
    [showPassword],
  );

  const confirmPasswordInputType = useMemo(
    () => (showConfirmPassword ? "text" : "password"),
    [showConfirmPassword],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetNewPasswordFormValues>({
    resolver: zodResolver(resetNewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Stack spacing={2.25}>
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t("auth.fields.newPassword")}
            type={passwordInputType}
            autoComplete="new-password"
            error={Boolean(errors.password)}
            helperText={
              errors.password?.message ? t(errors.password.message) : " "
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label={t("auth.actions.togglePassword")}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? (
                        <VisibilityOffRoundedIcon />
                      ) : (
                        <VisibilityRoundedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t("auth.fields.confirmPassword")}
            type={confirmPasswordInputType}
            autoComplete="new-password"
            error={Boolean(errors.confirmPassword)}
            helperText={
              errors.confirmPassword?.message
                ? t(errors.confirmPassword.message)
                : " "
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label={t("auth.actions.togglePassword")}
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffRoundedIcon />
                      ) : (
                        <VisibilityRoundedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      <Button
        type="button"
        variant="contained"
        size="large"
        fullWidth
        disabled={isSubmitting}
        onClick={handleSubmit((values) => onSubmit(values.password))}
        sx={{
          py: 1.25,
          borderRadius: 3,
          fontWeight: 900,
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          t("auth.reset.saveNewPassword")
        )}
      </Button>

      <Button type="button" variant="text" onClick={onBack}>
        {t("auth.reset.backToOtp")}
      </Button>
    </Stack>
  );
}