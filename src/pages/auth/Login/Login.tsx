import { zodResolver } from "@hookform/resolvers/zod";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import AuthCard from "../components/AuthCard";
import {
  loginSchema,
  type LoginFormValues,
} from "../../../schemas/auth/authSchemas";
import { useSignIn } from "../../../hooks/auth/useSignIn";
import { normalizeSyrianPhone } from "../../../utils/syrianPhone";

export default function Login() {
  const { t } = useTranslation();

  const signInMutation = useSignIn();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const passwordInputType = useMemo(
    () => (showPassword ? "text" : "password"),
    [showPassword],
  );

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      await signInMutation.mutateAsync({
        phone: normalizeSyrianPhone(values.phone),
        password: values.password,
      });
    } catch {
      setServerError(t("auth.login.invalidCredentials"));
    }
  };

  const isLoading = isSubmitting || signInMutation.isPending;

  return (
    <AuthCard
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
      footer={
        <Typography variant="body2" color="text.secondary">
          {t("auth.login.noAccount")}{" "}
          <MuiLink component={Link} to="/auth/login" underline="hover">
            {t("auth.login.contactAdmin")}
          </MuiLink>
        </Typography>
      }
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.25}>
          {serverError ? <Alert severity="error">{serverError}</Alert> : null}

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("auth.fields.phone")}
                placeholder="09XXXXXXXX"
                autoComplete="tel"
                error={Boolean(errors.phone)}
                helperText={
                  errors.phone?.message ? t(errors.phone.message) : " "
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneRoundedIcon color="primary" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("auth.fields.password")}
                type={passwordInputType}
                autoComplete="current-password"
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
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            fullWidth
            sx={{
              mt: 0.5,
              py: 1.25,
              borderRadius: 3,
              fontWeight: 900,
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("auth.login.submit")
            )}
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <MuiLink
              component={Link}
              to="/auth/reset-password"
              underline="hover"
              variant="body2"
              sx={{ fontWeight: 700 }}
            >
              {t("auth.login.forgotPassword")}
            </MuiLink>
          </Box>
        </Stack>
      </Box>
    </AuthCard>
  );
}